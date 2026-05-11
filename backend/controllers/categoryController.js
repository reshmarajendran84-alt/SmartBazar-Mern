import CategoryService from "../services/categoryService.js";
import Category from "../models/Category.js";

class CategoryController {

  async addCategory(req, res) {
    try {
      const { name } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ message: "Name is required" });
      }
      const exists = await Category.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, "i") } 
      });
      if (exists) {
        return res.status(400).json({ message: "Category already exists" });
      }
      const category = await CategoryService.addCategory({
        name: name.trim(),
        isActive: true,
      });
      res.status(201).json(category);
    } catch (error) {
      console.log("ADD CATEGORY ERROR:", error);
      res.status(400).json({ message: error.message });
    }
  }

  async getCategory(req, res) {
    try {
      const data = await CategoryService.getCategoryWithCount();
      res.json(data);
    } catch (error) {
      console.log("GET CATEGORY ERROR", error);
      res.status(400).json({ message: error.message });
    }
  }

  async getSingleCategory(req, res) {
    try {
      const category = await CategoryService.getSingleCategory(req.params.id);
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

async updateCategory(req, res) {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required"
      });
    }

    const duplicate = await Category.findOne({
      _id: { $ne: req.params.id },
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") }
    });

    if (duplicate) {
      return res.status(400).json({
        message: "Category already exists"
      });
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    res.json(updated);

  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(400).json({
      message: error.message
    });
  }
}
  async deleteCategory(req, res) {
    try {
      await CategoryService.deleteCategory(req.params.id);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async toggleCategoryStatus(req, res) {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) return res.status(404).json({ message: "Category not found" });
      category.isActive = !category.isActive;
      await category.save();
      res.json({
        message: `Category ${category.isActive ? "Unblocked" : "Blocked"} successfully`,
        isActive: category.isActive,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default new CategoryController();