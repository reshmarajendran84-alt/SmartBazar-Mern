import Product from "../models/Product.js";
import Category from "../models/Category.js";

class ProductService {

  async createProduct(data, files) {

    const categoryExists = await Category.findById(data.category);
    if (!categoryExists) throw new Error("Category not found");

    const product = await Product.create({
      name: data.name,
      category: data.category,
      price: Number(data.price),
      stock: Number(data.stock),
      description: data.description,
      images: files?.map(file => file.path) || [],
    });

    return product;
  }

  async getAllProducts() {
    return await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });
  }

  async getSingleProduct(id) {
    return await Product.findById(id).populate("category", "name");
  }

  async updateProduct(id, data, files) {

    const updateData = {
      name: data.name,
      category: data.category,
      price: Number(data.price),
      stock: Number(data.stock),
      description: data.description,
    };

    if (files && files.length > 0) {
      updateData.images = files?.map(file => file.path) || []
    }

    return await Product.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}

export default new ProductService();