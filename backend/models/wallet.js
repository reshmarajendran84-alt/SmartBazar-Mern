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

// Method to add money to wallet
walletSchema.methods.addMoney = async function(amount, description, orderId = null) {
  this.balance += amount;
  this.transactions.push({
    type: "CREDIT",
    amount,
    description,
    orderId,
  });
  await this.save();
  return this;
};

// Method to deduct money from wallet
walletSchema.methods.deductMoney = async function(amount, description, orderId = null) {
  if (this.balance < amount) {
    throw new Error("Insufficient wallet balance");
  }
  this.balance -= amount;
  this.transactions.push({
    type: "DEBIT",
    amount,
    description,
    orderId,
  });
  await this.save();
  return this;
};

const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", walletSchema);

export default Wallet;