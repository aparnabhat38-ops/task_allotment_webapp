from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.approval import ApprovalRequest
from app.models.task import Task
from app.schemas.schemas import (
    ApprovalRequestCreate,
    ApprovalResponse
)

router = APIRouter()
@router.post(
    "/request-status",
    response_model=ApprovalResponse
)
def request_status_change(
    request: ApprovalRequestCreate,
    db: Session = Depends(get_db)
):

    new_request = ApprovalRequest(
        task_id=request.task_id,
        requested_by=request.requested_by,
        requested_status=request.requested_status,
        approval_status="Pending"
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return new_request
@router.get(
    "/pending-requests",
    response_model=list[ApprovalResponse]
)
def get_pending_requests(
    db: Session = Depends(get_db)
):

    requests = db.query(
        ApprovalRequest
    ).filter(
        ApprovalRequest.approval_status == "Pending"
    ).all()

    return requests

@router.get(
    "/all-requests",
    response_model=list[ApprovalResponse]
)
def get_all_requests(
    db: Session = Depends(get_db)
):
    requests = db.query(ApprovalRequest).all()
    return requests
@router.post("/approve/{request_id}")
def approve_request(
    request_id: int,
    db: Session = Depends(get_db)
):

    request = db.query(
        ApprovalRequest
    ).filter(
        ApprovalRequest.id == request_id
    ).first()

    if not request:
        return {"message": "Request not found"}

    request.approval_status = "Approved"

    task = db.query(Task).filter(
        Task.id == request.task_id
    ).first()

    if task:
        task.status = request.requested_status

    db.commit()

    return {"message": "Request Approved"}
@router.post("/reject/{request_id}")
def reject_request(
    request_id: int,
    db: Session = Depends(get_db)
):

    request = db.query(
        ApprovalRequest
    ).filter(
        ApprovalRequest.id == request_id
    ).first()

    if not request:
        return {"message": "Request not found"}

    request.approval_status = "Rejected"

    db.commit()

    return {"message": "Request Rejected"}