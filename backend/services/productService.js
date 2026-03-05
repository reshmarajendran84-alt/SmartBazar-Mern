import Product from "../models/Product.js";

class ProductService {
  // GET PUBLIC PRODUCTS
  async getPublicProductsService(page=1, category="") {
    const limit = 10;

    const query = { isActive: true };

    if (category) {
      query.category = category;
    }
// if(search){
//   query={$regex:search,$option:"i"};
// }
    const count = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category", "name")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      products,
      page,
      pages: Math.ceil(count / limit),
    };
  }

  // GET SINGLE PRODUCT
  async getSingleProductService(id) {
    return await Product.findById(id)
      .populate("category", "name");
  }
}

// ✅ export instance
export default new ProductService();