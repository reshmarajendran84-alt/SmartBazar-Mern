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

  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  product.name = data.name || product.name;

  if (data.category) {
    const categoryExists = await Category.findById(data.category);
    if (!categoryExists) throw new Error("Category not found");
    product.category = data.category;
  }

  product.price = data.price ? Number(data.price) : product.price;
  product.stock = data.stock ? Number(data.stock) : product.stock;
  product.description = data.description || product.description;

  if (files && files.length > 0) {
    product.images = files.map(file => file.path);
  }

  await product.save();

  return product;
}
  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}

export default new ProductService();