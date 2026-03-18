import cartService from "../services/cartService.js";

class CartController {
  async addToCart(req, res) {
    try {
      const cart = await cartService.addToCart(req.user.id, req.body);
      res.json(cart);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async updateCart(req, res) {
    try {
      const cart = await cartService.updateCart(req.user.id, req.body);
      res.json(cart);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async removeFromCart(req, res) {
    try {
      const cart = await cartService.removeFromCart(
        req.user.id,
        req.body.productId
      );
      res.json(cart);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getCart(req, res) {
    try {
      const cart = await cartService.getCart(req.user.id);
      res.json(cart);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new CartController();