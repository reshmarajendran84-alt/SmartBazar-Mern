import Product from "../models/Product.js";
import Category from "../models/Category.js";

class AdminProductService {
async createProduct(data, files) {

  if (!data.category) throw new Error("Category required");

  const categoryExists = await Category.findById(data.category);
  if (!categoryExists) throw new Error("Category not found");

  const images = Array.isArray(files)
    ? files.map(file => file.path)
    : [];
const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
    });

  const product = await Product.create({
    name: data.name,
    category: data.category,
    price: Number(data.price),
    stock: Number(data.stock),
    description: data.description || "",
    images:result.secure_url,
  });

  return product;
}
  async getAllProducts(page = 1, category = "") {

    const limit = 6;

    const filter = {};

    if (category && category !== "") {
      filter.category = category;
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
    const product = await Product.findById(id)
      .populate("category", "name");

    if (!product) throw new Error("Product not found");

    return product;
  }

  async updateProduct(id, data, files) {

  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  product.name = data.name || product.name;

  if (data.category && data.category !== "") {
  const categoryExists = await Category.findById(data.category);
  if (!categoryExists) throw new Error("Category not found");
  product.category = data.category;
}
 product.name = data.name ?? product.name;
product.price = data.price ? Number(data.price) : product.price;
product.stock = data.stock ? Number(data.stock) : product.stock;
product.description = data.description ?? product.description;

if (data.category && data.category.trim() !== "") {
  const categoryExists = await Category.findById(data.category);
  if (!categoryExists) throw new Error("Category not found");
  product.category = data.category;
}
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

export default new AdminProductService();
// import Product from "../models/Product.js";

// // CREATE PRODUCT
// export const createProductService = async (data, files) => {
//   const imageUrls = files?.map((file) => file.path) || [];

//   const product = new Product({
//     ...data,
//     images: imageUrls,
//   });

//   return await product.save();
// };

// // GET ALL (Admin can see all products)
// export const getAdminProductsService = async () => {
//   return await Product.find()
//     .populate("category", "name")
//     .sort({ createdAt: -1 });
// };

// // UPDATE PRODUCT
// export const updateProductService = async (id, data, files) => {
//   const product = await Product.findById(id);
//   if (!product) throw new Error("Product not found");

//   if (files && files.length > 0) {
//     product.images = files.map((file) => file.path);
//   }

//   Object.assign(product, data);

//   return await product.save();
// };

// // DELETE PRODUCT
// export const deleteProductService = async (id) => {
//   const product = await Product.findById(id);
//   if (!product) throw new Error("Product not found");

//   await product.deleteOne();
// };