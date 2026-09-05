from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import datetime

class WebhookPayload(BaseModel):
    event: str
    payload: Dict[str, Any]

class RecoveryEventResponse(BaseModel):
    id: str
    customer_name: str
    amount: float
    failure_code: str
    status: str
    attempts_made: int
    applied_discount_pct: float
    created_at: datetime

    class Config:
        from_attributes = True

class AuditLogResponse(BaseModel):
    id: int
    event_id: str
    step: str
    details: Dict[str, Any]
    timestamp: datetime

    class Config:
        from_attributes = True