import Product from "../models/Product.js";

export const validateStock = async (req, res, next) => {
  try {
    const { cartItems } = req.body;
    
    if (!cartItems || !cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    
    for (const item of cartItems) {
      const productId = item.productId?._id || item.productId;
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({ 
          message: `Product ${item.name || productId} not found` 
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `${product.name} has insufficient stock. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};