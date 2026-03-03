// import { number } from "joi";
// import ProductService from "../services/productService";

// class ProductController {

//   async create(req, res) {
//   try {

//     console.log("BODY", req.body);
//     console.log("FILES ", req.files);

//     const data = await ProductService.createProduct(req.body, req.files);

//     res.status(201).json(data);

//   } catch (err) {
//     console.log("CREATE ERROR ", err.message);
//     res.status(400).json({ message: err.message });
//   }
// }
//   async getAllProducts(req, res) {
//     try {
//       console.log("QUERY:", req.page,"category Query",req.category);
//     const page =Number(req.query.page) || 1;
//     const category = req.query.category || "";
//       const products = await ProductService.getAllProducts(page.category);

      
//     res.json(products);
//     } catch (err) { 
//       console.log("GET PRODUCT ERROR:", err);   
//       res.status(500).json({ message: err.message });
//     }
//   }

// async getOne(req, res) {
//   try {
//     const product = await ProductService.getSingleProduct(req.params.id);
//     res.json(product);
//   } catch (error) {
//     console.log("GET ONE ERROR:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// }
//   async update(req, res) {
//     try {
//       const data = await ProductService.updateProduct(
//         req.params.id,
//         req.body,
//         req.files
//       );
//       res.json(data);
//     } catch (err) { console.log(err);  
//       res.status(500).json({ message: err.message });
//     }
//   }

//   async remove(req, res) {
//     try {
//       await ProductService.deleteProduct(req.params.id);
//       res.json({ message: "Product deleted" });
//     } catch (err) { console.log(err);  
//       res.status(500).json({ message: err.message });
//     }
//   }
// }

// export default new ProductController();
import ProductService from "../services/productService.js";

class ProductController {

  async getProducts(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const category = req.query.category || "";

      const data = await ProductService.getPublicProductsService(
        page,
        category
      );

      res.json(data);
    } catch (error) {
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