import React from "react";

function ProductCard({ product }) {
  const addToCart = () => {
    alert(`${product.name} added to cart (dummy)`);
  };

  return (
    <div className="card">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <p>{product.description}</p>
      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;