// services/chatService.js
import Order from "../models/order.js";
import Product from "../models/product.js";

class ChatService {
  async getReply(message, userId) {
    try {
      const msg = message.toLowerCase().trim();
      console.log("=".repeat(50));
      console.log("CHATSERVICE CALLED:", msg);
      console.log("USER ID:", userId);
      console.log("=".repeat(50));

      // 1. Greeting
      if (msg.includes("hello") || msg.includes("hi") || msg === "hi") {
        console.log("✅ Matched: Greeting");
        return "Hi! 👋 How can I help you?";
      }

      // 2. My Orders
      if (msg.includes("my order") || msg.includes("my orders") || msg.includes("order status")) {
        console.log("✅ Matched: My Orders");
        if (!userId) return "🔒 Please login to view your orders.";
        
        try {
          const orders = await Order.find({ userId }).sort({ createdAt: -1 }).limit(5);
          console.log(`📦 Found ${orders.length} orders`);
          
          if (orders.length === 0) return "You have no orders yet.";
          
          const list = orders.map((o, i) =>
            `${i + 1}. ${o.status} — ₹${o.totalAmount || o.total || o.price || o.amount || "N/A"}\n   ID: ${o._id}`
          ).join("\n\n");
          
          return `📋 Your Recent Orders:\n\n${list}`;
        } catch (dbError) {
          console.error("❌ Database error in My Orders:", dbError);
          return "⚠️ Unable to fetch orders. Database error.";
        }
      }

      // 3. Cancel Order
      if (msg.includes("cancel") && msg.includes("order")) {
        console.log("✅ Matched: Cancel Order");
        
        const idMatch = msg.match(/([0-9a-f]{24})/i);
        console.log("Order ID match:", idMatch);
        
        if (!idMatch) {
          return "Please provide your Order ID to cancel. Example: 'cancel order 66a1b2c3d4e5f6789a123456'";
        }
        
        try {
          const orderId = idMatch[1];
          console.log("Looking for order:", orderId);
          
          const order = await Order.findById(orderId);
          console.log("Order found:", order ? "Yes" : "No");
          
          if (!order) return "❌ Order not found";
          
          if (userId && order.userId && order.userId.toString() !== userId.toString()) {
            return "🔒 You can only cancel your own orders.";
          }
          
          if (order.status !== "pending") {
            return `⚠️ Cannot cancel. Order is already: ${order.status}`;
          }
          
          order.status = "cancelled";
          await order.save();
          
          return `✅ Order ${order._id} has been cancelled successfully.`;
        } catch (dbError) {
          console.error("❌ Database error in Cancel Order:", dbError);
          return "⚠️ Unable to cancel order. Database error.";
        }
      }

      // 4. Return / Refund
      if (msg.includes("return") || msg.includes("refund")) {
        console.log("✅ Matched: Return/Refund");
        return `🔄 Return & Refund Policy:\n\n• Items can be returned within 7 days of delivery\n• Must be unused and in original packaging\n• Refund processed in 5-7 business days\n\nTo start a return, share your Order ID and reason.`;
      }

      // 5. Delivery Info
      if (msg.includes("delivery") || msg.includes("shipping") || msg.includes("how long") || msg.includes("ship")) {
        console.log("✅ Matched: Delivery Info");
        return `🚚 Delivery Information:\n\n• Standard: 5-7 business days — Free\n• Express: 2-3 business days — ₹99\n• Same Day: Available in select cities — ₹199\n\nShare your Order ID to track a specific order.`;
      }

      // 6. Payment Methods
      if (msg.includes("payment") || msg.includes("pay") || msg.includes("upi") || msg.includes("emi") || msg.includes("card")) {
        console.log("✅ Matched: Payment Methods");
        return `💳 We accept:\n\n• UPI (GPay, PhonePe, Paytm)\n• Credit / Debit Cards\n• Net Banking\n• EMI (0% on orders above ₹5000)\n• Cash on Delivery (orders below ₹10,000)`;
      }

      // 7. Offers
      if (msg.includes("offer") || msg.includes("coupon") || msg.includes("discount") || msg.includes("deal") || msg.includes("sale")) {
        console.log("✅ Matched: Offers");
        return `🎉 Current Offers:\n\n• Use code SAVE10 — 10% off on all electronics\n• Free delivery on orders above ₹999\n• Exchange offer: Extra ₹2000 off on old laptop trade-in`;
      }

      // 8. Human Agent
      if (msg.includes("agent") || msg.includes("human") || msg.includes("support") || msg.includes("help me") || msg.includes("talk to")) {
        console.log("✅ Matched: Human Agent");
        return `👤 Connecting you to a support agent...\n\nOr reach us directly:\n📞 1800-XXX-XXXX (Mon–Sat, 9AM–6PM)\n📧 support@yourstore.com\n\nAverage wait time: 2–3 minutes.`;
      }

      // 9. Goodbye
      if (msg.includes("bye") || msg.includes("thank") || msg.includes("thanks") || msg === "goodbye") {
        console.log("✅ Matched: Goodbye");
        return `😊 You're welcome! Have a great day. Feel free to reach out anytime!`;
      }

      // 10. Order ID Lookup
      const orderIdMatch = msg.match(/([0-9a-f]{24})/i);
      if (orderIdMatch) {
        console.log("✅ Matched: Order ID Lookup");
        const orderId = orderIdMatch[1];
        
        try {
          const order = await Order.findById(orderId);
          if (!order) return `❌ No order found with ID: ${orderId}`;
          
          if (userId && order.userId && order.userId.toString() !== userId.toString()) {
            return "🔒 You can only view your own orders.";
          }
          
          const amount = order.totalAmount || order.total || order.price || order.amount || "N/A";
          const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A";
          
          return `📦 Order Details:\n\nID: ${order._id}\nStatus: ${order.status}\nAmount: ₹${amount}\nDate: ${date}`;
        } catch (dbError) {
          console.error("❌ Database error in Order Lookup:", dbError);
          return "⚠️ Unable to fetch order details.";
        }
      }

      // 11. Product Search
      console.log("🔍 Attempting product search...");
      
      // Extract search term
      let searchTerm = msg;
      
      // Remove common search prefixes
      const prefixes = ["search ", "find ", "look for ", "show me ", "get me ", "i want "];
      for (const prefix of prefixes) {
        if (searchTerm.startsWith(prefix)) {
          searchTerm = searchTerm.slice(prefix.length);
          break;
        }
      }
      
      // Remove short words and clean up
      searchTerm = searchTerm.trim();
      
      console.log("📝 Search term after cleaning:", searchTerm);
      
      if (searchTerm.length >= 2) {
        try {
          // Check if Product model exists
          if (!Product) {
            console.error("❌ Product model is not defined!");
            return "🔍 Product search is not available. Please contact support.";
          }
          
          console.log("🔎 Searching database for:", searchTerm);
          
          const products = await Product.find({
            name: { $regex: searchTerm, $options: "i" }
          }).limit(5);
          
          console.log(`📊 Found ${products.length} products`);
          
          if (products.length > 0) {
            const list = products.map(p =>
              `• ${p.name} — ₹${p.price}${p.stock > 0 ? " ✅ In stock" : " ❌ Out of stock"}`
            ).join("\n");
            return `🛍️ Found ${products.length} product(s) for "${searchTerm}":\n\n${list}`;
          } else {
            return `🔍 No products found for "${searchTerm}".\n\nTry searching for: laptop, phone, mouse, keyboard, monitor, etc.`;
          }
        } catch (dbError) {
          console.error("❌ Database error in Product Search:", dbError);
          console.error("Error details:", dbError.message);
          return `🔍 Product search error: ${dbError.message}. Please check if Product collection exists.`;
        }
      }

      // Default fallback
      console.log("❌ No patterns matched");
      return `Sorry, I didn't understand "${message}". 😅\n\nTry:\n• "My orders"\n• "Search laptop"\n• "Cancel order [ID]"\n• "Delivery info"\n• "Payment methods"`;

    } catch (error) {
      console.error("💥 CRITICAL ERROR in ChatService:", error);
      console.error("Error stack:", error.stack);
      return "⚠️ An unexpected error occurred. Please try again later.";
    }
  }
}

export default new ChatService();