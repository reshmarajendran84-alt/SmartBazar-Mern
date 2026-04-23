import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["CREDIT", "DEBIT"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  transactionType: {
    type: String,
    enum: ["REFUND", "TOPUP", "PAYMENT", "BONUS", "CASHBACK"],
    required: true,
    default: "PAYMENT"
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

// Method to add money to wallet (for top-ups)
walletSchema.methods.addMoney = async function(amount, description, orderId = null, transactionType = "TOPUP") {
  if (!amount || amount <= 0) {
    throw new Error("Invalid amount");
  }
  
  this.balance += amount;

  this.transactions.push({
    type: "CREDIT",
    amount,
    description,
    orderId,
    transactionType: transactionType || "TOPUP",
    createdAt: new Date()
  });

  await this.save();
  return this;
};

// Method to deduct money from wallet
walletSchema.methods.deductMoney = async function(amount, description, orderId = null, transactionType = "PAYMENT") {
  if (this.balance < amount) {
    throw new Error("Insufficient wallet balance");
  }
  
  this.balance -= amount;
  this.transactions.push({
    type: "DEBIT",
    amount,
    description,
    orderId,
    transactionType: transactionType || "PAYMENT",
    createdAt: new Date()
  });
  
  await this.save();
  return this;
};

// Method to add refund
walletSchema.methods.addRefund = async function(amount, description, orderId = null) {
  return this.addMoney(amount, description, orderId, "REFUND");
};

// Method to add bonus/cashback
walletSchema.methods.addBonus = async function(amount, description, orderId = null) {
  return this.addMoney(amount, description, orderId, "BONUS");
};

const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", walletSchema);

export default Wallet;