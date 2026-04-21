import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const WalletPage = () => {
  const [wallet, setWallet]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [addAmount, setAddAmount] = useState("");
  const [adding, setAdding]       = useState(false);
  const navigate = useNavigate();

  // ── Fetch wallet ─────────────────────────────────────────────────────
  // useCallback so handleTopUp can call it after top-up succeeds
  const fetchWallet = useCallback(async () => {
    try {
      const { data } = await api.get("/wallet");
      setWallet(data.wallet);
    } catch (err) {
      console.error("Wallet fetch error:", err);
      toast.error("Failed to load wallet");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  // ── Razorpay top-up ──────────────────────────────────────────────────
  const handleTopUp = async (amount) => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      // Step 1: create Razorpay order
      const { data } = await api.post("/wallet/topup/create", { amount: parseFloat(amount) });

      // Step 2: open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "SmartBazar Wallet",
        description: `Add ₹${amount} to wallet`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            // Step 3: verify and credit
            await api.post("/wallet/topup/verify", {
              ...response,
              amount: parseFloat(amount),
            });
            toast.success(`₹${amount} added to wallet!`);
            setAddAmount("");
            await fetchWallet(); // refresh balance
          } catch (err) {
            toast.error(err?.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {},
        theme: { color: "#6366f1" },
        modal: {
          ondismiss: () => toast.info("Payment cancelled"),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Top-up error:", err);
      toast.error(err?.response?.data?.message || "Failed to initiate payment");
    }
  };

  // ── Quick-add presets ────────────────────────────────────────────────
  const handleQuickAdd = (amount) => {
    setAddAmount(String(amount));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading wallet...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">

        {/* Balance card */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl p-8 mb-6 shadow-lg">
          <p className="text-sm opacity-80 mb-1">Total Balance</p>
          <h2 className="text-5xl font-bold mb-1">
            ₹{wallet?.balance?.toFixed(2) || "0.00"}
          </h2>
          <p className="text-xs opacity-70 mt-2">
            Refunds from cancelled/returned orders are credited here
          </p>
        </div>

        {/* Add Money via Razorpay */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Add Money to Wallet</h3>

          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Enter amount"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              min="1"
              step="100"
            />
            <button
              onClick={() => handleTopUp(addAmount)}
              disabled={adding}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition whitespace-nowrap"
            >
              {adding ? "Processing..." : "Add Money"}
            </button>
          </div>

          {/* Quick presets */}
          <p className="text-xs text-gray-500 mt-3">
            Quick add:
            {[100, 500, 1000, 2000].map((amt) => (
              <button
                key={amt}
                onClick={() => handleQuickAdd(amt)}
                className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium underline-offset-2 hover:underline"
              >
                ₹{amt}
              </button>
            ))}
          </p>

          {/* Quick pay directly without typing */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[100, 500, 1000, 2000].map((amt) => (
              <button
                key={amt}
                onClick={() => handleTopUp(amt)}
                className="border border-indigo-200 text-indigo-600 text-sm py-1.5 rounded-lg hover:bg-indigo-50 transition font-medium"
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => navigate("/my-orders")}
            className="flex-1 bg-white border border-gray-200 rounded-xl py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition"
          >
            My Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-white border border-gray-200 rounded-xl py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition"
          >
            Shop Now
          </button>
        </div>

        {/* Transaction history */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Transaction History</h3>

          {!wallet?.transactions?.length ? (
            <div className="text-center py-8">
              <p className="text-5xl mb-3">💳</p>
              <p className="text-gray-400 text-sm">No transactions yet.</p>
              <p className="text-gray-300 text-xs mt-1">
                Cancel a prepaid order to get a refund here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[...wallet.transactions].reverse().map((txn, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b pb-3 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                      txn.type === "CREDIT"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}>
                      {txn.type === "CREDIT" ? "↑" : "↓"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {txn.description}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(txn.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${
                    txn.type === "CREDIT" ? "text-green-600" : "text-red-500"
                  }`}>
                    {txn.type === "CREDIT" ? "+" : "-"}₹{txn.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default WalletPage;