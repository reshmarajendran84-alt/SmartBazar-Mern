import Product from "../models/Product.js";
import Category from "../models/Category.js";

class ProductService {

  async createProduct(data) {

    const categoryExists = await Category.findById(data.category);

    if (!categoryExists) {
      throw new Error("Category not found");
    }

    const product = await Product.create(data);

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
  async getSingleProduct(id) {
    return await Product.findById(id).populate("category", "name");
  }

  async updateProduct(id, data) {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}

export default new ProductService();
