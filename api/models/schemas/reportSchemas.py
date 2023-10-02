from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class ReportType(Enum):
    POST = 'POST'
    USER = 'USER'

class ReportSchema(BaseModel):
    id: int
    user_id: int
    reason: str
    reported_type: ReportType
    reported_id: str | int
    created_at: datetime

    class Config:
        orm_mode = True

class PinnedReportSchema(BaseModel):
    id: int
    reason: str
    reported_type: ReportType
    is_pinned: bool
