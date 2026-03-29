import Product from "../models/Product.js";
import mongoose from "mongoose";

class ProductService {

  async getPublicProductsService(query) {

    const page = Number(query.page) || 1;
    const limit = 8;

    const category = query.category;
    const price = query.price;
    const sort = query.sort;
    const search = query.search;

    let filter = { isActive :true};

    // CATEGORY FILTER
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }

    // PRICE FILTER
    if (price) {
      filter.price = { $lte: Number(price) };
    }

    // SEARCH FILTER
    if (search) {
  filter.$or = [
    { name: { $regex: search, $options: "i" } },
   
  ];
}

    let dbQuery = Product.find(filter).populate("category", "name");

    // SORTING
    if (sort === "price_asc") {
      dbQuery = dbQuery.sort({ price: 1 });
    }

    if (sort === "price_desc") {
      dbQuery = dbQuery.sort({ price: -1 });
    }

    const count = await Product.countDocuments(filter);

    const products = await dbQuery
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      products,
      page,
      pages: Math.ceil(count / limit)// total pages for pagination component
    };
  }

  // ⭐ ADD THIS FUNCTION
  async getSingleProductService(id) {
    return await Product.findById(id).populate("category", "name");
  }

}

export default new ProductService();