from fastapi import APIRouter, Depends, HTTPException
from database import get_db_connection
from auth_utils import get_current_user
from pydantic import BaseModel

router = APIRouter(tags=["notifications"])

@router.get("/")
def get_notifications(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM notifications WHERE user_id = %s ORDER BY created_at DESC", 
        (current_user['id'],)
    )
    notifications = cursor.fetchall()
    cursor.close()
    conn.close()
    return notifications

@router.put("/{notification_id}/read")
def mark_as_read(notification_id: int, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE notifications SET is_read = TRUE WHERE id = %s AND user_id = %s",
        (notification_id, current_user['id'])
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Notification marked as read"}
