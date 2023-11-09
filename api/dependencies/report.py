from models.Notification import AdminNotification
from models.Reports import Report
from sqlalchemy.orm import Session


async def delete_other_reports_except_current(
    db: Session, report_id: int, report: Report
):
    # Query for other reports on the same reported item, excluding the current one
    other_reports = (
        db.query(Report)
        .filter(
            Report.reported_id == report.reported_id,
            Report.reported_type == report.reported_type,
            Report.id != report_id,
        )
        .all()
    )

    # Delete the other reports
    for other_report in other_reports:
        db.delete(other_report)

    # Commit the changes to the database
    db.commit()

    return



async def delete_notifications_report(db: Session, reported_id):
    # Query for notifications associated with the reported item
    notifications = (
        db.query(AdminNotification)
        .filter(AdminNotification.report_id_post == reported_id)
        .all()
    )

    # Delete the notifications
    for notification in notifications:
        db.delete(notification)

    # Commit the changes to the database
    db.commit()

    return
