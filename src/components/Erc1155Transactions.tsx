"use client"; // for Next.js App Router

import { useEffect, useState } from "react";
import { fetchErc1155Transactions, Erc1155Transaction } from "@/utils/fetchErc1155";

const CONTRACT_ADDRESS = "0x2a61627c3457ccea35482cadec698c7360ffb9f2";
const API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;


const Erc1155Transactions = () => {
  const [transactions, setTransactions] = useState<Erc1155Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Log the API_KEY value to the console
    console.log("API_KEY:", process.env.NEXT_PUBLIC_POLYGON_API_KEY);

    // If API_KEY is missing, log an error
    if (!API_KEY) {
        console.error("API key is missing. Please check your environment variables.");
        setLoading(false);
        return;
      }

    const getTransactions = async () => {
      const data = await fetchErc1155Transactions(CONTRACT_ADDRESS, API_KEY);
      setTransactions(data);
      setLoading(false);
    };

    getTransactions();
  }, [API_KEY]);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">ERC-1155 Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="space-y-3">
          {transactions.map((tx, index) => (
            <li key={index} className="p-3 border rounded-lg bg-gray-100">
              <p><strong>Transaction:</strong> {tx.transactionHash}</p>
              <p><strong>Block:</strong> {tx.blockNumber}</p>
              <p><strong>From:</strong> {tx.from}</p>
              <p><strong>To:</strong> {tx.to}</p>
              <p><strong>Token ID:</strong> {tx.tokenID}</p>
              <p><strong>Timestamp:</strong> {new Date(Number(tx.timeStamp) * 1000).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Erc1155Transactions;

// "use client"; // for Next.js App Router

// import { useEffect, useState } from "react";
// import { fetchErc1155Transactions, Erc1155Transaction } from "@/utils/fetchErc1155";

// const CONTRACT_ADDRESS = "0x2a61627c3457ccea35482cadec698c7360ffb9f2";
// const API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY;

// const Erc1155Transactions = () => {
//   const [transactions, setTransactions] = useState<Erc1155Transaction[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getTransactions = async () => {
//       const data = await fetchErc1155Transactions(CONTRACT_ADDRESS, API_KEY);
//       setTransactions(data);
//       setLoading(false);
//     };

//     getTransactions();
//   }, []);

//   if (loading) return <p>Loading transactions...</p>;

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">ERC-1155 Transactions</h2>
//       {transactions.length === 0 ? (
//         <p>No transactions found.</p>
//       ) : (
//         <ul className="space-y-3">
//           {transactions.map((tx, index) => (
//             <li key={index} className="p-3 border rounded-lg bg-gray-100">
//               <p><strong>Transaction:</strong> {tx.transactionHash}</p>
//               <p><strong>Block:</strong> {tx.blockNumber}</p>
//               <p><strong>From:</strong> {tx.from}</p>
//               <p><strong>To:</strong> {tx.to}</p>
//               <p><strong>Token ID:</strong> {tx.tokenID}</p>
//               <p><strong>Timestamp:</strong> {new Date(Number(tx.timeStamp) * 1000).toLocaleString()}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Erc1155Transactions;
