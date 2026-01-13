from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import List, Optional
from database import get_db_connection
from auth_utils import get_current_user
import uuid
import json

router = APIRouter()

class OrderItemSchema(BaseModel):
    product_id: str
    quantity: int
    price: float

class OrderCreate(BaseModel):
    items: List[OrderItemSchema]
    total_amount: float
    shipping_address: str

@router.post("/")
def create_order(order: OrderCreate, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor()
    order_id = str(uuid.uuid4())
    
    try:
        # Create order
        cursor.execute(
            "INSERT INTO orders (id, user_id, total_amount, shipping_address, status) VALUES (%s, %s, %s, %s, %s)",
            (order_id, current_user['id'], order.total_amount, order.shipping_address, "pending")
        )
        
        # Create order items
        for item in order.items:
            cursor.execute(
                "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (%s, %s, %s, %s)",
                (order_id, item.product_id, item.quantity, item.price)
            )
        
        conn.commit()
        
        # Send confirmation email
        try:
            # We need to get the user's email. it's in current_user['email']
            from email_utils import send_order_confirmation_email
            send_order_confirmation_email(current_user['email'], order_id, order.total_amount, order.items)
        except Exception as email_err:
            print(f"Error sending email: {email_err}")
            # Don't fail the order if email fails
            
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
    
    return {"message": "Order created successfully", "order_id": order_id}

@router.get("/history")
def get_order_history(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor(dictionary=True)
    
    # Get orders
    cursor.execute(
        "SELECT * FROM orders WHERE user_id = %s ORDER BY created_at DESC",
        (current_user['id'],)
    )
    orders = cursor.fetchall()
    
    # Get items for each order
    for order in orders:
        cursor.execute(
            """
            SELECT oi.*, p.name, p.images 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = %s
            """,
            (order['id'],)
        )
        items = cursor.fetchall()
        for item in items:
            item['images'] = json.loads(item['images']) if item['images'] else []
        order['items'] = items
    
    cursor.close()
    conn.close()
    
    return orders

@router.get("/all")
def get_all_orders(current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Forbidden")
        
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor(dictionary=True)
    
    # Get all orders with user info
    cursor.execute(
        """
        SELECT o.*, u.name as userName, u.email as userEmail 
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC
        """
    )
    orders = cursor.fetchall()
    
    # Get items for each order
    for order in orders:
        cursor.execute(
            """
            SELECT oi.*, p.name, p.images 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = %s
            """,
            (order['id'],)
        )
        items = cursor.fetchall()
        for item in items:
            item['images'] = json.loads(item['images']) if item['images'] else []
        order['items'] = items
    
    cursor.close()
    conn.close()
    
    return orders

class OrderStatusUpdate(BaseModel):
    status: str

@router.put("/{order_id}/status")
def update_order_status(order_id: str, status_update: OrderStatusUpdate, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Forbidden")
        
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE orders SET status = %s WHERE id = %s",
            (status_update.status, order_id)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
    
    return {"message": "Order status updated successfully"}
