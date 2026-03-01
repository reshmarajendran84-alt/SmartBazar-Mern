export const getCart = () =>
  JSON.parse(localStorage.getItem("cart")) || [];

export const saveCart = (cart) =>
  localStorage.setItem("cart", JSON.stringify(cart));

import { getCart, saveCart } from "../utils/cart";

export const addToCart = (product) => {
  let cart = getCart();

  const exist = cart.find(
    (item) => item.productId === product._id
  );

  if (exist) {
    exist.quantity += 1;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    });
  }

  saveCart(cart);
};