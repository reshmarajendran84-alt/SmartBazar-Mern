import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

export const getDashboardStats = async (req, res) => {
  try {
    console.log("Fetching dashboard stats...");
    
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
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productInfo"
          }
        },
        {
          $project: {
            _id: 1,
            name: { $ifNull: [{ $arrayElemAt: ["$productInfo.name", 0] }, "$name"] },
            totalSold: 1,
            revenue: 1,
          }
        }
      ]),
      User.countDocuments({
        role: "user",
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
    ]);

    const totalRevenue = revenueData[0]?.total ?? 0;

    const formattedRecentOrders = recentOrders.map(order => ({
      _id: order._id,
      userId: order.userId || null,
      address: order.address || null, 
      total: order.total || 0,
      status: order.status || "Pending",
      createdAt: order.createdAt,
    }));

    // Format top products
    const formattedTopProducts = topProducts.map(product => ({
      _id: product._id,
      name: product.name || "Unknown Product",
      totalSold: product.totalSold || 0,
      revenue: product.revenue || 0,
    }));

    const responseData = {
      totalOrders: totalOrders || 0,
      totalUsers: totalUsers || 0,
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
      outOfStockProducts: outOfStockProducts || 0,
      totalRevenue: totalRevenue || 0,
      newUsersThisMonth: newUsersThisMonth || 0,
      orderStats: {
        pending: pendingOrders || 0,
        confirmed: confirmedOrders || 0,
        shipped: shippedOrders || 0,
        delivered: deliveredOrders || 0,
        cancelled: cancelledOrders || 0,
      },
      recentOrders: formattedRecentOrders,
      topProducts: formattedTopProducts,
    };

    console.log("Dashboard stats prepared:", {
      totalOrders: responseData.totalOrders,
      orderStats: responseData.orderStats,
      topProductsCount: responseData.topProducts.length,
      recentOrdersCount: responseData.recentOrders.length,
      sampleOrderAddress: responseData.recentOrders[0]?.address // Debug log
    });

    res.json(responseData);
  } catch (err) {
    console.error("getDashboardStats error:", err.message);
    console.error("Stack trace:", err.stack);
    res.status(500).json({ 
      message: "Failed to fetch dashboard statistics",
      error: err.message 
    });
  }
};