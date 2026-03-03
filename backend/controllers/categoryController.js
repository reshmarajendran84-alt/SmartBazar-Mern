import CategoryService from "../services/categoryService.js";
import Category from "../models/Category.js";

class CategoryController {

async addCategory(req, res) {
  try {
    const { name } = req.body;
console.log("req body",req.body);
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const exists = await Category.findOne({ name });

    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await CategoryService.addCategory({ name :req.body.name,
      isActive:true,
    });

    res.status(201).json(category);

  } catch (error) {
    console.log("ADD CATEGORY ERROR:", error);
    res.status(400).json({ message: error.message });
  }
}

async getCategory(req, res) {
  try {
    const data = await CategoryService.getCategory();
    res.json(data);
  } catch (error) {
    console.log("GET CATEGORY ERROR ", error);
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
      const data = await CategoryService.updateCategory(
        req.params.id,
        req.body
      );
      res.json(data);
    } catch (error) {
        console.log(error);

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
