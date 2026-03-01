import ProductService from "../services/productService.js";

class ProductController {

  async create(req, res) {
  try {

    console.log("BODY", req.body);
    console.log("FILES ", req.files);

    const data = await ProductService.createProduct(req.body, req.files);

    res.status(201).json(data);

  } catch (err) {
    console.log("CREATE ERROR ", err.message);
    res.status(400).json({ message: err.message });
  }
}
  async getAllProducts(req, res) {
    try {
      console.log("QUERY:", req.query);
    const products = await ProductService.getAllProducts(req.query);
      res.json(products);
    } catch (err) { 
      console.log("GET PRODUCT ERROR:", err);   
      res.status(500).json({ message: err.message });
    }
  }

async getOne(req, res) {
  try {
    const product = await ProductService.getSingleProduct(req.params.id);
    res.json(product);
  } catch (error) {
    console.log("GET ONE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
}
  async update(req, res) {
    try {
      const data = await ProductService.updateProduct(
        req.params.id,
        req.body,
        req.files
      );
      res.json(data);
    } catch (err) { console.log(err);  
      res.status(500).json({ message: err.message });
    }
  }

  async remove(req, res) {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.json({ message: "Product deleted" });
    } catch (err) { console.log(err);  
      res.status(500).json({ message: err.message });
    }
  }
}

export default new ProductController();
