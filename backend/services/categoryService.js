import Category from "../models/Category.js";

class CategoryService {

  async addCategory(data) {
    console.log(data);
    const category = await Category.create(data);
    return category;
  }

  async getCategory() {
    return await Category.find().sort({ createdAt: -1 }); // ✅ removed isActive filter
  }

  async getSingleCategory(id) {
    return await Category.findById(id);
  }

  async updateCategory(id, data) {
    return await Category.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteCategory(id) {
    // return await Category.findByIdAndUpdate(id, { isActive: false }, { new: true });
  return await Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  async getCategoryWithCount() {
  const categories = await Category.aggregate([
    { $match: { isDeleted: { $ne: true } } }, // ✅ hide deleted, show blocked
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "category",
        as: "products",
      },
    },
    { $addFields: { productCount: { $size: "$products" } } },
    { $project: { name: 1, isActive: 1, productCount: 1 } },
  ]);
  return categories;
}
}

export default new CategoryService();