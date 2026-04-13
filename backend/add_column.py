# backend/add_column.py
import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="pixelforge_store"
)

cursor = db.cursor()

# Add column
cursor.execute("""
ALTER TABLE products
ADD COLUMN further_description VARCHAR(500) NULL AFTER category
""")

db.commit()
cursor.close()
db.close()

print("Column added successfully!")