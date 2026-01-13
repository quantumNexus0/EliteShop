from fastapi import APIRouter, Depends, HTTPException
from database import get_db_connection
from auth_utils import get_current_user
import json

router = APIRouter(tags=["wishlist"])

@router.get("/")
def get_wishlist(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT p.* FROM products p
        JOIN wishlist w ON p.id = w.product_id
        WHERE w.user_id = %s
    """, (current_user['id'],))
    
    products = cursor.fetchall()
    
    # Parse JSON fields
    for p in products:
        p['images'] = json.loads(p['images']) if p['images'] else []
        p['tags'] = json.loads(p['tags']) if p['tags'] else []
        p['sizes'] = json.loads(p['sizes']) if p['sizes'] else []
        p['colors'] = json.loads(p['colors']) if p['colors'] else []
        p['inStock'] = bool(p['inStock'])
        p['featured'] = bool(p['featured'])
        p['isNew'] = bool(p['isNew'] or False)
        p['isBestseller'] = bool(p['isBestseller'] or False)

    cursor.close()
    conn.close()
    return products

@router.post("/{product_id}")
def add_to_wishlist(product_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (%s, %s)",
            (current_user['id'], product_id)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
    
    return {"message": "Product added to wishlist"}

@router.delete("/{product_id}")
def remove_from_wishlist(product_id: str, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "DELETE FROM wishlist WHERE user_id = %s AND product_id = %s",
            (current_user['id'], product_id)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
    
    return {"message": "Product removed from wishlist"}
