// backend/services/reportService.js
import Order from "../models/Order.js"; // adjust according to your model

// Service layer handles all business logic / DB queries
class ReportService {
  // Get sales report between two dates
  static async getSalesReport(startDate, endDate) {
    try {
      // Example: fetch orders from DB (replace with real MongoDB query)
      // Assuming Order has fields: totalPrice, createdAt
      const orders = await Order.find({
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      });

      // Aggregate example
      const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);

      return {
        totalOrders: orders.length,
        totalSales,
        orders,
      };
    } catch (error) {
      console.error("ReportService Error:", error.message);
      throw new Error("Failed to fetch sales report");
    }
  }
}

export default ReportService;