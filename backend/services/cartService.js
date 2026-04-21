import Cart from "../models/Cart.js";

class CartService {

  async addToCart(userId, { productId, quantity, price ,name,image}) {
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });
const safePrice    = parseFloat(price)    || 0;
  const safeQuantity = parseInt(quantity)   || 1;
    const index = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    if (index > -1) {
      cart.items[index].quantity += quantity;
      if (!cart.items[index].price) {
      cart.items[index].price = safePrice;
    }
  
    } else {
      cart.items.push({ productId, quantity, price ,name,image});
    }

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.quantity * item.price, 0
    );
    await cart.save();
    return cart;
  }

  // Merge guest cart into DB cart on login
  async mergeCart(userId, guestItems) {
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    for (const guestItem of guestItems) {
      const index = cart.items.findIndex(
        item => item.productId.toString() === guestItem.productId
      );
      if (index > -1) {
        //  Item exists → add quantities
        cart.items[index].quantity += guestItem.quantity;
      } else {
        // New item → push to cart
        cart.items.push({
          productId: guestItem.productId,
          quantity:  guestItem.quantity,
          price:     guestItem.price,
        });
      }
    }

    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.quantity * item.price, 0
    );
    await cart.save();
    return cart;
  }

  async updateCart(userId, { productId, quantity }) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Cart not found");
    const item = cart.items.find(item => item.productId.toString() === productId);
    if (item) item.quantity = quantity;
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.quantity * item.price, 0
    );
    await cart.save();
    return cart;
  }

  async removeFromCart(userId, productId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Cart not found");
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.quantity * item.price, 0
    );
    await cart.save();
    return cart;
  }

  async getCart(userId) {
    return await Cart.findOne({ userId }).populate("items.productId");
  }
}

export default new CartService();