  // legacy code, not used anymore, but keeping for reference
  // when cart was not populated from database

import React, { useEffect, useState } from "react";

function CartDrawer({ close }) {
  console.log("CartDrawer rendered");
  const [items, setItems] = useState([]);

  // Fetch cart from backend
  const fetchCart = () => {
    fetch("http://localhost:8000/cart")
      .then((res) => res.json())
      .then((data) => {
        console.log("Cart fetched:", data);
        setItems(data);
      })
      .catch((err) => console.error("Error fetching cart:", err));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Remove item
  const removeItem = (id) => {
    console.log("Removing item:", id);
    fetch(`http://localhost:8000/cart/${id}`, { method: "DELETE" })
      .then(() => fetchCart())
      .catch((err) => console.error("Remove failed:", err));
  };

  // Update item quantity
  const updateItemQuantity = (id, newQuantity, product_id) => {
    if (newQuantity < 1) return; // prevent negative quantities
    console.log("Updating quantity:", { id, newQuantity, product_id });
    fetch(`http://localhost:8000/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id, quantity: newQuantity }),
    })
      .then(() => fetchCart())
      .catch((err) => console.error("Update failed:", err));
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "300px",
        height: "100%",
        background: "#F8F9FA",
        boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      <button onClick={close} style={{ marginBottom: "1rem" }}>
        Close
      </button>

      <h2>Cart</h2>

      {items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        items.map((item) => (
          <div key={item.id} style={{ marginBottom: "1rem" }}>
            <p>{item.name}</p>
            <p>Price: ${item.price.toFixed(2)}</p>
            <p>
              Quantity:{" "}
              <button
                onClick={() =>
                  updateItemQuantity(item.id, item.quantity - 1, item.product_id)
                }
              >
                -
              </button>
              {item.quantity}
              <button
                onClick={() =>
                  updateItemQuantity(item.id, item.quantity + 1, item.product_id)
                }
              >
                +
              </button>
            </p>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
}

export default CartDrawer;