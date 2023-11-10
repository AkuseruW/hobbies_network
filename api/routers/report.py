import json
from typing import Dict, List, Union
from fastapi import APIRouter, HTTPException, Depends, Request, Query
import httpx
from sqlalchemy.orm import Session
from dependencies.report import delete_notifications_report, delete_other_reports_except_current
from models.Notification import AdminNotification
from models.schemas.reportSchemas import PinnedReportSchema
from settings.database import get_session
from models import Post, User, Report
from dependencies.auth import get_current_active_user
from dotenv import load_dotenv
import os
from sqlalchemy import desc


load_dotenv()
api_url = os.getenv("API_URL")

router = APIRouter(
    prefix="/api", tags=["reports"], dependencies=[Depends(get_current_active_user)]
)


class ReportsQueryParams:
    def __init__(
            self,
            page: int = Query(1, description="page"),
            per_page: int = Query(10, description="per_page"),
            search: str = Query(None, description="search"),
    ):
        self.page = page
        self.per_page = per_page
        self.search = search


"""
Retrieves paginated reports from the database.

Parameters:
    - params: An instance of ReportsQueryParams, representing the query parameters for pagination.
    - db: An instance of Session, representing the database session.
    - current_user: An instance of User, representing the current logged-in user.

Returns:
    - A dictionary containing the paginated reports and the total number of pages.
"""


@router.get("/reports")
async def read_reports(
        params: ReportsQueryParams = Depends(),
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user),
):
    # Check if the current user has admin role
    if current_user.role.value != "ROLE_ADMIN":
        raise HTTPException(
            status_code=403, detail="You are not authorized to perform this action."
        )

    offset = (params.page - 1) * params.per_page
    total_reports = db.query(Report).count()
    total_pages = (total_reports + params.per_page - 1) // params.per_page

    if params.page < 1:
        params.page = 1
    elif params.page > total_pages:
        return {"reports": [], "totalPages": total_pages}

    # Retrieve paginated reports from the database
    reports = db.query(Report).order_by(desc(Report.is_read == False)).offset(offset).limit(params.per_page).all()

    return {"reports": reports, "totalPages": total_pages}


"""
Retrieves a list of pinned reports.

Parameters:
    - db (Session): The database session.
    - current_user (User): The currently authenticated user.

Returns:
    - List[Dict[str, Union[str, int]]]: A list of dictionaries containing the pinned report data. Each dictionary contains the following keys:
        - "reported_id" (str): The ID of the reported item.
        - "reported_type" (str): The type of the reported item.
        - "reason" (str): The reason for the report.

Raises:
    - HTTPException: If the current user is not authorized to perform this action.
"""


@router.get("/pinned_reports", response_model=Dict[str, Union[List[PinnedReportSchema], int]])
def pin_reports(
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user),
):
    if current_user.role.value != "ROLE_ADMIN":
        raise HTTPException(
            status_code=403, detail="You are not authorized to perform this action."
        )

    reports = db.query(Report).filter(Report.is_pinned == True).all()
    pinned_reports_count = len(reports)

    pinned_reports = [
        PinnedReportSchema(
            id=report.id,
            reason=report.reason,
            reported_type=report.reported_type.value,
            is_pinned=report.is_pinned,
        )
        for report in reports
    ]

    return {"pinnedReports": pinned_reports, "pinnedReportsCount": pinned_reports_count}


"""
Retrieves a report by its ID from the database.

Parameters:
    report_id (int): The ID of the report to retrieve.
    db (Session, optional): The database session. Defaults to the result of the `get_session` dependency.
    current_user (User, optional): The current user. Defaults to the result of the `get_current_active_user` dependency.

Raises:
    HTTPException: If the current user does not have the role "ROLE_ADMIN" or if the report is not found.

Returns:
    Report: The found report.
"""


@router.get("/report/{report_id}", response_model=None)
def read_report(
        report_id: int,
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user),
):
    if current_user.role.value != "ROLE_ADMIN":
        raise HTTPException(
            status_code=403, detail="You are not authorized to perform this action."
        )

    report = db.query(Report).filter_by(id=report_id).first()

    if not report.is_read:
        report.is_read = True
        db.commit()
        db.refresh(report)

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    return report


"""
Create a report and save it in the database.

Parameters:
- request: The HTTP request object.
- db: The database session.
- current_user: The currently authenticated user.

Returns:
- A dictionary containing a success message.

Raises:
- HTTPException: If the 'reported_type' field is not 'POST' or 'USER'.
"""


