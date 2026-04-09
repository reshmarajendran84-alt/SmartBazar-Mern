import Order   from "../models/order.js";
import Product from "../models/product.js";

class ChatService {

  async getReply(message, userId) {
    const msg = message.toLowerCase().trim();

    console.log("CHATSERVICE CALLED:", msg); // ← this will confirm new code runs

    if (msg.includes("hello") || msg.includes("hi")) {
      return "Hi! 👋 How can I help you?";
    }

    if (msg.includes("my order") || msg.includes("my orders") || msg.includes("order status")) {
      if (!userId) return "🔒 Please login to view your orders.";
      const orders = await Order.find({ userId }).sort({ createdAt: -1 }).limit(5);
      if (orders.length === 0) return "You have no orders yet.";
      const list = orders.map((o, i) =>
        `${i + 1}. ${o.status} — ₹${o.totalAmount}\n   ID: ${o._id}`
      ).join("\n\n");
      return `📋 Your Recent Orders:\n\n${list}`;
    }

    // Search product — no keyword needed, just try searching
    const stopWords = /\b(search|find|show|me|for|product|looking|i want|do you have|a|an|the)\b/gi;
    const searchTerm = msg.replace(stopWords, "").trim();

    if (searchTerm.length > 1) {
      const products = await Product.find({
        name: { $regex: searchTerm, $options: "i" }
      }).limit(4);

      if (products.length > 0) {
        const list = products.map(p =>
          `• ${p.name} — ₹${p.price}${p.stock > 0 ? " ✅" : " ❌ Out of stock"}`
        ).join("\n");
        return `🛍️ Found for "${searchTerm}":\n\n${list}`;
      }
    }

    return `Sorry, I didn't understand. 😅\n\nTry:\n• "My orders"\n• "Dell laptop"\n• "Order <ID>"`;
  }
}

export default new ChatService();