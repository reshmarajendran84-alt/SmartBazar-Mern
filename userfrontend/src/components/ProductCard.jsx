import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`}>
      <img src={product.images[0]} />
      <h2>{product.name}</h2>
    </Link>
  );
};

export default React.memo(ProductCard);