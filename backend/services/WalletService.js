// import Wallet from "../models/wallet.js";

// class WalletService {

//   async getOrCreateWallet(userId) {
//     let wallet = await Wallet.findOne({ userId });
//     if (!wallet) {
//       wallet = await Wallet.create({ userId, balance: 0, transactions: [] });
//     }
//     return wallet;
//   }

//   async getWallet(userId) {
//     return await this.getOrCreateWallet(userId);
//   }

//   async creditWallet(userId, amount, description, orderId = null) {
//     const wallet = await this.getOrCreateWallet(userId);
//     wallet.balance += amount;
//     wallet.transactions.push({
//       type: "CREDIT",
//       amount,
//       description,
//       orderId,
//     });
//     await wallet.save();
//     return wallet;
//   }

//   async debitWallet(userId, amount, description, orderId = null) {
//     const wallet = await this.getOrCreateWallet(userId);
//     if (wallet.balance < amount) throw new Error("Insufficient wallet balance");
//     wallet.balance -= amount;
//     wallet.transactions.push({
//       type: "DEBIT",
//       amount,
//       description,
//       orderId,
//     });
//     await wallet.save();
//     return wallet;
//   }
// }

// export default new WalletService();