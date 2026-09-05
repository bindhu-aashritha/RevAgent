import random
import uuid
from sqlalchemy.orm import Session
from app.models import RecoveryEvent

FAILURE_SCENARIOS = [
    ("BAD_REQUEST_PAYMENT_TIMED_OUT", "Payment timed out at bank gateway"),
    ("INSUFFICIENT_FUNDS", "Account has insufficient balance"),
    ("AUTHENTICATION_FAILED", "3DS OTP verification failed"),
    ("GATEWAY_DOWNTIME", "HDFC bank servers temporarily unreachable")
]

NAMES = ["Aarav Sharma", "Priya Patel", "Rohan Mehta", "Ananya Iyer", "Vikram Singh"]

def run_batch_simulation(db: Session, count: int = 50):
    created_events = []
    for _ in range(count):
        code, reason = random.choice(FAILURE_SCENARIOS)
        event = RecoveryEvent(
            id=f"evt_{uuid.uuid4().hex[:8]}",
            razorpay_payment_id=f"pay_{uuid.uuid4().hex[:10]}",
            customer_name=random.choice(NAMES),
            customer_phone=f"+9198{random.randint(10000000, 99999999)}",
            customer_email="customer@example.com",
            amount=round(random.uniform(250.0, 5000.0), 2),
            failure_code=code,
            failure_reason=reason,
            status="PENDING",
            attempts_made=0
        )
        db.add(event)
        created_events.append(event)
    
    db.commit()
    return len(created_events)