@router.post("/report")
async def create_report(
        request: Request,
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user),
):
    data = await request.json()
    reported_id = data["reported_id"]
    reason = data["reason"]
    reported_type = data["reported_type"]
    report_content = data["details"]

    if reported_type not in {"POST", "USER"}:
        raise HTTPException(
            status_code=400,
            detail="Le champ 'reported_type' doit être 'POST' ou 'USER'.",
        )

    report = Report(
        reported_id=str(reported_id),
        reason=reason,
        content = report_content,
        reported_type=reported_type,
        user_id=current_user.id,
    )
    db.add(report)
    db.commit()

    return {"message": "Le signalement a été enregistré avec succès."}


"""
Update a report in the database.

Args:
    report_id (int): The ID of the report to be updated.
    report_data (ReportSchema): The updated data for the report.
    db (Session): The database session.
    current_user (User): The currently authenticated user.

Raises:
    HTTPException: If the current user is not authorized to perform the update.

Returns:
    Report: The updated report.
"""


@router.patch("/report/pin_unpin/{report_id}", response_model=None)
async def update_report(
        report_id: int,
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user),
):
    if current_user.role.value != "ROLE_ADMIN":
        raise HTTPException(
            status_code=403, detail="You are not authorized to perform this action."
        )

    report = db.query(Report).filter_by(id=report_id).first()

    if report.is_pinned == False:
        report.is_pinned = True
        message = "Le signalement a été épingle avec succès."
    else:
        report.is_pinned = False
        message = "Le signalement a été désépingle avec succès."

    db.commit()
    db.refresh(report)

    return {"message": message}


"""
Approve a report by setting its "is_process" flag to True and sending a request to ban the associated user.

Args:
    report_id (int): The ID of the report to be approved.
    request (Request): The request object containing information about the HTTP request.
    db (Session, optional): The database session. Defaults to Depends(get_session).
    current_user (User, optional): The current user. Defaults to Depends(get_current_active_user).

Raises:
    HTTPException: If the current user is not authorized to perform this action or if there is an error during the request to ban the user.

Returns:
    dict: A dictionary with a success message indicating that the report has been approved and a ban request has been sent.
"""


@router.patch("/report/approve/{report_id}", response_model=None)
async def approve_report(
        report_id: int,
        request: Request,
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user),
):
    if current_user.role.value != "ROLE_ADMIN":
        raise HTTPException(
            status_code=403, detail="You are not authorized to perform this action."
        )

    request_body = await request.body()
    request_data = json.loads(request_body)
    duration = request_data.get("duration")

    access_token = request.headers.get("Authorization")

    report = db.query(Report).filter_by(id=report_id).first()
    user = db.query(User).filter_by(id=report.user_id).first()
    
    report_type = report.reported_type.value
    
    if report_type == "POST":
        post = db.query(Post).filter_by(id=str(report.reported_id)).first()
        post_user_id = post.user_id

    if report.is_process == True:
        raise HTTPException(
            status_code=400, detail="Le signalement a déjà été approuvé."
        )

    report.is_process = True

    if duration > 0:
        data = {"reason": report.reason}

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{api_url}/api/ban_user/{post_user_id}/{duration}",
                json=data,
                headers={"Authorization": access_token},
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail="Erreur lors de la demande POST vers /ban_user",
            )

    await delete_other_reports_except_current(db, report_id, report)
    await delete_notifications_report(db, reported_id=report.reported_id)

    db.commit()
    db.refresh(report)

    return {"message": "Le signalement a été approuvé avec succès"}


@router.patch("report/reject/{report_id}", response_model=None)
async def reject_report(
        report_id: int,
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_active_user),
):
    if current_user.role.value != "ROLE_ADMIN":
        raise HTTPException(
            status_code=403, detail="You are not authorized to perform this action."
        )

    report = db.query(Report).filter_by(id=report_id).first()

    if report.is_process == True:
        raise HTTPException(
            status_code=400, detail="Le signalement a déjà été approuvé."
        )

    report.is_process = True
    await delete_other_reports_except_current(db, report_id, report)
    await delete_notifications_report(db, reported_id=report.reported_id)

    db.commit()
    db.refresh(report)

    return {"message": "Le signalement a été refusé avec succès."}
