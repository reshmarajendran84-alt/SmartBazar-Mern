// import api from "../utils/api";

// export const addToCart = (data) => api.post("/cart/add", data);
// export const getCart = () => api.get("/cart");
// export const updateCart = (data) => api.put("/cart/update", data);
// export const removeFromCart = (productId) =>
//   api.delete("/cart/remove", { data: { productId } });



import api from "../utils/api";

// ─── DB Cart (logged in) ───────────────────────────────
export const addToCart    = (data)       => api.post("/cart/add", data);
export const getCart      = ()           => api.get("/cart");
export const updateCart   = (data)       => api.put("/cart/update", data);
export const removeFromCart = (productId) => api.delete("/cart/remove", { data: { productId } });
export const mergeCart    = (items)      => api.post("/cart/merge", { items }); // ✅ new

// ─── Guest Cart (localStorage) ────────────────────────
export const getGuestCart = () => {
  return JSON.parse(localStorage.getItem("guestCart") || "[]");
};

export const addToGuestCart = (product, quantity = 1) => {
  const cart = getGuestCart();
  const index = cart.findIndex(item => item.productId === product._id);
  if (index > -1) {
    cart[index].quantity += quantity;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      quantity,
    });
  }
  localStorage.setItem("guestCart", JSON.stringify(cart));
  return cart;
};

export const updateGuestCart = (productId, quantity) => {
  const cart = getGuestCart();
  const index = cart.findIndex(item => item.productId === productId);
  if (index > -1) cart[index].quantity = quantity;
  localStorage.setItem("guestCart", JSON.stringify(cart));
  return cart;
};

export const removeFromGuestCart = (productId) => {
  const cart = getGuestCart().filter(item => item.productId !== productId);
  localStorage.setItem("guestCart", JSON.stringify(cart));
  return cart;
};

export const clearGuestCart = () => localStorage.removeItem("guestCart");