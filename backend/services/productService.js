import Product from "../models/Product.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";

class ProductService {
  async getPublicProductsService(query) {
    const page = Number(query.page) || 1;
    const limit = 8;
    const { category, price, sort, search, rating } = query;

    let filter = { isActive: true };

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }

    if (price) {
      filter.price = { $lte: Number(price) };
    }
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }
    if (search) {
      filter.$or = [{ name: { $regex: search, $options: "i" } }];
    }

    let dbQuery = Product.find(filter).populate("category", "name");

    if (sort === "price_asc") dbQuery = dbQuery.sort({ price: 1 });
    if (sort === "price_desc") dbQuery = dbQuery.sort({ price: -1 });

    const count = await Product.countDocuments(filter);
    const products = await dbQuery.skip((page - 1) * limit).limit(limit);

    return {
      products,
      page,
      pages: Math.ceil(count / limit),
    };
  }

  async getSingleProductService(id) {
    return await Product.findById(id).populate("category", "name");
  }

  // ── Called when user places an order (run inside a loop per item) ──────────
  async deductStock(item) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.product, stock: { $gte: item.qty } },
      { $inc: { stock: -item.qty } },
      { new: true },
    );

    if (!updated) {
      throw new Error(
        `"${item.name}" is out of stock or insufficient quantity`,
      );
    }

    return updated;
  }

  // ── Called when user cancels (pending / processing only) ──────────────────
  async cancelOrder(orderId) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    const cancellableStatuses = ["pending", "processing"];
    if (!cancellableStatuses.includes(order.status)) {
      throw new Error("Order cannot be cancelled at this stage");
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.qty },
      });
    }

    order.status = "cancelled";
    await order.save();
    return order;
  }

  // ── Called when user requests a return (after delivery) ───────────────────
  async requestReturn(orderId) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (order.status !== "delivered") {
      throw new Error("Returns are only allowed for delivered orders");
    }

    // No stock change yet — item is still with the customer
    order.status = "return_requested";
    await order.save();
    return order;
  }
}

export default new ProductService();
