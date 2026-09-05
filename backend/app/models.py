import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from app.database import Base

class RecoveryEvent(Base):
    __tablename__ = "recovery_events"

    id = Column(String, primary_key=True)  # e.g., evt_101
    razorpay_payment_id = Column(String, nullable=True)
    customer_name = Column(String)
    customer_phone = Column(String)
    customer_email = Column(String)
    amount = Column(Float)
    failure_code = Column(String)
    failure_reason = Column(String)
    status = Column(String, default="PENDING")  # PENDING, RECOVERED, ESCALATED, EXHAUSTED
    
    attempts_made = Column(Integer, default=0)
    applied_discount_pct = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    event_id = Column(String, ForeignKey("recovery_events.id"))
    step = Column(String)  # DIAGNOSIS, GUARDRAIL_CHECK, INTERVENTION_DISPATCH
    details = Column(JSON)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)