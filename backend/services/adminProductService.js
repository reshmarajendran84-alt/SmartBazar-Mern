import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";

class AdminProductService {

  async createProduct(data, imageUrls = []) {
    if (!data.category) throw new Error("Category required");

    const categoryExists = await Category.findById(data.category);
    if (!categoryExists) throw new Error("Category not found");

    const product = await Product.create({
      name: data.name,
      category: data.category,
      price: Number(data.price),
      stock: Number(data.stock),
      description: data.description || "",
      images: imageUrls,
      isActive: true,
    });

    return product;
  }

  async getAllProducts(page = 1, category = "", search = "") {
    const limit = 100;
    const filter = {};

    if (category && category !== "") {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter)
      .populate("category", "name")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    return {
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getSingleProduct(id) {
    const product = await Product.findById(id).populate("category", "name");
    if (!product) throw new Error("Product not found");
    return product;
  }

  async updateProduct(id, data, imageUrls = []) {
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");

    product.name        = data.name        ?? product.name;
    product.price       = data.price       ? Number(data.price) : product.price;
    product.stock       = data.stock       ? Number(data.stock) : product.stock;
    product.description = data.description ?? product.description;

    // Single category check — only when a new value was sent
    if (data.category && data.category.trim() !== "") {
      const categoryExists = await Category.findById(data.category);
      if (!categoryExists) throw new Error("Category not found");
      product.category = data.category;
    }

    // Only replace images when new ones were uploaded
    if (imageUrls && imageUrls.length > 0) {
      product.images = imageUrls;
    }

    await product.save();
    return product;
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }

  // ─── Stock restoration on return approval (called by admin) ───────────────
  async approveReturn(orderId) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (order.status !== "return_requested") {
      throw new Error("Order is not in return_requested state");
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.qty },
      });
    }

    order.status = "returned";
    await order.save();
    return order;
  }
}

export default new AdminProductService();