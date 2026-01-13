import mysql.connector
import json
import os
from dotenv import load_dotenv

load_dotenv()

# Product Data (Converted from JS)
products = [
  {
    "id": "1",
    "name": "Classic Cotton T-Shirt",
    "description": "Premium quality cotton t-shirt with comfortable fit. Perfect for casual wear and everyday styling.",
    "price": 24.99,
    "originalPrice": 34.99,
    "images": [
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Men",
    "subcategory": "T-Shirts",
    "brand": "ComfortWear",
    "rating": 4.5,
    "reviewCount": 234,
    "inStock": True,
    "stockQuantity": 50,
    "tags": ["casual", "cotton", "t-shirt", "basic"],
    "featured": True,
    "sizes": ["S", "M", "L", "XL", "XXL"],
    "colors": ["White", "Black", "Navy", "Gray", "Red"],
    "material": "100% Cotton",
    "gender": "men",
    "sku": "MEN-TSH-001",
    "discount": 29,
    "isNew": False,
    "isBestseller": True
  },
  {
    "id": "2",
    "name": "Formal Dress Shirt",
    "description": "Crisp formal shirt perfect for office wear and business meetings. Made from premium cotton blend.",
    "price": 49.99,
    "originalPrice": 69.99,
    "images": [
      "https://images.pexels.com/photos/775281/pexels-photo-775281.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Men",
    "subcategory": "Shirts",
    "brand": "FormalFit",
    "rating": 4.3,
    "reviewCount": 189,
    "inStock": True,
    "stockQuantity": 30,
    "tags": ["formal", "office", "shirt", "business"],
    "featured": False,
    "sizes": ["S", "M", "L", "XL", "XXL"],
    "colors": ["White", "Light Blue", "Pink", "Gray"],
    "material": "65% Cotton, 35% Polyester",
    "gender": "men",
    "sku": "MEN-SHT-001",
    "discount": 29
  },
  {
    "id": "3",
    "name": "Denim Jacket",
    "description": "Classic denim jacket with vintage wash. Perfect layering piece for casual outfits.",
    "price": 89.99,
    "originalPrice": 119.99,
    "images": [
      "https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Men",
    "subcategory": "Jackets",
    "brand": "DenimCo",
    "rating": 4.7,
    "reviewCount": 156,
    "inStock": True,
    "stockQuantity": 25,
    "tags": ["denim", "jacket", "casual", "vintage"],
    "featured": True,
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Blue", "Black", "Light Blue"],
    "material": "100% Cotton Denim",
    "gender": "men",
    "sku": "MEN-JAC-001",
    "discount": 25
  },
  {
    "id": "4",
    "name": "Pullover Hoodie",
    "description": "Comfortable pullover hoodie with kangaroo pocket. Perfect for casual wear and lounging.",
    "price": 59.99,
    "originalPrice": None,
    "images": [
      "https://images.pexels.com/photos/6311393/pexels-photo-6311393.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Men",
    "subcategory": "Hoodies & Sweatshirts",
    "brand": "StreetWear",
    "rating": 4.4,
    "reviewCount": 298,
    "inStock": True,
    "stockQuantity": 40,
    "tags": ["hoodie", "casual", "comfort", "streetwear"],
    "featured": False,
    "sizes": ["S", "M", "L", "XL", "XXL"],
    "colors": ["Black", "Gray", "Navy", "Maroon"],
    "material": "80% Cotton, 20% Polyester",
    "gender": "men",
    "sku": "MEN-HOO-001"
  },
  {
    "id": "5",
    "name": "Slim Fit Jeans",
    "description": "Modern slim-fit jeans with stretch comfort. Perfect for contemporary styling.",
    "price": 79.99,
    "originalPrice": 99.99,
    "images": [
      "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1036856/pexels-photo-1036856.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Men",
    "subcategory": "Jeans",
    "brand": "DenimFit",
    "rating": 4.6,
    "reviewCount": 445,
    "inStock": True,
    "stockQuantity": 60,
    "tags": ["jeans", "slim-fit", "denim", "casual"],
    "featured": True,
    "sizes": ["28", "30", "32", "34", "36", "38"],
    "colors": ["Dark Blue", "Black", "Light Blue"],
    "material": "98% Cotton, 2% Elastane",
    "gender": "men",
    "sku": "MEN-JEA-001",
    "discount": 20,
    "isBestseller": True
  },
  {
    "id": "6",
    "name": "Chino Trousers",
    "description": "Versatile chino trousers suitable for both casual and semi-formal occasions.",
    "price": 54.99,
    "originalPrice": None,
    "images": [
      "https://images.pexels.com/photos/804485/pexels-photo-804485.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Men",
    "subcategory": "Trousers",
    "brand": "ClassicFit",
    "rating": 4.2,
    "reviewCount": 167,
    "inStock": True,
    "stockQuantity": 35,
    "tags": ["chinos", "trousers", "casual", "versatile"],
    "featured": False,
    "sizes": ["28", "30", "32", "34", "36", "38"],
    "colors": ["Khaki", "Navy", "Black", "Olive"],
    "material": "97% Cotton, 3% Elastane",
    "gender": "men",
    "sku": "MEN-TRO-001"
  },
  {
    "id": "7",
    "name": "Cotton Kurta Pyjama Set",
    "description": "Traditional cotton kurta pyjama set perfect for festivals and cultural occasions.",
    "price": 69.99,
    "originalPrice": 89.99,
    "images": [
      "https://images.pexels.com/photos/1468379/pexels-photo-1468379.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Men",
    "subcategory": "Kurta Pyjama",
    "brand": "EthnicWear",
    "rating": 4.5,
    "reviewCount": 123,
    "inStock": True,
    "stockQuantity": 20,
    "tags": ["kurta", "ethnic", "traditional", "festival"],
    "featured": False,
    "sizes": ["S", "M", "L", "XL", "XXL"],
    "colors": ["White", "Cream", "Light Blue", "Yellow"],
    "material": "100% Cotton",
    "gender": "men",
    "sku": "MEN-KUR-001",
    "discount": 22
  },
  {
    "id": "8",
    "name": "Silk Blouse",
    "description": "Elegant silk blouse perfect for office wear and formal occasions. Features delicate button details.",
    "price": 89.99,
    "originalPrice": 119.99,
    "images": [
      "https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Women",
    "subcategory": "Blouses & Shirts",
    "brand": "LuxeWear",
    "rating": 4.7,
    "reviewCount": 189,
    "inStock": True,
    "stockQuantity": 25,
    "tags": ["blouse", "silk", "elegant", "formal"],
    "featured": True,
    "sizes": ["XS", "S", "M", "L", "XL"],
    "colors": ["Ivory", "Black", "Blush", "Navy"],
    "material": "100% Silk",
    "gender": "women",
    "sku": "WOM-BLO-001",
    "discount": 25
  },
  {
    "id": "9",
    "name": "Cotton V-Neck T-Shirt",
    "description": "Soft cotton v-neck t-shirt with flattering fit. Essential wardrobe staple for everyday wear.",
    "price": 22.99,
    "originalPrice": 29.99,
    "images": [
      "https://images.pexels.com/photos/1002644/pexels-photo-1002644.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/4046311/pexels-photo-4046311.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Women",
    "subcategory": "T-Shirts & Tops",
    "brand": "BasicWear",
    "rating": 4.4,
    "reviewCount": 356,
    "inStock": True,
    "stockQuantity": 80,
    "tags": ["t-shirt", "cotton", "v-neck", "basic"],
    "featured": False,
    "sizes": ["XS", "S", "M", "L", "XL"],
    "colors": ["White", "Black", "Pink", "Gray", "Navy"],
    "material": "100% Cotton",
    "gender": "women",
    "sku": "WOM-TSH-001",
    "discount": 23,
    "isBestseller": True
  },
  {
    "id": "10",
    "name": "Floral Midi Dress",
    "description": "Beautiful floral midi dress with A-line silhouette. Perfect for spring and summer occasions.",
    "price": 79.99,
    "originalPrice": 99.99,
    "images": [
      "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Women",
    "subcategory": "Casual Dresses",
    "brand": "FloralFashion",
    "rating": 4.8,
    "reviewCount": 234,
    "inStock": True,
    "stockQuantity": 30,
    "tags": ["dress", "floral", "midi", "feminine"],
    "featured": True,
    "sizes": ["XS", "S", "M", "L", "XL"],
    "colors": ["Pink Floral", "Blue Floral", "Yellow Floral"],
    "material": "100% Viscose",
    "gender": "women",
    "sku": "WOM-DRE-001",
    "discount": 20
  },
  {
    "id": "11",
    "name": "Little Black Dress",
    "description": "Classic little black dress suitable for cocktail parties and formal events.",
    "price": 129.99,
    "originalPrice": 159.99,
    "images": [
      "https://images.pexels.com/photos/1488465/pexels-photo-1488465.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Women",
    "subcategory": "Formal Dresses",
    "brand": "ElegantWear",
    "rating": 4.6,
    "reviewCount": 145,
    "inStock": True,
    "stockQuantity": 15,
    "tags": ["dress", "black", "formal", "cocktail"],
    "featured": True,
    "sizes": ["XS", "S", "M", "L", "XL"],
    "colors": ["Black"],
    "material": "95% Polyester, 5% Elastane",
    "gender": "women",
    "sku": "WOM-DRE-002",
    "discount": 19
  },
  {
    "id": "12",
    "name": "Summer Floral Dress",
    "description": "Lightweight summer dress with floral print. Designed for comfort and casual outings.",
    "price": 45.99,
    "originalPrice": 59.99,
    "images": [
      "https://images.pexels.com/photos/2666709/pexels-photo-2666709.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Women",
    "subcategory": "Dresses",
    "brand": "StyleFlow",
    "rating": 4.6,
    "reviewCount": 422,
    "inStock": True,
    "stockQuantity": 55,
    "tags": ["dress", "floral", "summer", "casual"],
    "featured": True,
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["White", "Yellow", "Red"],
    "material": "Chiffon",
    "gender": "women",
    "sku": "WOM-DRE-001",
    "discount": 23,
    "isBestseller": True
  },
  {
    "id": "13",
    "name": "Men's Running Shorts",
    "description": "Lightweight athletic shorts for men. Ideal for running, training, and gym workouts.",
    "price": 34.99,
    "originalPrice": 44.99,
    "images": [
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/4761794/pexels-photo-4761794.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Men",
    "subcategory": "Shorts",
    "brand": "ActivePro",
    "rating": 4.5,
    "reviewCount": 315,
    "inStock": True,
    "stockQuantity": 75,
    "tags": ["shorts", "running", "gym", "activewear"],
    "featured": False,
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Black", "Blue", "Gray"],
    "material": "Polyester",
    "gender": "men",
    "sku": "MEN-SHO-001",
    "discount": 22,
    "isBestseller": False
  },
  {
    "id": "14",
    "name": "Women's Yoga Pants",
    "description": "Stretchable yoga pants designed for flexibility and comfort. Perfect for yoga and workouts.",
    "price": 39.99,
    "originalPrice": 54.99,
    "images": [
      "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3735475/pexels-photo-3735475.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Women",
    "subcategory": "Activewear",
    "brand": "ZenWear",
    "rating": 4.7,
    "reviewCount": 498,
    "inStock": True,
    "stockQuantity": 90,
    "tags": ["yoga", "leggings", "activewear", "stretch"],
    "featured": True,
    "sizes": ["XS", "S", "M", "L", "XL"],
    "colors": ["Black", "Gray", "Navy"],
    "material": "Spandex Blend",
    "gender": "women",
    "sku": "WOM-YOG-001",
    "discount": 27,
    "isBestseller": True
  },
  {
    "id": "15",
    "name": "Kids Summer T-Shirt",
    "description": "Colorful and comfortable cotton t-shirt for kids. Ideal for everyday summer wear.",
    "price": 18.99,
    "originalPrice": 24.99,
    "images": [
      "https://images.pexels.com/photos/1648357/pexels-photo-1648357.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3661264/pexels-photo-3661264.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Kids",
    "subcategory": "T-Shirts",
    "brand": "KiddoWear",
    "rating": 4.4,
    "reviewCount": 289,
    "inStock": True,
    "stockQuantity": 120,
    "tags": ["kids", "t-shirt", "summer", "cotton"],
    "featured": False,
    "sizes": ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    "colors": ["Blue", "Red", "Green"],
    "material": "100% Cotton",
    "gender": "kids",
    "sku": "KID-TSH-001",
    "discount": 24,
    "isBestseller": False
  },
  {
    "id": "16",
    "name": "Formal Blazer",
    "description": "Classic formal blazer for men. Perfect for office wear, meetings, and formal events.",
    "price": 129.99,
    "originalPrice": 159.99,
    "images": [
      "https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/428364/pexels-photo-428364.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Men",
    "subcategory": "Blazers",
    "brand": "EliteForm",
    "rating": 4.8,
    "reviewCount": 410,
    "inStock": True,
    "stockQuantity": 40,
    "tags": ["blazer", "formal", "office", "suit"],
    "featured": True,
    "sizes": ["38", "40", "42", "44"],
    "colors": ["Black", "Navy", "Gray"],
    "material": "Wool Blend",
    "gender": "men",
    "sku": "MEN-BLA-001",
    "discount": 19,
    "isBestseller": True
  },
  {
    "id": "17",
    "name": "Women's Leather Jacket",
    "description": "Stylish leather jacket with modern fit. Suitable for casual outings and evening wear.",
    "price": 199.99,
    "originalPrice": 249.99,
    "images": [
      "https://images.pexels.com/photos/4664524/pexels-photo-4664524.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/279949/pexels-photo-279949.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Women",
    "subcategory": "Jackets",
    "brand": "UrbanEdge",
    "rating": 4.7,
    "reviewCount": 530,
    "inStock": True,
    "stockQuantity": 30,
    "tags": ["jacket", "leather", "women", "stylish"],
    "featured": True,
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Black", "Brown"],
    "material": "Genuine Leather",
    "gender": "women",
    "sku": "WOM-JAC-001",
    "discount": 20,
    "isBestseller": True
  },
  {
    "id": "18",
    "name": "Men's Casual Sneakers",
    "description": "Comfortable sneakers for men. Designed for everyday casual use with durable sole.",
    "price": 69.99,
    "originalPrice": 89.99,
    "images": [
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Men",
    "subcategory": "Footwear",
    "brand": "StepMax",
    "rating": 4.5,
    "reviewCount": 610,
    "inStock": True,
    "stockQuantity": 100,
    "tags": ["sneakers", "shoes", "casual", "footwear"],
    "featured": True,
    "sizes": ["7", "8", "9", "10", "11"],
    "colors": ["White", "Black", "Blue"],
    "material": "Synthetic Leather",
    "gender": "men",
    "sku": "MEN-SHO-001",
    "discount": 22,
    "isBestseller": True
  },
  {
    "id": "19",
    "name": "Women's Heels",
    "description": "Elegant high heels for women. Perfect for parties, functions, and formal occasions.",
    "price": 89.99,
    "originalPrice": 119.99,
    "images": [
      "https://images.pexels.com/photos/1368625/pexels-photo-1368625.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1961790/pexels-photo-1961790.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Women",
    "subcategory": "Footwear",
    "brand": "GlamWalk",
    "rating": 4.6,
    "reviewCount": 377,
    "inStock": True,
    "stockQuantity": 50,
    "tags": ["heels", "shoes", "party", "formal"],
    "featured": False,
    "sizes": ["5", "6", "7", "8"],
    "colors": ["Black", "Red", "Beige"],
    "material": "Synthetic Leather",
    "gender": "women",
    "sku": "WOM-HEL-001",
    "discount": 25,
    "isBestseller": False
  },
  {
    "id": "20",
    "name": "Kids Winter Jacket",
    "description": "Warm winter jacket for kids with hood. Provides insulation and comfort in cold weather.",
    "price": 59.99,
    "originalPrice": 79.99,
    "images": [
      "https://images.pexels.com/photos/1556679/pexels-photo-1556679.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2811439/pexels-photo-2811439.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    "category": "Kids",
    "subcategory": "Jackets",
    "brand": "WarmHug",
    "rating": 4.5,
    "reviewCount": 298,
    "inStock": True,
    "stockQuantity": 65,
    "tags": ["kids", "jacket", "winter", "warm"],
    "featured": True,
    "sizes": ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    "colors": ["Red", "Blue", "Yellow"],
    "material": "Polyester",
    "gender": "kids",
    "sku": "KID-JAC-001",
    "discount": 25,
    "isBestseller": True
  }
]

def seed_database():
    try:
        db_config = {
            "host": os.getenv("DB_HOST", "localhost"),
            "user": os.getenv("DB_USER", "root"),
            "password": os.getenv("DB_PASSWORD", ""),
            "database": os.getenv("DB_NAME", "eliteshop"),
        }
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        print("Connected to MySQL server")
        
        # Apply schema
        with open('schema.sql', 'r') as f:
            schema_queries = f.read().split(';')
            for query in schema_queries:
                if query.strip():
                    cursor.execute(query)
        print("Database schema applied")
        
        # Clear existing tables
        cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
        cursor.execute("DELETE FROM notifications")
        cursor.execute("DELETE FROM wishlist")
        cursor.execute("DELETE FROM order_items")
        cursor.execute("DELETE FROM orders")
        cursor.execute("DELETE FROM products")
        cursor.execute("DELETE FROM users")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
        print("Cleared existing tables")
        
        # Insert new products
        insert_query = """
          INSERT INTO products (
            id, name, description, price, originalPrice, images, category, subcategory, 
            brand, rating, reviewCount, inStock, stockQuantity, tags, featured, sizes, 
            colors, material, gender, sku, discount, isNew, isBestseller
          ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        # Insert Products
        for product in products:
            cursor.execute(insert_query, (
                product['id'], product['name'], product['description'], product['price'],
                product.get('originalPrice'), json.dumps(product['images']), product['category'],
                product.get('subcategory'), product.get('brand'), product['rating'],
                product['reviewCount'], product['inStock'], product.get('stockQuantity', 0),
                json.dumps(product['tags']), product['featured'], json.dumps(product['sizes']),
                json.dumps(product['colors']), product.get('material'), product.get('gender'),
                product.get('sku'), product.get('discount', 0), product.get('isNew', False),
                product.get('isBestseller', False)
            ))
        
        # Insert Default Admin
        from auth_utils import get_password_hash
        admin_id = "admin-1"
        admin_pw = get_password_hash("admin123")
        cursor.execute(
            "INSERT IGNORE INTO users (id, name, email, password_hash, role) VALUES (%s, %s, %s, %s, %s)",
            (admin_id, "Admin", "admin@eliteshop.com", admin_pw, "admin")
        )

        conn.commit()
        print(f"{len(products)} products inserted")
        print("Database seeded successfully")
        
    except mysql.connector.Error as err:
        print(f"Error seeding database: {err}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    seed_database()
