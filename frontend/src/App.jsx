import React, { useState, useEffect } from "react";
import "./styles.css";

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [addedItemId, setAddedItemId] = useState(null);
  const [filters, setFilters] = useState({});
  const [priceSort, setPriceSort] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const openPopup = (product) => setSelectedProduct(product);
  const closePopup = () => setSelectedProduct(null);
  const [search, setSearch] = useState("");

  // auth state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [adminData, setAdminData] = useState([]);
  const [role, setRole] = useState(null);

  const handleLogin = async () => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  try {
    const res = await fetch("http://127.0.0.1:8001/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const data = await res.json();

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      alert("Login successful!");
    } else {
      alert("Login failed");
    }
  } catch (err) {
    console.error(err);
  }
};

const fetchAdminData = () => {
  // 🔁 if already open → close it
  if (adminData.length > 0) {
    setAdminData([]);
    return;
  }

  if (!token) {
    alert("Please log in first");
    return;
  }

  fetch("http://127.0.0.1:8001/admin/carts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Admin access only");
      }
      return res.json();
    })
    .then((data) => setAdminData(data))
    .catch((err) => {
      console.error(err);
      alert("Only admins can view all carts");
    });
};

const getUserRole = () => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch (err) {
    console.error("Invalid token");
    return null;
  }
};

useEffect(() => {
  if (token) {
    setRole(getUserRole());
  } else {
    setRole(null);
  }
}, [token]);

  // fetch products
 useEffect(() => {
  setLoading(true);
  fetch("http://127.0.0.1:8001/products")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }
      return res.json();
    })
    .then((data) => {
      setProducts(data);

      const initialFilters = {};
      data.forEach((p) => {
        if (!(p.category in initialFilters)) initialFilters[p.category] = true;
      });
      setFilters(initialFilters);

      setError(null);
    })
    .catch((err) => {
      console.error(err);
      setError("Unable to load products. Please try again later.");
    })
    .finally(() => setLoading(false));
}, []);

  // fetch cart from backend
  const fetchCart = () => {
  if (!token) return; //don't fetch if not logged in

  fetch("http://127.0.0.1:8001/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Not authorized");
      return res.json();
    })
    .then((data) => setCartItems(data))
    .catch((err) => console.error("Error fetching cart:", err));
};

  useEffect(() => {
  if (token) {
    fetchCart();
  }
}, [token]);

  // add item to cart
  const addToCart = (product) => {
    if (!token) {
      alert("Please log in to add items to your cart.");
      return;
    }
    fetch("http://127.0.0.1:8001/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: product.id, quantity: 1 }),
    })
      .then(() => fetchCart())
      .then(() => {
        setAddedItemId(product.id);
        setTimeout(() => setAddedItemId(null), 300);
        const audio = new Audio("/sounds/add-to-cart.wav");
        audio.play();
      })
      .catch((err) => console.error("Error adding to cart:", err));
  };

  // remove item
  const removeFromCart = (itemId) => {
    fetch(`http://127.0.0.1:8001/cart/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => fetchCart())
      .then(() => {
        const audio = new Audio("/sounds/remove-from-cart.mp3");
        audio.play();
      })
      .catch((err) => console.error("Error removing item:", err));
  };

  // change quantity
  const changeQuantity = (itemId, productId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;

    fetch(`http://127.0.0.1:8001/cart/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
       },
      body: JSON.stringify({ product_id: productId, quantity: newQuantity }),
    })
      .then(() => fetchCart())
      .catch((err) => console.error("Error updating quantity:", err));
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // filter category
  const toggleFilter = (category) => {
    setFilters({ ...filters, [category]: !filters[category] });
  };

  let filteredProducts = products
  .filter((p) => filters[p.category])
  .filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  if (priceSort === "high") filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  if (priceSort === "low") filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <header className="header">
        <h1>PixelForge</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <input
  type="text"
  placeholder="Search products..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{ padding: "0.5rem", borderRadius: "8px" }}
