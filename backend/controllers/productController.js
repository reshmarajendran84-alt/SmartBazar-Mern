import ProductService from "../services/productService.js";

class ProductController {

  async create(req, res) {
    try {
      const data = await ProductService.createProduct(req.body);
      res.status(201).json(data);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const products = await ProductService.getAllProducts();
      res.json({ products });   // ✅ ALWAYS send response
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const product = await ProductService.getSingleProduct(req.params.id);
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async update(req, res) {
    try {
      const data = await ProductService.updateProduct(
        req.params.id,
        req.body
      );
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async remove(req, res) {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.json({ message: "Product deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new ProductController();
