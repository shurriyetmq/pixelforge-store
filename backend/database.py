# backend/database.py
import mysql.connector

def get_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="pixelforge_store"
    )
    return connection