/>
<div style={{ margin: "1rem" }}>
{!token ? (
  <>
    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button onClick={handleLogin}>Login</button>
  </>
) : (
  <>
    <button
      onClick={() => {
        localStorage.removeItem("token");
        setToken(null);
        setAdminData([]);
      }}
    >
      Logout
    </button>

    {role === "admin" && (
  <button onClick={fetchAdminData}>
    View All Carts
  </button>
)}
  </>
)}
</div>
          <button
            className="dark-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Light Mode" : "Dark Mode"}
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
          <button className="cart-button" onClick={() => setCartOpen(!cartOpen)}>
            🛒 Cart
            {cartItems.length > 0 && <span className="cart-count">
  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
</span>}
          </button>
        </div>
      </header>

      <div className="app">
        {/* sidebar filters */}
        <aside className="sidebar">
          <h3>Filter by Category</h3>
          {Object.keys(filters).map((category) => (
            <label key={category} className="filter-label">
              <input
                type="checkbox"
                checked={filters[category]}
                onChange={() => toggleFilter(category)}
              />
              {category}
            </label>
          ))}
          <div className="price-sort">
            <label htmlFor="priceSort">Sort by Price</label>
            <select id="priceSort" value={priceSort} onChange={(e) => setPriceSort(e.target.value)}>
              <option value="default">Default</option>
              <option value="high">High to Low</option>
              <option value="low">Low to High</option>
            </select>
          </div>
        </aside>

        {/* cart overlay */}
        {cartOpen && (
          <div className="cart-overlay" onClick={() => setCartOpen(false)}>
            <div className="cart" onClick={(e) => e.stopPropagation()}>
              <button className="cart-close" onClick={() => setCartOpen(false)}>✖</button>

              {cartItems.length === 0 ? (
                <p>Your cart is empty!</p>
              ) : (
                <div>
                  <ul>
                    {cartItems.map((item) => (
                      <li key={item.id} className="cart-item">
                        <img src={item.image_url} alt={`${item.name} in shopping cart`} />
                        <div className="cart-details">
                          <h4>{item.name}</h4>
                          <p>${item.price.toFixed(2)}</p>
                          <div className="quantity-controls">
                            <button onClick={() => changeQuantity(item.id, item.product_id, item.quantity, -1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => changeQuantity(item.id, item.product_id, item.quantity, 1)}>+</button>
                          </div>
                        </div>
                        <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                      </li>
                    ))}
                  </ul>
                  <h3 className="cart-total">Total: ${cartTotal.toFixed(2)}</h3>
                </div>
              )}
            </div>
          </div>
        )}
        {role === "admin" && adminData.length > 0 &&(
  <div className="admin-carts">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <h2>All Users' Carts</h2>

  <button
    onClick={() => setAdminData([])}
    style={{
      background: "transparent",
      border: "none",
      fontSize: "1.2rem",
      cursor: "pointer"
    }}
  >
    ✖
  </button>
</div>

    {adminData.map((item, index) => (
      <div key={index} className="admin-cart-item">
        <img
          src={item.image_url}
          alt={item.name}
          style={{ width: "60px", height: "60px", objectFit: "cover" }}
        />
        <div>
          <p><strong>User:</strong> {item.username}</p>
          <p><strong>Product:</strong> {item.name}</p>
          <p><strong>Quantity:</strong> {item.quantity}</p>
          <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
        </div>
      </div>
    ))}
  </div>
)}
        {loading && <p>Loading products...</p>}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}  
        
        {/* product grid */}
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card slide-in-card" onClick={() => openPopup(product)}>
              <img src={product.image_url} alt={`${product.name} product image`} />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>${product.price.toFixed(2)}</p>
              <button
                className={addedItemId === product.id ? "added" : ""}
                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* product popup */}
        {selectedProduct && (
          <div className="popup-overlay" onClick={closePopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              <button className="popup-close" onClick={closePopup}>✖</button>
              <img src={selectedProduct.image_url} alt={selectedProduct.name} />
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.further_description}</p>
              <p>${selectedProduct.price.toFixed(2)}</p>
              <button
                className={addedItemId === selectedProduct.id ? "added" : ""}
                onClick={() => addToCart(selectedProduct)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;