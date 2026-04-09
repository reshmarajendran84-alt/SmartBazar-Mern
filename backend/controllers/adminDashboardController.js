import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      activeProducts,
      outOfStockProducts,

      // Order status counts
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,

      // Revenue from delivered orders only
      revenueData,

      // Recent 5 orders
      recentOrders,

      // Top 5 selling products
      topProducts,

      // New users this month
      newUsersThisMonth,
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: "user" }),
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ stock: 0 }),

      Order.countDocuments({ status: { $regex: /^pending$/i } }),
      Order.countDocuments({ status: { $regex: /^confirmed$/i } }),
      Order.countDocuments({ status: { $regex: /^shipped$/i } }),
      Order.countDocuments({ status: { $regex: /^delivered$/i } }),
      Order.countDocuments({ status: { $regex: /^cancelled$/i } }),

      // Sum total of all delivered orders
      Order.aggregate([
        { $match: { status: { $regex: /^delivered$/i } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),

      // Recent orders with user info
      Order.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .limit(5),

      // Top selling products by quantity sold
      Order.aggregate([
        { $match: { status: { $not: /^cancelled$/i } } },
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

      // Users registered this calendar month
      User.countDocuments({
        role: "user",
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
    ]);

    const totalRevenue = revenueData[0]?.total ?? 0;

    res.json({
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
      recentOrders,
      topProducts,
    });
  } catch (err) {
    console.error("getDashboardStats error:", err.message);
    res.status(500).json({ message: err.message });
  }
};