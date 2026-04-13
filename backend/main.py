# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector

app = FastAPI()

# CORS for React/Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to get a new DB connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="pixelforge_store"
    )

# Pydantic model for POST/PUT requests
class CartItem(BaseModel):
    product_id: int
    quantity: int

# PRODUCTS ENDPOINT
@app.get("/products")
def get_products():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, name, price, description, further_description, image_url, category FROM products"
    )
    products = cursor.fetchall()
    cursor.close()
    connection.close()
    return products

# GET CART ITEMS
@app.get("/cart")
def get_cart():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
        SELECT cart_items.id, cart_items.product_id, products.name, products.price, products.image_url, cart_items.quantity
        FROM cart_items
        JOIN products ON cart_items.product_id = products.id
        """ 
        cursor.execute(query)
        items = cursor.fetchall()
        return items
    except Exception as e:
        return {"error": str(e)}
    finally:
        cursor.close()
        connection.close()


# ADD TO CART
@app.post("/cart")
def add_to_cart(item: CartItem):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT id, quantity FROM cart_items WHERE product_id = %s", (item.product_id,))
    existing = cursor.fetchone()

    if existing:
        new_quantity = existing[1] + item.quantity
        cursor.execute("UPDATE cart_items SET quantity = %s WHERE id = %s", (new_quantity, existing[0]))
    else:
        cursor.execute("INSERT INTO cart_items (product_id, quantity) VALUES (%s, %s)", (item.product_id, item.quantity))

    connection.commit()
    cursor.close()
    connection.close()
    return {"message": "Item added to cart"}

# UPDATE CART ITEM QUANTITY
@app.put("/cart/{item_id}")
def update_cart(item_id: int, item: CartItem):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("UPDATE cart_items SET quantity = %s WHERE id = %s", (item.quantity, item_id))
    connection.commit()
    cursor.close()
    connection.close()
    return {"message": "Cart updated"}
        

# REMOVE CART ITEM
@app.delete("/cart/{item_id}")
def remove_cart_item(item_id: int):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("DELETE FROM cart_items WHERE id = %s", (item_id,))
        connection.commit()
        return {"message": "Item removed"}
    finally:
        cursor.close()
        connection.close()
        