// backend/services/adminDashboardService.js
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

class AdminDashboardService {
  async getDashboardStats() {
    try {
      const [
        totalOrders,
        totalUsers,
        totalProducts,
        activeProducts,
        outOfStockProducts,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        revenueData,
        recentOrders,
        topProducts,
        newUsersThisMonth,
      ] = await Promise.all([
        Order.countDocuments(),
        User.countDocuments({ role: "user" }),
        Product.countDocuments(),
        Product.countDocuments({ isActive: true }),
        Product.countDocuments({ stock: 0 }),
        Order.countDocuments({ status: "Pending" }),
        Order.countDocuments({ status: "Confirmed" }),
        Order.countDocuments({ status: "Shipped" }),
        Order.countDocuments({ status: "Delivered" }),
        Order.countDocuments({ status: "Cancelled" }),
        Order.aggregate([
          { $match: { status: "Delivered" } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
        // ✅ FIX: Include address field
        Order.find()
          .populate("userId", "name email phone")
          .select("_id userId address total status createdAt")
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
        Order.aggregate([
          { $match: { status: { $nin: ["Cancelled", "Returned"] } } },
          { $unwind: "$cartItems" },
          {
            $group: {
              _id: "$cartItems.productId",
              name: { $first: "$cartItems.name" },
              totalSold: { $sum: "$cartItems.quantity" },
              revenue: { $sum: { $multiply: ["$cartItems.price", "$cartItems.quantity"] } },
            },
          },
          { $sort: { totalSold: -1 } },
          { $limit: 5 },
        ]),
        User.countDocuments({
          role: "user",
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        }),
      ]);

      const totalRevenue = revenueData[0]?.total ?? 0;

      // Get product names for top products
      const topProductsWithNames = await Promise.all(
        topProducts.map(async (product) => {
          if (!product.name && product._id) {
            const prod = await Product.findById(product._id).select("name");
            return {
              ...product,
              name: prod?.name || "Unknown Product",
            };
          }
          return product;
        })
      );

      // ✅ FIX: Include address data in recent orders
      return {
        totalOrders,
        totalUsers,
        totalProducts,
        activeProducts,
        outOfStockProducts,
        totalRevenue,
        newUsersThisMonth,
        orderStats: {
          pending: pendingOrders,
          confirmed: confirmedOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },
        recentOrders: recentOrders.map(order => ({
          _id: order._id,
          userId: order.userId || null,
          address: order.address || null, // ✅ Include address
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
        })),
        topProducts: topProductsWithNames,
      };
    } catch (error) {
      console.error("Dashboard service error:", error);
      throw error;
    }
  }
}

export default new AdminDashboardService();