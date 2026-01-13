from fastapi import APIRouter, Depends, HTTPException, status
from database import get_db_connection
from auth_utils import get_current_user
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(tags=["addresses"])

class AddressSchema(BaseModel):
    type: str = "home"
    name: str
    street: str
    city: str
    state: str
    zipCode: str
    country: str
    phone: Optional[str] = None
    isDefault: bool = False

@router.get("/")
def get_addresses(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM addresses WHERE user_id = %s", (current_user['id'],))
    addresses = cursor.fetchall()
    
    cursor.close()
    conn.close()
    return addresses

@router.post("/")
def add_address(address: AddressSchema, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if address.isDefault:
        cursor.execute("UPDATE addresses SET isDefault = FALSE WHERE user_id = %s", (current_user['id'],))
    
    try:
        cursor.execute(
            """
            INSERT INTO addresses (user_id, type, name, street, city, state, zipCode, country, phone, isDefault)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (current_user['id'], address.type, address.name, address.street, address.city, 
             address.state, address.zipCode, address.country, address.phone, address.isDefault)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
    
    return {"message": "Address added successfully"}

@router.put("/{address_id}")
def update_address(address_id: int, address: AddressSchema, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if address.isDefault:
        cursor.execute("UPDATE addresses SET isDefault = FALSE WHERE user_id = %s", (current_user['id'],))
        
    try:
        cursor.execute(
            """
            UPDATE addresses 
            SET type = %s, name = %s, street = %s, city = %s, state = %s, 
                zipCode = %s, country = %s, phone = %s, isDefault = %s
            WHERE id = %s AND user_id = %s
            """,
            (address.type, address.name, address.street, address.city, address.state, 
             address.zipCode, address.country, address.phone, address.isDefault, address_id, current_user['id'])
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
    
    return {"message": "Address updated successfully"}

@router.delete("/{address_id}")
def delete_address(address_id: int, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM addresses WHERE id = %s AND user_id = %s", (address_id, current_user['id']))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
    
    return {"message": "Address deleted successfully"}
