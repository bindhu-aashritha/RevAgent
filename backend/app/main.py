from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base, get_db, SessionLocal
from app.models import RecoveryEvent, AuditLog
from app.schemas import RecoveryEventResponse, AuditLogResponse
from app.engine.guardrails import SafetyGuardrails
from app.engine.diagnostics import FailureDiagnostics
from app.services.llm_agent import RecoveryAgent
from app.services.razorpay_service import RazorpayService
from app.services.messaging_service import MessagingService
from app.mock.event_simulator import run_batch_simulation

Base.metadata.create_all(bind=engine)

app = FastAPI(title="RevAgent - Razorpay AI Revenue Recovery Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

razorpay_service = RazorpayService()

def process_recovery_workflow(event_id: str, db: Session):
    event = db.query(RecoveryEvent).filter(RecoveryEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    failure_reason = getattr(event, "failure_reason", "")
    customer_phone = getattr(event, "customer_phone", "+919876543210")
    customer_email = getattr(event, "customer_email", "customer@example.com")

    # 1. Structural Diagnostics
    diag_result = FailureDiagnostics.analyze_failure(event.failure_code, failure_reason)
    db.add(AuditLog(event_id=event.id, step="DIAGNOSTICS", details=diag_result))

    # 2. LLM Reasoning
    agent_output = RecoveryAgent.generate_intervention(
        event.customer_name, event.amount, event.failure_code, failure_reason
    )
    db.add(AuditLog(event_id=event.id, step="LLM_PLANNING", details=agent_output))

    # 3. Guardrail Check
    is_allowed, guardrail_msg, final_discount = SafetyGuardrails.validate_action(
        event.attempts_made, event.amount, agent_output.get("proposed_discount_pct", 0.0)
    )
    db.add(AuditLog(
        event_id=event.id, 
        step="GUARDRAIL_EVALUATION", 
        details={"allowed": is_allowed, "reason": guardrail_msg, "final_discount": final_discount}
    ))

    if not is_allowed:
        event.status = "ESCALATED"
        db.commit()
        return {"status": "escalated", "event_id": event_id}

    # 4. Generate Razorpay Link
    link_res = razorpay_service.create_recovery_payment_link(
        amount=event.amount,
        customer_name=event.customer_name,
        customer_phone=customer_phone,
        customer_email=customer_email,
        discount_pct=final_discount
    )
    db.add(AuditLog(event_id=event.id, step="RAZORPAY_LINK_CREATED", details=link_res))

    # 5. Dispatch Action
    channel = agent_output.get("recommended_channel", "WHATSAPP")
    message_body = agent_output.get("hinglish_message", "")
    short_url = link_res.get("short_url", "https://rzp.io/i/mock_link")

    if channel == "WHATSAPP":
        dispatch_res = MessagingService.dispatch_whatsapp(customer_phone, message_body, short_url)
    else:
        dispatch_res = MessagingService.dispatch_sms(customer_phone, message_body, short_url)

    db.add(AuditLog(event_id=event.id, step="MESSAGE_DISPATCHED", details=dispatch_res))

    event.attempts_made += 1
    event.applied_discount_pct = final_discount
    event.status = "OUTREACH_DISPATCHED"
    db.commit()
    return {"status": "success", "event_id": event_id}

@app.post("/api/batch/simulate")
def trigger_batch(count: int = 50, db: Session = Depends(get_db)):
    total_created = run_batch_simulation(db, count)
    return {"status": "success", "events_created": total_created}

@app.post("/api/events/{event_id}/recover")
def recover_event(event_id: str, db: Session = Depends(get_db)):
    return process_recovery_workflow(event_id, db)

@app.get("/api/events", response_model=List[RecoveryEventResponse])
def get_events(db: Session = Depends(get_db)):
    return db.query(RecoveryEvent).order_by(RecoveryEvent.created_at.desc()).all()

@app.get("/api/audit-logs/{event_id}", response_model=List[AuditLogResponse])
def get_audit_logs(event_id: str, db: Session = Depends(get_db)):
    return db.query(AuditLog).filter(AuditLog.event_id == event_id).all()