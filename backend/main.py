# backend/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext  
from jose import JWTError, jwt  
from pydantic import BaseModel
import mysql.connector
from datetime import datetime, timedelta



app = FastAPI()

SECRET_KEY = "supersecretkey123" # set up auth system
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password): # password funcions
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password):
    return pwd_context.hash(password)


def create_access_token(data: dict): #create JWT token
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@app.post("/token") #login endpoint for authentication
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM users WHERE username = %s",
        (form_data.username,)
    )
    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({
        "sub": user["username"],
        "role": user["role"]
    })

    return {"access_token": access_token, "token_type": "bearer"}


def get_current_user(token: str = Depends(oauth2_scheme)): #verify token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")

        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        return username

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

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
def get_cart(current_user: str = Depends(get_current_user)):
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
        

class User(BaseModel):
    username: str
    password: str

@app.post("/register")
def register(user: User):
    connection = get_db_connection()
    cursor = connection.cursor()

    hashed = hash_password(user.password)

    cursor.execute(
        "INSERT INTO users (username, password_hash) VALUES (%s, %s)",
        (user.username, hashed)
    )

    connection.commit()
    cursor.close()
    connection.close()

    return {"message": "User registered successfully"}