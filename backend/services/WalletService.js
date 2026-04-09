import Wallet from "../models/wallet.js";

class WalletService {
  // Get or create wallet for user
  async getOrCreateWallet(userId) {
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({
        userId,
        balance: 0,
        transactions: [],
      });
      console.log(`Created new wallet for user: ${userId}`);
    }
    return wallet;
  }

  // Get wallet with transactions
  async getWallet(userId) {
    const wallet = await this.getOrCreateWallet(userId);
    return wallet;
  }

  // Credit money to wallet (REFUND)
  async creditWallet(userId, amount, description, orderId = null) {
    try {
      console.log(`💰 Crediting ₹${amount} to wallet for user ${userId}`);
      console.log(`Reason: ${description}`);
      
      const wallet = await this.getOrCreateWallet(userId);
      const oldBalance = wallet.balance;
      
      await wallet.addMoney(amount, description, orderId);
      
      console.log(`✅ Wallet credited: ₹${oldBalance} → ₹${wallet.balance}`);
      console.log(`Transaction added: ${description}`);
      
      return wallet;
    } catch (error) {
      console.error("Error crediting wallet:", error);
      throw error;
    }
  }

  // Debit money from wallet (PAYMENT)
  async debitWallet(userId, amount, description, orderId = null) {
    try {
      console.log(`💸 Debiting ₹${amount} from wallet for user ${userId}`);
      console.log(`Reason: ${description}`);
      
      const wallet = await this.getOrCreateWallet(userId);
      const oldBalance = wallet.balance;
      
      await wallet.deductMoney(amount, description, orderId);
      
      console.log(`✅ Wallet debited: ₹${oldBalance} → ₹${wallet.balance}`);
      
      return wallet;
    } catch (error) {
      console.error("Error debiting wallet:", error);
      throw error;
    }
  }

  // Get wallet balance only
  async getBalance(userId) {
    const wallet = await this.getOrCreateWallet(userId);
    return wallet.balance;
  }

  // Get transaction history
  async getTransactions(userId, limit = 50) {
    const wallet = await this.getOrCreateWallet(userId);
    return wallet.transactions.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
  }
}

export default new WalletService();