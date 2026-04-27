# PixelForge

## 1. Project Title and Description

PixelForge is a full-stack web-based gaming store designed to simulate a real-world e-commerce experience. The application allows users to browse products, search in real time, and manage a personal shopping cart.

This website solves the problem of managing user-specific shopping experiences by implementing authentication and role-based access control. Users can securely log in and maintain their own cart, while administrators can view all users’ shopping carts, demonstrating real-world business logic.

## 2. Technical Stack, Setup, and Dependencies

### Frontend

- React (JavaScript) using a Single Page Application (SPA) approach
- State management using React hooks (useState, useEffect)
- CSS for styling, animations, dark mode, and responsive layout

### Backend

- FastAPI (Python)
- RESTful API endpoints (GET, POST, PUT, DELETE)
- JWT-based authentication and role-based access control

### Database

- MySQL (`pixelforge_store`)
- Tables:
  - `products`
  - `cart_items`
  - `users`

### How to Run the Application

- cd backend
- python -m venv venv
- source venv/bin/activate # Mac
- pip install -r requirements.txt
- uvicorn main:app --reload --port 8001
- cd frontend
- npm install
- npm run dev

username & password

- regular user - testuser, 1234
- admin - admin, 1234

### Dependencies

Frontend

- React
- Vite

Backend

- FastAPI
- Uvicorn
- mysql-connector-python
- passlib (bcrypt)
- python-jose

## Folder Structure

pixelforge-store/
│
├─ frontend/ # React frontend (SPA)
│ ├─ src/
│ │ ├─ App.jsx # Main application logic (UI, API calls, auth)
│ │ ├─ components/ # Reusable components
│ │ ├─ styles.css # Styling and layout
│ │ ├─ main.jsx # Entry point
│ │ └─ assets/ # Images and sounds
│ └─ package.json # Frontend dependencies
│
├─ backend/ # FastAPI backend
│ ├─ main.py # API routes + authentication logic
│ ├─ requirements.txt # Python dependencies
│ ├─ pixelforge_store.sql # Database export
│ └─ venv/ # Virtual environment
│
└─ README.md # Project documentation
