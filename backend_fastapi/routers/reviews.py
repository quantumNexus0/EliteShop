from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from database import get_db_connection
from auth_utils import get_current_user

router = APIRouter()

class ReviewCreate(BaseModel):
    product_id: str
    rating: int
    comment: str

@router.post("/")
def create_review(review: ReviewCreate, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = conn.cursor()
        
        # Check if user already reviewed this product
        cursor.execute(
            "SELECT id FROM reviews WHERE user_id = %s AND product_id = %s",
            (current_user['id'], review.product_id)
        )
        if cursor.fetchone():
             raise HTTPException(status_code=400, detail="You have already reviewed this product")

        # Create review
        cursor.execute(
            "INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (%s, %s, %s, %s)",
            (review.product_id, current_user['id'], review.rating, review.comment)
        )
        
        conn.commit()
        
        # Recalculate product rating (Optional optimization: do this async or periodically)
        cursor.execute(
            "SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = %s",
            (review.product_id,)
        )
        stats = cursor.fetchone() # returns tuple or dict depending on driver, but here we used default cursor for insert, let's switch to dict cursor for select if needed, or just access by index
        
        # Re-fetch with dict cursor to be safe
        cursor.close()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = %s",
            (review.product_id,)
        )
        stats = cursor.fetchone()
        
        if stats:
             new_rating = float(stats['avg_rating'])
             new_count = stats['count']
             cursor.execute(
                 "UPDATE products SET rating = %s, reviewCount = %s WHERE id = %s",
                 (new_rating, new_count, review.product_id)
             )
             conn.commit()

    except HTTPException as he:
        raise he
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
    
    return {"message": "Review added successfully"}

@router.get("/{product_id}")
def get_product_reviews(product_id: str):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT r.id, r.product_id, r.user_id, r.rating, r.comment, r.created_at, u.name as user_name 
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.product_id = %s
            ORDER BY r.created_at DESC
            """,
            (product_id,)
        )
        reviews = cursor.fetchall()
        return reviews
    finally:
        cursor.close()
        conn.close()

@router.delete("/{review_id}")
def delete_review(review_id: int, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
        
    try:
        cursor = conn.cursor(dictionary=True)
        
        # Check ownership or admin
        cursor.execute("SELECT user_id, product_id FROM reviews WHERE id = %s", (review_id,))
        review = cursor.fetchone()
        
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")
            
        if review['user_id'] != current_user['id'] and current_user['role'] != 'admin':
            raise HTTPException(status_code=403, detail="Not authorized to delete this review")
            
        cursor.execute("DELETE FROM reviews WHERE id = %s", (review_id,))
        conn.commit()
        
        # Recalculate stats
        cursor.execute(
            "SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = %s",
            (review['product_id'],)
        )
        stats = cursor.fetchone()
        
        new_rating = float(stats['avg_rating']) if stats['avg_rating'] else 0
        new_count = stats['count']
        
        cursor.execute(
             "UPDATE products SET rating = %s, reviewCount = %s WHERE id = %s",
             (new_rating, new_count, review['product_id'])
        )
        conn.commit()
        
    except HTTPException as he:
        raise he
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
        
    return {"message": "Review deleted"}
