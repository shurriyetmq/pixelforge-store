export const API_BASE = "http://localhost:8000";

export const fetchProducts = () =>
  fetch(`${API_BASE}/products`).then((res) => res.json());

export const fetchCart = () =>
  fetch(`${API_BASE}/cart`).then((res) => res.json());
