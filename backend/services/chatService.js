import Order from "../models/order.js"
import Product from "../models/product.js"
import getAIReply from "../config/groq.js"
import Coupon from "../models/Coupon.js";
import Wallet from "../models/wallet.js"

class ChatService {
  async getReply(message, userId, aiMode = false) {
    const msg = message.toLowerCase().trim()
    console.log("CHATSERVICE CALLED:", msg)

    // AI mode ON — skip all rules
    if (aiMode) {
      try {
        const aiReply = await getAIReply(message)
        return `🤖 AI: ${aiReply}`
      } catch (err) {
        if (err.status === 429) return "⏳ AI is busy. Please wait a moment and try again."
        return "Sorry, AI is unavailable right now."
      }
    }

    // 1. Greeting
    if (msg.match(/\b(hello|hi|hey|helo|hii)\b/) && msg.split(" ").length <= 4) {
      return "Hi! 👋 How can I help you?"
    }

    // 2. My Orders — real data from DB
    if (
      msg.match(/\bmy orders?\b/)       ||
      msg.includes("order status")      ||
      msg.includes("my order status")   ||
      msg.includes("what is my order")  ||
      msg.includes("show my order")     ||
      msg.includes("check my order")    ||
      msg.includes("track my order")    ||
      msg.includes("where is my order") ||
      msg.includes("order history")     ||
      msg.includes("my purchases")      ||
      msg.includes("what i ordered")    ||
      msg.includes("my recent order")
    ) {
      if (!userId) return "🔒 Please login to view your orders."
const orders = await Order.find({ userId }).sort({ createdAt: -1 }).limit(5)
const wallet = await Wallet.findOne({ userId }) 
      if (orders.length === 0) return "You have no orders yet."
      const list = orders.map((o, i) =>
        `${i + 1}. ${o.status} — ₹${o.total || o.totalAmount || "N/A"}\n   Payment: ${o.paymentMethod || "N/A"}\n   Date: ${new Date(o.createdAt).toLocaleDateString()}\n   ID: ${o._id}`
      ).join("\n\n")
      const walletInfo = wallet 
  ? `\n\n💰 Wallet Balance: ₹${wallet.balance}` 
  : ""
      return `📋 Your Recent Orders:\n\n${list}${walletInfo}`
    }

    // 3. Cancel Order
    if (
      msg.includes("cancel order")    ||
      msg.includes("cancel my order") ||
      msg.includes("i want to cancel")||
      msg.includes("stop my order")   ||
      (msg.includes("cancel") && msg.match(/\border\b/))
    ) {
      const idMatch = msg.match(/([0-9a-f]{12,24})/i)
      if (!idMatch) return "Please provide your Order ID to cancel.\nExample: 'cancel order 66a1b2c3d4e5f6...'"
      const order = await Order.findById(idMatch[1])
      if (!order) return "❌ Order not found."
      if (order.status !== "pending" && order.status !== "Pending")
        return `⚠️ Cannot cancel. Order is already: ${order.status}`
      order.status = "cancelled"
      await order.save()
      return ` Order ${order._id} cancelled successfully.`
    }

    // 4. Return / Refund
    if (
      msg.includes("return")        ||
      msg.includes("refund")        ||
      msg.includes("money back")    ||
      msg.includes("want to return")||
      msg.includes("return policy") ||
      msg.includes("return item")   ||
      msg.includes("exchange item") ||
      msg.includes("damaged item")  ||
      msg.includes("wrong item")    ||
      msg.includes("defective")
    ) {
      return `🔄 Return & Refund Policy:\n\n• Items can be returned within 7 days of delivery\n• Must be unused and in original packaging\n• Refund processed in 5-7 business days\n\nTo start a return, share your Order ID and reason.`
    }

    // 5. Delivery info
    if (
      msg.includes("delivery")         ||
      msg.includes("shipping")         ||
      msg.includes("how long")         ||
      msg.includes("how many days")    ||
      msg.includes("dispatch")         ||
      msg.includes("delivery charges") ||
      msg.includes("shipping cost")    ||
      msg.includes("free delivery")    ||
      msg.includes("express delivery") ||
      msg.includes("when will i get")  ||
      msg.includes("estimated time")
    ) {
      return `🚚 Delivery Information:\n\n• Standard: 5-7 business days — Free\n• Express: 2-3 business days — ₹99\n• Same Day: Available in select cities — ₹199\n\nShare your Order ID to track a specific order.`
    }

    // 6. Payment — show last used method from DB if logged in
    if (
      msg.includes("payment")         ||
      msg.includes("pay")             ||
      msg.includes("upi")             ||
      msg.includes("emi")             ||
      msg.includes("gpay")            ||
      msg.includes("phonepe")         ||
      msg.includes("paytm")           ||
      msg.includes("credit card")     ||
      msg.includes("debit card")      ||
      msg.includes("cod")             ||
      msg.includes("cash on delivery")||
      msg.includes("how to pay")      ||
      msg.includes("payment method")  ||
      msg.includes("which payment")   ||
      msg.includes("net banking")
    ) {
      const idMatch = msg.match(/([0-9a-f]{4,24})/i)
  if (idMatch) {
    const partialId = idMatch[1].toLowerCase()
    console.log("Looking for order with partial ID:", partialId) 

    // Search in user's orders
    const allOrders = userId 
      ? await Order.find({ userId }) 
      : await Order.find({})
    
    const matchedOrder = allOrders.find(o => 
      o._id.toString().toLowerCase().includes(partialId.toLowerCase())
    )

    console.log("Matched order:", matchedOrder?._id) 

    if (matchedOrder) {
      return `💳 Payment for Order:\n\nID: ${matchedOrder._id}\nPayment Method: ${matchedOrder.paymentMethod}\nAmount: ₹${matchedOrder.total || matchedOrder.totalAmount || "N/A"}\nStatus: ${matchedOrder.status}`
    }
  }

  // No order ID — show last used payment from DB
  const baseReply = `💳 We accept:\n\n• UPI (GPay, PhonePe, Paytm)\n• Credit / Debit Cards\n• Net Banking\n• EMI (0% on orders above ₹5000)\n• Cash on Delivery\n• Wallet`

  if (userId) {
    const lastOrder = await Order.findOne({ userId }).sort({ createdAt: -1 })
    if (lastOrder?.paymentMethod) {
      return `${baseReply}\n\n📌 Your last used method: ${lastOrder.paymentMethod}`
    }
  }
  return baseReply
}
// 7. Offers — but first check if user asking about specific order
if (
  msg.includes("offer")    ||
  msg.includes("coupon")   ||
  msg.includes("discount") ||
  msg.includes("deal")     ||
  msg.includes("sale")     ||
  msg.includes("promo")    ||
  msg.includes("cashback") ||
  msg.includes("voucher")  ||
  msg.includes("best price")
) {
  // Check if message has an order ID — user asking about specific order
  const idInMsg = msg.match(/([0-9a-f]{6,24})/i)
  if (idInMsg) {
    const partialId = idInMsg[1].toLowerCase()
    const allOrders = userId ? await Order.find({ userId }) : await Order.find({})
    const order = allOrders.find(o =>
      o._id.toString().toLowerCase().includes(partialId)
    )
    if (order) {
      const couponInfo = order.coupon && order.coupon !== ""
        ? `✅ Coupon Used: ${order.coupon}\n   Discount Applied: ₹${order.discount || 0}`
        : "❌ No coupon used for this order"

      return `🏷️ Offer Details for Order:\n\nID: ${order._id}\n${couponInfo}\nTotal Paid: ₹${order.total || order.totalAmount || "N/A"}\nSubtotal: ₹${order.subtotal || "N/A"}`
    }
  }

  // No order ID — show current deals from DB
  const featuredProducts = await Product.find({ isActive: true })
    .sort({ price: 1 })
    .limit(3)

  const today = new Date()
  const coupons = await Coupon.find({
    isActive: true,
    expiryDate: { $gte: today }
  }).limit(3)

  const productList = featuredProducts.length > 0
    ? featuredProducts.map(p =>
        `• ${p.name} — ₹${p.price}${p.stock > 0 ? " ✅" : " ❌ Out of stock"}`
      ).join("\n")
    : "• No featured products right now"

  const couponList = coupons.length > 0
    ? coupons.map(c =>
        `• ${c.code} — ${c.discountPercent}% off${c.minOrderAmount > 0 ? ` (min ₹${c.minOrderAmount})` : ""}`
      ).join("\n")
    : "• No active coupons right now"

  return `🎉 Current Deals:\n\n🛍️ Featured Products:\n${productList}\n\n🏷️ Available Coupons:\n${couponList}\n\n📦 Free delivery above ₹999`
}

// 8. Human agent
    if (
      msg.includes("agent")          ||
      msg.includes("human")          ||
      msg.includes("talk to agent")  ||
      msg.includes("customer care")  ||
      msg.includes("customer support")||
      msg.includes("contact support") ||
      msg.includes("help me")        ||
      msg.includes("need help")      ||
      msg.includes("phone number")   ||
      msg.includes("contact number") ||
      msg.includes("helpline")
    ) {
      return `👤 Connecting you to a support agent...\n\nOr reach us directly:\n📞 1800-XXX-XXXX (Mon–Sat, 9AM–6PM)\n📧 support@yourstore.com\n\nAverage wait time: 2–3 minutes.`
    }

    // 9. Goodbye
    if (
      msg.includes("bye")      ||
      msg.includes("goodbye")  ||
      msg.includes("thank you")||
      msg.includes("thanks")   ||
      msg.includes("thats all")||
      msg.includes("ok bye")
    ) {
      return `😊 You're welcome! Have a great day!`
    }

    // 10. Order ID lookup — real data from DB
    const orderIdMatch = msg.match(/([0-9a-f]{6,24})/i)
    if (orderIdMatch) {
      const partialId = orderIdMatch[1].toLowerCase()
      try {
        let order = null
        if (partialId.length === 24) {
          order = await Order.findById(partialId)
        }
        if (!order) {
          const orders = userId ? await Order.find({ userId }) : await Order.find({})
          order = orders.find(o => o._id.toString().toLowerCase().includes(partialId))
        }
        if (!order) return `❌ No order found matching: ${partialId}`
        const amount = order.total || order.totalAmount || "N/A"
        
const couponInfo = order.coupon && order.coupon !== ""
  ? `\nCoupon Used: ${order.coupon}\nDiscount: ₹${order.discount || 0}`
  : "\nCoupon Used: None"

return `📦 Order Details:\n\nID: ${order._id}\nStatus: ${order.status}\nSubtotal: ₹${order.subtotal || "N/A"}\nDiscount: ₹${order.discount || 0}\nTotal: ₹${amount}\nPayment: ${order.paymentMethod || "N/A"}${couponInfo}\nDate: ${new Date(order.createdAt).toLocaleDateString()}`
      } catch (err) {
        return "❌ Invalid Order ID."
      }
    }

    // 11. Product Search — real data from DB
    const isQuestion = /\b(how|what|when|where|why|which|can|do|is|are|will|should|would|does)\b/i.test(msg)

    if (!isQuestion) {
      let searchTerm = msg
      if (msg.startsWith("search ")) {
        searchTerm = msg.replace("search ", "").trim()
      }
      const stopWords = /\b(search|find|show|me|for|product|looking|i want|do you have|a|an|the|buy|get|need)\b/gi
      searchTerm = searchTerm.replace(stopWords, "").trim()

      if (searchTerm.length > 1 && searchTerm.split(" ").length <= 4) {
        const products = await Product.find({
          name: { $regex: searchTerm, $options: "i" },
          isActive: true
        }).limit(4)

        if (products.length > 0) {
          const list = products.map(p =>
            `• ${p.name} — ₹${p.price}${p.stock > 0 ? " ✅" : " ❌ Out of stock"}`
          ).join("\n")
          return `🛍️ Found for "${searchTerm}":\n\n${list}`
        }
      }
    }

    // 12. AI fallback
    try {
      const aiReply = await getAIReply(message)
      return `🤖 AI: ${aiReply}`
    } catch (err) {
      if (err.status === 429) return "⏳ AI is busy right now. Please wait a moment and try again."
      return "Sorry, I didn't understand. Try: 'my orders', 'dell laptop', 'return'"
    }
  }
}

export default new ChatService()