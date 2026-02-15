import CategoryService from "../services/categoryService.js";

class CategoryController {

  async addCategory(req, res) {
    try {
      const data = await CategoryService.addCategory(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCategory(req, res) {
    try {
      const data = await CategoryService.getCategory();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      await CategoryService.deleteCategory(req.params.id);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new CategoryController();
