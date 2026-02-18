import CategoryService from "../services/categoryService.js";
import Category from "../models/Category.js";

class CategoryController {

async addCategory(req, res) {
  console.log(req.user);

  try {
    const exists = await Category.findOne({ name: req.body.name });

    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const data = await CategoryService.addCategory(req.body);

    res.status(201).json(data);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async getCategory(req, res) {
  try {
    const data = await CategoryService.getCategory();
    console.log("CATEGORIES:", data);
    res.json(data);
  } catch (error) {
    console.log("GET CATEGORY ERROR:", error);
    res.status(400).json({ message: error.message });
  }
}


  async updateCategory(req, res) {
    try {
      const data = await CategoryService.updateCategory(
        req.params.id,
        req.body
      );
      res.json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
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
}

export default new CategoryController();
