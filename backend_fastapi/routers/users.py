from fastapi import APIRouter, Depends, HTTPException
from database import get_db_connection
from auth_utils import get_current_user
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(tags=["users"])

class UserProfileUpdate(BaseModel):
    name: str
    phone: Optional[str] = None

@router.get("/all")
def get_all_users(current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Forbidden")
        
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name, email, role, phone, created_at FROM users ORDER BY created_at DESC")
        users = cursor.fetchall()
        
        cursor.execute("SELECT COUNT(*) as total FROM users")
        stats = cursor.fetchone()
        
        cursor.close()
        return {"users": users, "total": stats['total']}
    finally:
        conn.close()

@router.get("/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
        
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name, email, role, phone, created_at FROM users WHERE id = %s", (current_user['id'],))
        user = cursor.fetchone()
        cursor.close()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    finally:
        conn.close()

@router.put("/profile")
def update_profile(profile: UserProfileUpdate, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE users SET name = %s, phone = %s WHERE id = %s",
            (profile.name, profile.phone, current_user['id'])
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
    
    return {"message": "Profile updated successfully"}
