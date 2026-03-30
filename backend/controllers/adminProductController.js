import AdminProductService from "../services/adminProductService.js";
import cloudinary from "../config/cloudinary.js";
class AdminProductController {

  async createProduct(req, res) {
  try {
  console.log("req.files count:", req.files?.length); 
  console.log("req.files:", req.files);  
    const imageUrls = req.files?.map(file => file.path )|| [] ;
     console.log("imageUrls:", imageUrls);               

    const product = await AdminProductService.createProduct(req.body, imageUrls);   
   res.status(201).json(product);

  } catch (error) {
    console.log("Create Product Error:", error);
    res.status(500).json({ message: error.message });
  }
}
async getSingleProduct(req, res) {
  try {
    const product = await AdminProductService.getSingleProduct(
      req.params.id
    );
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
  async getAdminProducts(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const category = req.query.category || "";

      const products = await AdminProductService.getAllProducts(
        page,
        category
      );

      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

async updateProduct(req, res) {
  try {

    const imageUrls = req.files?.map(file => file.path) || [];

    const product = await AdminProductService.updateProduct(
      req.params.id,
      req.body,
      imageUrls
    );
res.json(product);

  } catch (error) {
    console.log("update error", error);
    res.status(500).json({ message: error.message });
  }
}

  async deleteProduct(req, res) {
    try {
      await AdminProductService.deleteProduct(req.params.id);
      res.json({ message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new AdminProductController();