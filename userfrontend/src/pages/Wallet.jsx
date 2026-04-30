import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const WalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const fetchWallet = useCallback(async () => {
    try {
      const { data } = await api.get("/wallet");
      setWallet(data.wallet);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  // Filter transactions based on active tab
  const getFilteredTransactions = () => {
    if (!wallet?.transactions) return [];
    
    let txns = [];
  switch (activeTab) {
    case "refunds":
      txns = wallet.transactions.filter(txn => txn.transactionType === "REFUND");
      break;
    case "payments":
      txns = wallet.transactions.filter(txn => txn.transactionType === "PAYMENT");
      break;
    default:
      txns = wallet.transactions;
  }
  return [...txns].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

  // Calculate balances
  const refundTransactions = wallet?.transactions?.filter(
    txn => txn.transactionType === "REFUND"
  ) || [];
  
  const paymentTransactions = wallet?.transactions?.filter(
    txn => txn.transactionType === "PAYMENT"
  ) || [];
  
  const totalRefunds = refundTransactions.reduce(
    (total, txn) => total + txn.amount, 0
  );
  
  const totalPayments = paymentTransactions.reduce(
    (total, txn) => total + txn.amount, 0
  );

  const filteredTransactions = getFilteredTransactions();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallet</h1>
          <p className="text-gray-600">Manage your transactions and refunds</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Current Balance Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 rounded-full p-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Wallet</span>
            </div>
            <p className="text-sm opacity-90 mb-1">Current Balance</p>
            <p className="text-3xl font-bold">₹{wallet?.balance?.toFixed(2) || '0.00'}</p>
          </div>

          {/* Total Refunds Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">Total</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Refunds</p>
            <p className="text-2xl font-bold text-green-600">+₹{totalRefunds.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-2">{refundTransactions.length} transactions</p>
          </div>

          {/* Total Payments Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full">Total</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Payments</p>
            <p className="text-2xl font-bold text-red-600">-₹{totalPayments.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-2">{paymentTransactions.length} transactions</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => navigate("/my-orders")}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            My Orders
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M18 13l1.5 6M9 21h6M12 18v3" />
            </svg>
            Continue Shopping
          </button>
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              {[
                { id: "all", label: "All Transactions", icon: "M4 6h16M4 12h16M4 18h16" },
                { id: "refunds", label: "Refunds", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                { id: "payments", label: "Payments", icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 inline-flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          <div className="divide-y divide-gray-100">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500">No transactions found</p>
                <p className="text-sm text-gray-400 mt-1">Start shopping to see your transactions</p>
              </div>
            ) : (
              filteredTransactions.map((txn, idx) => (
                <div key={idx} className="p-6 hover:bg-gray-50 transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Left side - Transaction details */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon based on transaction type */}
                      <div className={`flex-shrink-0 rounded-full p-2 ${
                        txn.type === "CREDIT" 
                          ? "bg-green-100" 
                          : "bg-red-100"
                      }`}>
                        {txn.type === "CREDIT" ? (
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          </svg>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{txn.description}</p>
                        <div className="flex flex-wrap gap-3 mt-1">
                          <span className="inline-flex items-center text-xs text-gray-500">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(txn.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${
                            txn.transactionType === "REFUND" ? "bg-green-100 text-green-700" :
                            txn.transactionType === "PAYMENT" ? "bg-red-100 text-red-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                            {txn.transactionType}
                          </span>
                          {txn.orderId && (
                            <span className="text-xs text-gray-400 font-mono">
                              Order #{txn.orderId.slice(-8).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right side - Amount */}
                    <div className={`text-right ${
                      txn.type === "CREDIT" ? "text-green-600" : "text-red-600"
                    }`}>
                      <p className="text-lg font-bold">
                        {txn.type === "CREDIT" ? "+" : "-"}₹{txn.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Stats */}
        {wallet?.transactions?.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Total {wallet.transactions.length} transactions
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;