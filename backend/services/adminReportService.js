import Order from "../models/Order.js";

class ReportService {
  static async getSalesReport(startDate, endDate) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      // ── SUMMARY ────────────────────────────────────────────
      const orders = await Order.find({
        createdAt: { $gte: start, $lte: end },
      });

      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0); // ✅ total
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // ── REVENUE BY DATE ────────────────────────────────────
      const revenueByDate = await Order.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$total" }, // ✅ total
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // ── TOP PRODUCTS ───────────────────────────────────────
      const topProducts = await Order.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        { $unwind: "$cartItems" }, // ✅ cartItems
        {
          $group: {
            _id: "$cartItems.productId", // ✅ productId
            productName: { $first: "$cartItems.name" }, // ✅ name
            totalQuantitySold: { $sum: "$cartItems.quantity" }, // ✅ quantity
            totalRevenue: { $sum: { $multiply: ["$cartItems.quantity", "$cartItems.price"] } }, // ✅ price
          },
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 10 },
      ]);

      return {
        summary: { totalRevenue, totalOrders, averageOrderValue },
        revenueByDate,
        topProducts,
      };

    } catch (error) {
      console.error("ReportService Error:", error.message);
      throw new Error("Failed to fetch sales report");
    }
  }
}

export default ReportService;