import { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const WalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const { data } = await api.get("/wallet");
        setWallet(data.wallet);
      } catch (err) {
        console.error("Wallet fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading wallet...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">

        {/* Balance card */}
        <div className="bg-indigo-600 text-white rounded-2xl p-8 mb-6 shadow-lg">
          <p className="text-sm opacity-70 mb-1">Total Balance</p>
          <h2 className="text-5xl font-bold mb-1">
            ₹{wallet?.balance?.toFixed(2) || "0.00"}
          </h2>
          <p className="text-xs opacity-50 mt-2">
            Refunds from cancelled/returned orders are credited here
          </p>
        </div>

        {/* Quick links */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => navigate("/my-orders")}
            className="flex-1 bg-white border rounded-xl py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition"
          >
            My Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-white border rounded-xl py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition"
          >
            Shop Now
          </button>
        </div>

        {/* Transaction history */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">
            Transaction History
          </h3>

          {!wallet?.transactions?.length ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">💳</p>
              <p className="text-gray-400 text-sm">No transactions yet.</p>
              <p className="text-gray-300 text-xs mt-1">
                Cancel a prepaid order to get a refund here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...wallet.transactions].reverse().map((txn, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b pb-3 last:border-0"
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
                          day: "numeric",
                          month: "short",
                          year: "numeric",
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