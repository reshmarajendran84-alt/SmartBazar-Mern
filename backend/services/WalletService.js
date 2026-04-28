import Wallet from "../models/wallet.js";

class WalletService {
  async getWallet(userId) {
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({ 
        userId, 
        balance: 0, 
        transactions: [] 
      });
    }
    return wallet;
  }

  async creditWallet(userId, amount, description, orderId = null, transactionType = "REFUND") {
    try {
      let wallet = await Wallet.findOne({ userId });
      
      if (!wallet) {
        wallet = new Wallet({ 
          userId, 
          balance: 0, 
          transactions: [] 
        });
      }
      
      if (!amount || amount <= 0) {
        throw new Error("Invalid amount for credit");
      }
      
      await wallet.addMoney(amount, description, orderId, transactionType);
      
      return wallet;
    } catch (error) {
      console.error("Credit wallet error:", error);
      throw new Error(`Failed to credit wallet: ${error.message}`);
    }
  }

  async debitWallet(userId, amount, description, orderId = null, transactionType = "PAYMENT") {
    try {
      let wallet = await Wallet.findOne({ userId });
      
      if (!wallet) {
        throw new Error("Wallet not found");
      }
      
      if (!amount || amount <= 0) {
        throw new Error("Invalid amount for debit");
      }
      
      // Deduct money using the wallet schema method
      await wallet.deductMoney(amount, description, orderId, transactionType);
      
      return wallet;
    } catch (error) {
      console.error("Debit wallet error:", error);
      throw new Error(`Failed to debit wallet: ${error.message}`);
    }
  }

  async getBalance(userId) {
    const wallet = await this.getWallet(userId);
    return wallet.balance;
  }

  async getTransactions(userId, limit = 50) {
    const wallet = await this.getWallet(userId);
    return wallet.transactions
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  }
}

export default new WalletService();