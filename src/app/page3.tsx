"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import WalletConnect from "@/components/WalletConnect";

interface Transaction {
  address: string;
  block_hash: string;
  block_number: number;
  block_timestamp: number;
  chain_id: number;
  data: string;
  topics: string[];
  transaction_hash: string;
  transaction_index: number;
  log_index: number;
}

function decodeTransferEvent(topics: string[]) {
  if (!topics || topics.length < 4) {
    return {
      eventId: "",
      from: "Unknown",
      to: "Unknown",
      tokenId: "Unknown",
    };
  }

  const extractAddress = (topic: string) => {
    if (!topic) return "Invalid Address";
    const hex = topic.startsWith("0x") ? topic.slice(2) : topic;
    return "0x" + hex.slice(hex.length - 40);
  };

  const hexToDecimal = (hex: string) => {
    try {
      hex = hex.startsWith("0x") ? hex.slice(2) : hex;
      return BigInt(`0x${hex}`).toString();
    } catch {
      return hex;
    }
  };

  return {
    eventId: topics[0] || "",
    from: extractAddress(topics[1]),
    to: extractAddress(topics[2]),
    tokenId: hexToDecimal(topics[3]),
  };
}

// function decodeTransferEvent(topics: string[]) {
//   const eventSignature = topics[0];

//   const extractAddress = (topic: string) => {
//     const hex = topic.startsWith("0x") ? topic.slice(2) : topic;
//     return "0x" + hex.slice(hex.length - 40);
//   };

//   const hexToDecimal = (hex: string) => {
//     try {
//       hex = hex.startsWith("0x") ? hex.slice(2) : hex;
//       return BigInt(`0x${hex}`).toString();
//     } catch {
//       return hex;
//     }
//   };

//   return {
//     eventId: eventSignature,
//     from: extractAddress(topics[1]),
//     to: extractAddress(topics[2]),
//     tokenId: hexToDecimal(topics[3]),
//   };
// }

export default function Home() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://insight.thirdweb.com/v1/events/0x2a61627c3457cCEA35482cAdEC698C7360fFB9F2?chain=137&sort_by=block_timestamp&sort_order=desc&limit=40&clientId=${process.env.NEXT_PUBLIC_CLIENT_ID}`
      );
      const responseData = await response.json();
      setData(responseData.data);
      console.log(responseData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log("Fetched Transactions:", data);
  
    const filteredData = data.filter((tx) => {
    const decoded = decodeTransferEvent(tx.topics);
    console.log("Decoded From:", decoded.from);
    console.log("Expected Address:", "0xYourAddressHere".toLowerCase());
    console.log("Match:", decoded.from.toLowerCase() === "0xYourAddressHere".toLowerCase());  
    return decoded.from.trim().toLowerCase() === "0xYourAddressHere".trim().toLowerCase();
  });

  return (
    <div className="p-4 w-full">
      <h1 className="text-center text-2xl font-bold mb-6">Blockchain Transactions</h1>
      <WalletConnect />
      {loading ? (
        <p className="text-center">Loading transactions...</p>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-900">
                <th className="border p-2">Transaction Hash</th>
                <th className="border p-2">From</th>
                <th className="border p-2">To</th>
                <th className="border p-2">Token ID</th>
                <th className="border p-2">Block</th>
              </tr>
            </thead>
            <tbody>
    {filteredData.length > 0 ? (
      filteredData.map((tx, index) => {
        const decoded = decodeTransferEvent(tx.topics);
        return (
          <tr key={index} className="border">
            <td className="border p-2 text-blue-500 truncate max-w-xs">
              <a
                href={`https://polygonscan.com/tx/${tx.transaction_hash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tx.transaction_hash.slice(0, 10)}...
              </a>
            </td>
            <td className="border p-2">{decoded.from}</td>
            <td className="border p-2">{decoded.to}</td>
            <td className="border p-2">{decoded.tokenId}</td>
            <td className="border p-2">{tx.block_number}</td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan={5} className="text-center p-4">No matching transactions found</td>
      </tr>
    )}
  </tbody>

          </table>
        </div>
      )}
    </div>
  );
}