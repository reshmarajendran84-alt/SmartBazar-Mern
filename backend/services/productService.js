import Product from "../models/Product.js";
import Category from "../models/Category.js";

class ProductService {

  async createProduct(data, files) {

    // if (!data.name || !data.price || !data.stock || !data.category) {
    //   throw new Error("All fields are required");
    // }
  if (!data.category) throw new Error("Category required");

    const categoryExists = await Category.findById(data.category);
    if (!categoryExists) throw new Error("Category not found");

    const product = await Product.create({
      name: data.name,
      category: data.category,
      price: Number(data.price),
      stock: Number(data.stock),
      description: data.description || "",
      images: files?.map(file => file.path) || [],
    });

    return product;
  }

  async getAllProducts(query) {

  const page = Number(query.page) || 1;
  const limit = 6;

  const filter = {};

  // ✅ apply category only if exists
  if (query.category && query.category !== "") {
    filter.category = query.category;
  }

  const products = await Product.find(filter)
    .populate("category")
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  return {
    products,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}
 async getSingleProduct(id) {
  const product = await Product.findById(id)
    .populate("category", "name");

  if (!product) throw new Error("Product not found");

  return product;
}
  async updateProduct(id, data, files) {

    const updateData = {
      name: data.name,
      category: data.category,
      price: data.price ?Number(data.price):0,
      stock: data.price ? Number(data.stock):0,
      description: data.description || "",
    };

    if (files && files.length > 0) {
      updateData.images = files.map(file => file.path || file.filename);
    }

 const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });

  if (!updated) throw new Error("Product not found");

  return updated;
}

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}

export default new ProductService();