# PixelForge

## Project Summary

PixelForge is a dynamic web-based gaming store that allows users to browse products, add them to a shopping cart, and adjust quantities or remove items as needed. It simplifies online shopping for gamers by providing a clear and interactive interface for managing purchases.

## Technical Stack

- **Frontend:** React (JavaScript) using a single-page application (SPA) approach, with state and hooks managing UI interactions and API communication.
- **Styling:** CSS for layout, animations (cart drawer, hover effects), responsive grid display, dark mode support and purple accent branding.
- **Routing:** SPA behavior achieved with React state management; no external routing library is used.
- **Data / Backend:** FastAPI (Python) providing RESTful API endpoints (GET, POST, PUT, DELETE) for products and cart functionality.
- **Database:** MySQL database (pixelforge_store) storing product data and cart items, enabling full CRUD operations with persistent storage.
- **Deployment:** Local development setup using npm run dev (Vite) for the frontend and uvicorn main:app --reload for the FastAPI backend.

## Feature List

- Visual feedback with hover effects on product cards
- SFX feedback when adding and removing products to and from the cart
- Dynamically filter and sort products by category and price
- Clear white page aesthetic with purple accent highlights, featuring a dark mode toggle
- Accessibility friendly using image alt text, contrasting backgrounds and ratios

## Folder Structure

pixelforge-store/
│
├─ frontend/ # React frontend (Vite)
│ ├─ src/
│ │ ├─ App.jsx # Main React component (products, cart UI, CRUD integration)
│ │ ├─ components/
│ │ │ └─ CartDrawer.jsx # (Optional/legacy) cart component
│ │ ├─ styles.css # Styling (layout, cart overlay, animations, dark mode)
│ │ ├─ main.jsx # React entry point (Vite)
│ │ └─ assets/ # Images, sounds (e.g. add/remove cart audio)
│ └─ package.json # Frontend dependencies
│
├─ backend/ # FastAPI backend
│ ├─ main.py # API endpoints (GET, POST, PUT, DELETE for cart + products)
│ ├─ requirements.txt # Python dependencies
| ├─ pixelforge_store.sql # Database export
│ └─ venv/ # Virtual environment
│
├─ database/ (implicit)
│ └─ MySQL # pixelforge_store database with:
│ ├─ products table # Stores product data
│ └─ cart_items table # Stores cart items (CRUD operations)
│
└─ README.md # Project documentation

## Challenges Overcome

One of the main challenges was resolving persistent 422 and 500 errors when connecting the frontend to the FastAPI backend, which required correctly structuring request bodies using Pydantic models. Another difficulty was ensuring full CRUD functionality worked with the MySQL database, particularly debugging why cart items were not being saved or retrieved correctly. A key issue was that the frontend was initially using local state instead of making API calls, preventing data from persisting after a page refresh. This was resolved by integrating proper fetch requests for all cart operations (POST, GET, PUT, DELETE). Debugging tools such as curl and browser network inspection were used to trace whether requests were reaching the backend and updating the database correctly.
