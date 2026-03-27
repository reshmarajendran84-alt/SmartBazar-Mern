import WalletService from "../services/walletService.js";

class WalletController {
  async getWallet(req, res) {
    try {
      const wallet = await WalletService.getWallet(req.user.id);
      res.status(200).json({ success: true, wallet });
    } catch (err) {
      console.error("GET WALLET ERROR:", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  async creditWallet(req, res) {
    try {
      const { amount, description } = req.body;
      const wallet = await WalletService.creditWallet(req.user.id, amount, description);
      res.status(200).json({ success: true, wallet });
    } catch (err) {
      console.error("CREDIT WALLET ERROR:", err.message);
      res.status(500).json({ message: err.message });
    }
  }

  async debitWallet(req, res) {
    try {
      const { amount, description } = req.body;
      const wallet = await WalletService.debitWallet(req.user.id, amount, description);
      res.status(200).json({ success: true, wallet });
    } catch (err) {
      console.error("DEBIT WALLET ERROR:", err.message);
      res.status(500).json({ message: err.message });
    }
  }
}

export default new WalletController();