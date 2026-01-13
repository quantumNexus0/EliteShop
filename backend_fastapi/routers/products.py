from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
import json
from database import get_db_connection
from auth_utils import get_current_user
from pydantic import BaseModel

router = APIRouter()

class ProductSchema(BaseModel):
    name: str
    description: str
    price: float
    originalPrice: Optional[float] = None
    images: List[str]
    category: str
    subcategory: str
    brand: str
    stockQuantity: int
    inStock: bool = True
    tags: List[str] = []
    featured: bool = False
    sizes: List[str] = []
    colors: List[str] = []
    material: Optional[str] = None
    gender: Optional[str] = None
    sku: Optional[str] = None
    discount: int = 0
    isNew: bool = False
    isBestseller: bool = False

@router.get("/")
def get_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    featured: Optional[bool] = None
):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT * FROM products"
        conditions = []
        params = []

        if category:
            conditions.append("category = %s")
            params.append(category)
        
        if featured:
            conditions.append("featured = TRUE")
        
        if search:
            conditions.append("(name LIKE %s OR description LIKE %s)")
            search_term = f"%{search}%"
            params.extend([search_term, search_term])
        
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        
        cursor.execute(query, params)
        products = cursor.fetchall()
        cursor.close()
        
        # Parse JSON fields
        for product in products:
            product['images'] = json.loads(product['images']) if product['images'] else []
            product['tags'] = json.loads(product['tags']) if product['tags'] else []
            product['sizes'] = json.loads(product['sizes']) if product['sizes'] else []
            product['colors'] = json.loads(product['colors']) if product['colors'] else []
            product['inStock'] = bool(product['inStock'])
            product['featured'] = bool(product['featured'])
            product['isNew'] = bool(product['isNew'])
            product['isBestseller'] = bool(product['isBestseller'])
            
        return products
    finally:
        conn.close()

@router.get("/{product_id}")
def get_product(product_id: str):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT * FROM products WHERE id = %s"
        cursor.execute(query, (product_id,))
        product = cursor.fetchone()
        cursor.close()
        
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
            
        # Parse JSON fields
        product['images'] = json.loads(product['images']) if product['images'] else []
        product['tags'] = json.loads(product['tags']) if product['tags'] else []
        product['sizes'] = json.loads(product['sizes']) if product['sizes'] else []
        product['colors'] = json.loads(product['colors']) if product['colors'] else []
        product['inStock'] = bool(product['inStock'])
        product['featured'] = bool(product['featured'])
        product['isNew'] = bool(product['isNew'])
        product['isBestseller'] = bool(product['isBestseller'])
        
        return product
    finally:
        conn.close()

@router.post("/")
def create_product(product: ProductSchema, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can add products")
        
    import uuid
    product_id = str(uuid.uuid4())
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO products (id, name, description, price, originalPrice, images, category, subcategory, 
            brand, stockQuantity, inStock, tags, featured, sizes, colors, material, gender, sku, discount, isNew, isBestseller)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (product_id, product.name, product.description, product.price, product.originalPrice, 
             json.dumps(product.images), product.category, product.subcategory, product.brand, 
             product.stockQuantity, product.inStock, json.dumps(product.tags), product.featured, 
             json.dumps(product.sizes), json.dumps(product.colors), product.material, product.gender, 
             product.sku, product.discount, product.isNew, product.isBestseller)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
    
    return {"message": "Product created successfully", "id": product_id}

@router.put("/{product_id}")
def update_product(product_id: str, product: ProductSchema, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Forbidden")
        
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            UPDATE products 
            SET name=%s, description=%s, price=%s, originalPrice=%s, images=%s, category=%s, subcategory=%s, 
                brand=%s, stockQuantity=%s, inStock=%s, tags=%s, featured=%s, sizes=%s, colors=%s, 
                material=%s, gender=%s, sku=%s, discount=%s, isNew=%s, isBestseller=%s
            WHERE id=%s
            """,
            (product.name, product.description, product.price, product.originalPrice, 
             json.dumps(product.images), product.category, product.subcategory, product.brand, 
             product.stockQuantity, product.inStock, json.dumps(product.tags), product.featured, 
             json.dumps(product.sizes), json.dumps(product.colors), product.material, product.gender, 
             product.sku, product.discount, product.isNew, product.isBestseller, product_id)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
    
    return {"message": "Product updated successfully"}

@router.delete("/{product_id}")
def delete_product(product_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Forbidden")
        
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM products WHERE id = %s", (product_id,))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
    
    return {"message": "Product deleted successfully"}
