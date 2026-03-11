import Product from "../models/Product.js";
import ProductService from "../services/productService.js";

class ProductController {

  async getProducts(req, res) {
    try {
    const data = await ProductService.getPublicProductsService(req.query);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
}

  async getSingleProduct(req, res) {
    try {
      const product =
        await ProductService.getSingleProductService(req.params.id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
}

export default new ProductController();