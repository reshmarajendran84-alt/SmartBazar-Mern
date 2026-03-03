export const addToCart = (product) => {
  const existingCart =
    JSON.parse(localStorage.getItem("cart")) || [];

  const exists = existingCart.find(
    (item) => item.productId === product._id
  );

  let updatedCart;

  if (exists) {
    updatedCart = existingCart.map((item) =>
      item.productId === product._id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    updatedCart = [
      ...existingCart,
      {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
      },
    ];
  }

  localStorage.setItem("cart", JSON.stringify(updatedCart));
};