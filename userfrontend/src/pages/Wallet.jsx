// // components/Wallet.jsx
// import { useEffect, useState } from "react";
// import { getWallet } from "../services/orderService";

// const Wallet = () => {
//   const [wallet, setWallet] = useState({ balance: 0, transactions: [] });

//   useEffect(() => {
//     const fetchWallet = async () => {
//       const { data } = await getWallet();
//       setWallet(data);
//     };
//     fetchWallet();
//   }, []);

//   return (
//     <div>
//       <h2>Wallet Balance: ₹{wallet.balance}</h2>
//       <h3>Transactions:</h3>
//       {wallet.transactions.map((tx, idx) => (
//         <div key={idx}>{tx.type} ₹{tx.amount}</div>
//       ))}
//     </div>
//   );
// };

// export default Wallet;


import { useEffect, useState, memo } from "react";
// import { getWallet } from "../services/orderService";
 
const Wallet = memo(() => {
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const { data } = await getWallet();
        setWallet(data);
      } catch (err) {
        console.error("Wallet fetch error:", err);
        setError("Failed to load wallet");  // FIX ✅: added error handling
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);
 
  if (loading) return <p className="p-4">Loading wallet...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
 
  return (
    <div className="p-4 border rounded max-w-sm">
      <h2 className="text-xl font-bold mb-2">
        Wallet Balance: ₹{wallet.balance}
      </h2>
      <h3 className="font-semibold mb-2">Transactions:</h3>
      {wallet.transactions.length === 0 ? (
        <p className="text-gray-500 text-sm">No transactions yet.</p>
      ) : (
        wallet.transactions.map((tx, idx) => (
          <div
            key={idx}
            className={`flex justify-between py-1 border-b text-sm
              ${tx.type === "CREDIT" ? "text-green-600" : "text-red-500"}`}
          >
            <span>{tx.type}</span>
            <span>₹{tx.amount}</span>
          </div>
        ))
      )}
    </div>
  );
});
 
export default Wallet;