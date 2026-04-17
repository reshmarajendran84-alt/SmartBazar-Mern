import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

class ReportService {
  static async getSalesReport(startDate, endDate) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const matchStage = { createdAt: { $gte: start, $lte: end } };

      // ── RAW ORDERS ─────────────────────────────────────────────
      const orders = await Order.find(matchStage)
        .populate({
          path: "userId",
          select: "name email phone createdAt",
          model: "User"
        })
        .populate("cartItems.productId", "name price images category")
        .lean();

      // ── MAP ORDERS WITH CORRECT CUSTOMER DATA ─────────────────
      // Priority: 1. Address data (for guest checkouts) 2. User data (for registered users)
      const mappedOrders = orders.map(order => {
        // Get customer name from address first (works for both guest and registered)
        const customerName = order.address?.fullName || 
                            order.userId?.name || 
                            "Unknown User";
        
        const customerPhone = order.address?.phone || 
                             order.userId?.phone || 
                             "N/A";
        
        const customerEmail = order.userId?.email || 
                             (order.address?.email) || 
                             "N/A";

        return {
          ...order,
          customerInfo: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            isRegistered: !!order.userId?._id,
            userId: order.userId?._id || null
          }
        };
      });

      // ── SUMMARY CALCULATIONS ────────────────────────────────────
      const deliveredOrders = mappedOrders.filter(o => o.status === "Delivered");
      const cancelledOrders = mappedOrders.filter(o => o.status === "Cancelled");
      const returnedOrders = mappedOrders.filter(o => o.status === "Returned");
      const pendingOrders = mappedOrders.filter(o => o.status === "Pending");
      const confirmedOrders = mappedOrders.filter(o => o.status === "Confirmed");
      const shippedOrders = mappedOrders.filter(o => o.status === "Shipped");
      
      const totalRevenue = mappedOrders
        .filter(o => !["Cancelled", "Returned"].includes(o.status))
        .reduce((sum, o) => sum + (o.total || 0), 0);

      const totalOrders = mappedOrders.length;
      const totalDelivered = deliveredOrders.length;
      const totalCancelled = cancelledOrders.length;
      const totalReturned = returnedOrders.length;
      const totalPending = pendingOrders.length;
      const totalConfirmed = confirmedOrders.length;
      const totalShipped = shippedOrders.length;
      
      const totalDiscount = mappedOrders.reduce((sum, o) => sum + (o.discount || 0), 0);
      const totalShipping = mappedOrders.reduce((sum, o) => sum + (o.shipping || 0), 0);
      const totalTax = mappedOrders.reduce((sum, o) => sum + (o.tax || 0), 0);
      
      const totalProductsSold = mappedOrders
        .filter(o => !["Cancelled", "Returned"].includes(o.status))
        .reduce((sum, o) => sum + (o.cartItems?.reduce((s, i) => s + (i.quantity || 0), 0) || 0), 0);
      
      // Get unique customers by name+phone from address
      const uniqueCustomersMap = new Map();
      mappedOrders.forEach(o => {
        const key = `${o.customerInfo.name}_${o.customerInfo.phone}`;
        if (!uniqueCustomersMap.has(key)) {
          uniqueCustomersMap.set(key, {
            name: o.customerInfo.name,
            email: o.customerInfo.email,
            phone: o.customerInfo.phone
          });
        }
      });
      const uniqueCustomers = uniqueCustomersMap.size;
      
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const cancellationRate = totalOrders > 0 ? ((totalCancelled / totalOrders) * 100).toFixed(1) : 0;
      const returnRate = totalDelivered + totalReturned > 0 ? ((totalReturned / (totalDelivered + totalReturned)) * 100).toFixed(1) : 0;
      const couponsUsed = mappedOrders.filter(o => o.coupon?.trim()).length;
      const netRevenue = totalRevenue - totalDiscount;

      // ── FINANCIAL BREAKDOWN ────────────────────────────────────
      const paymentGatewayFees = mappedOrders.reduce((sum, o) => {
        if (o.paymentMethod === "ONLINE" && !["Cancelled", "Returned"].includes(o.status)) {
          return sum + (o.total || 0) * 0.02;
        }
        return sum;
      }, 0);

      const financialBreakdown = {
        grossRevenue: totalRevenue,
        totalDiscount,
        totalShippingCollected: totalShipping,
        totalTax,
        estimatedPaymentGatewayFees: parseFloat(paymentGatewayFees.toFixed(2)),
        netRevenue: parseFloat(netRevenue.toFixed(2)),
        profitMargin: totalRevenue > 0 ? parseFloat(((netRevenue / totalRevenue) * 100).toFixed(1)) : 0,
      };

      // ── REVENUE BY DATE ────────────────────────────────────────
      const revenueByDate = await Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: {
              $sum: {
                $cond: [
                  { $in: ["$status", ["Cancelled", "Returned"]] },
                  0,
                  "$total",
                ],
              },
            },
            orders: { $sum: 1 },
            unitsSold: { $sum: { $size: "$cartItems" } },
            totalDiscount: { $sum: "$discount" },
            delivered: {
              $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0] },
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
            },
          },
        },
        {
          $addFields: {
            averageOrderValue: {
              $cond: [{ $gt: ["$orders", 0] }, { $divide: ["$revenue", "$orders"] }, 0],
            },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // ── TOP PRODUCTS WITH DETAILS ───────────────────────────────
      const topProductsAgg = await Order.aggregate([
        { $match: matchStage },
        { $unwind: "$cartItems" },
        {
          $group: {
            _id: "$cartItems.productId",
            productName: { $first: "$cartItems.name" },
            totalQuantitySold: { $sum: "$cartItems.quantity" },
            totalRevenue: {
              $sum: { $multiply: ["$cartItems.quantity", "$cartItems.price"] },
            },
            unitPrice: { $first: "$cartItems.price" },
            returnCount: {
              $sum: {
                $cond: [
                  { $in: ["$status", ["Returned", "Return_requested"]] },
                  "$cartItems.quantity",
                  0,
                ],
              },
            },
            cancelledCount: {
              $sum: {
                $cond: [{ $eq: ["$status", "Cancelled"] }, "$cartItems.quantity", 0],
              },
            },
            deliveredCount: {
              $sum: {
                $cond: [{ $eq: ["$status", "Delivered"] }, "$cartItems.quantity", 0],
              },
            },
          },
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 20 },
      ]);

      const topProducts = await Promise.all(
        topProductsAgg.map(async (p) => {
          const product = await Product.findById(p._id)
            .populate("category", "name")
            .lean();
          const returnRate = p.totalQuantitySold > 0 ? parseFloat(((p.returnCount / p.totalQuantitySold) * 100).toFixed(1)) : 0;
          
          return {
            productId: p._id,
            productName: p.productName,
            category: product?.category?.name || "N/A",
            images: product?.images || [],
            currentPrice: product?.price ?? p.unitPrice,
            currentStock: product?.stock ?? 0,
            totalQuantitySold: p.totalQuantitySold,
            totalRevenue: p.totalRevenue,
            returnCount: p.returnCount,
            cancelledCount: p.cancelledCount,
            deliveredCount: p.deliveredCount,
            returnRate,
            isActive: product?.isActive ?? true,
          };
        })
      );

      // ── COUPON BREAKDOWN ───────────────────────────────────────
      const couponBreakdown = await Order.aggregate([
        {
          $match: {
            ...matchStage,
            coupon: { $exists: true, $ne: "" },
          },
        },
        {
          $group: {
            _id: "$coupon",
            timesUsed: { $sum: 1 },
            totalDiscount: { $sum: "$discount" },
            totalRevenue: { $sum: "$total" },
            avgDiscount: { $avg: "$discount" },
          },
        },
        { $sort: { timesUsed: -1 } },
      ]);

      // ── ORDER DETAILS WITH CORRECT CUSTOMER DATA ───────────────
      const orderDetails = mappedOrders.map((o) => ({
        orderId: o._id,
        orderNumber: `ORD${String(o._id).slice(-8).toUpperCase()}`,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
        deliveredAt: o.status === "Delivered" ? o.updatedAt : null,
        cancelledAt: o.status === "Cancelled" ? o.updatedAt : null,
        returnedAt: o.status === "Returned" ? o.updatedAt : null,
        
        // ✅ CORRECT: Use address data first, then user data
        customer: {
          name: o.customerInfo.name,
          email: o.customerInfo.email,
          phone: o.customerInfo.phone,
          isRegistered: o.customerInfo.isRegistered,
        },
        
        address: {
          fullName: o.address?.fullName || o.customerInfo.name,
          phone: o.address?.phone || o.customerInfo.phone,
          addressLine: o.address?.addressLine || "N/A",
          city: o.address?.city || "N/A",
          state: o.address?.state || "N/A",
          pincode: o.address?.pincode || "N/A",
        },
        
        items: o.cartItems.map(item => ({
          productId: item.productId?._id || item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
          image: item.productId?.images?.[0] || null,
        })),
        
        itemCount: o.cartItems?.length || 0,
        totalQuantity: o.cartItems?.reduce((sum, i) => sum + (i.quantity || 0), 0) || 0,
        
        pricing: {
          subtotal: o.subtotal || 0,
          discount: o.discount || 0,
          couponCode: o.coupon || null,
          couponDiscount: o.couponDiscount || 0,
          shipping: o.shipping || 0,
          tax: o.tax || 0,
          total: o.total || 0,
        },
        
        paymentMethod: o.paymentMethod,
        paymentStatus: o.razorpayPaymentId ? "Paid" : (o.paymentMethod === "COD" ? "Pending" : "N/A"),
        status: o.status,
        
        timeline: {
          ordered: o.createdAt,
          confirmed: o.status === "Confirmed" ? o.updatedAt : null,
          shipped: o.status === "Shipped" ? o.updatedAt : null,
          delivered: o.status === "Delivered" ? o.updatedAt : null,
          cancelled: o.status === "Cancelled" ? o.updatedAt : null,
          returned: o.status === "Returned" ? o.updatedAt : null,
        },
      }));

      // ── CUSTOMER INSIGHTS (using address names) ─────────────────
      const customerMap = new Map();
      
      for (const o of mappedOrders) {
        const key = `${o.customerInfo.name}_${o.customerInfo.phone}`;
        if (!customerMap.has(key)) {
          customerMap.set(key, {
            name: o.customerInfo.name,
            email: o.customerInfo.email,
            phone: o.customerInfo.phone,
            orderCount: 0,
            totalSpent: 0,
            lastOrderDate: null,
            firstOrderDate: o.createdAt,
          });
        }
        const customer = customerMap.get(key);
        customer.orderCount += 1;
        if (!["Cancelled", "Returned"].includes(o.status)) {
          customer.totalSpent += o.total || 0;
        }
        if (!customer.lastOrderDate || o.createdAt > customer.lastOrderDate) {
          customer.lastOrderDate = o.createdAt;
        }
      }

      const customerList = Array.from(customerMap.values());
      
      const repeatBuyers = customerList.filter(c => c.orderCount > 1).length;
      const oneTimeBuyers = customerList.length - repeatBuyers;
      const repeatPurchaseRate = customerList.length > 0 ? parseFloat(((repeatBuyers / customerList.length) * 100).toFixed(1)) : 0;

      const topCustomers = customerList
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10);

      // City breakdown
      const cityMap = new Map();
      for (const o of mappedOrders) {
        const city = o.address?.city?.trim();
        if (!city) continue;
        if (!cityMap.has(city)) {
          cityMap.set(city, { city, orders: 0, revenue: 0, delivered: 0, cancelled: 0 });
        }
        const cityData = cityMap.get(city);
        cityData.orders += 1;
        if (o.status === "Delivered") cityData.delivered += 1;
        if (o.status === "Cancelled") cityData.cancelled += 1;
        if (!["Cancelled", "Returned"].includes(o.status)) {
          cityData.revenue += o.total || 0;
        }
      }
      const topCities = Array.from(cityMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      const customerInsights = {
        totalUniqueCustomers: customerList.length,
        newCustomers: customerList.length, // Simplified for guest checkouts
        returningCustomers: repeatBuyers,
        repeatPurchaseRate,
        customerSegments: { 
          highValue: customerList.filter(c => c.totalSpent >= 5000).length,
          mediumValue: customerList.filter(c => c.totalSpent >= 1000 && c.totalSpent < 5000).length,
          lowValue: customerList.filter(c => c.totalSpent < 1000).length,
          repeatBuyers,
          oneTimeBuyers,
        },
        topCustomers,
        topCities,
      };

      // ── OPERATIONAL METRICS ────────────────────────────────────
      const operationalMetrics = {
        totalOrders,
        totalDelivered,
        totalCancelled,
        totalReturned,
        totalPending,
        totalConfirmed,
        totalShipped,
        cancellationRate: parseFloat(cancellationRate),
        returnRate: parseFloat(returnRate),
        deliverySuccessRate: totalOrders > 0 ? parseFloat(((totalDelivered / totalOrders) * 100).toFixed(1)) : 0,
        pendingOrders: pendingOrders.length,
        shippedOrders: shippedOrders.length,
        paymentMethodBreakdown: mappedOrders.reduce((acc, o) => {
          acc[o.paymentMethod] = (acc[o.paymentMethod] || 0) + 1;
          return acc;
        }, {}),
        statusBreakdown: {
          Pending: totalPending,
          Confirmed: totalConfirmed,
          Shipped: totalShipped,
          Delivered: totalDelivered,
          Cancelled: totalCancelled,
          Returned: totalReturned,
        },
      };

      return {
        summary: {
          totalRevenue,
          totalOrders,
          totalDelivered,
          totalCancelled,
          totalReturned,
          totalPending,
          totalConfirmed,
          totalShipped,
          totalProductsSold,
          totalCustomers: uniqueCustomers,
          averageOrderValue,
          totalDiscount,
          couponsUsed,
          netRevenue,
          cancellationRate: parseFloat(cancellationRate),
          returnRate: parseFloat(returnRate),
          deliverySuccessRate: operationalMetrics.deliverySuccessRate,
        },
        financialBreakdown,
        revenueByDate,
        topProducts,
        couponBreakdown,
        customerInsights,
        operationalMetrics,
        orderDetails,
      };
    } catch (error) {
      console.error("ReportService Error:", error.message);
      throw new Error("Failed to fetch sales report");
    }
  }
}

export default ReportService;