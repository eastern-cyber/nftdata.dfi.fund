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

function decodeTransferEvent(topics: string[] = []) {
  if (!topics || topics.length < 4) {
    return { eventId: "", from: "N/A", to: "N/A", tokenId: "N/A" };
  }

  const eventSignature = topics[0];

  // Helper function to format address from topic
  const extractAddress = (topic: string | undefined) => {
    if (!topic || topic.length < 42) return "N/A";
    const hex = topic.startsWith("0x") ? topic.slice(2) : topic;
    return "0x" + hex.slice(hex.length - 40);
  };

  // Helper function to convert hex to decimal for token ID
  const hexToDecimal = (hex: string | undefined) => {
    if (!hex) return "N/A";
    try {
      hex = hex.startsWith("0x") ? hex.slice(2) : hex;
      return BigInt(`0x${hex}`).toString();
    } catch {
      return "N/A";
    }
  };

  return {
    eventId: eventSignature,
    from: extractAddress(topics[1]),  // From address
    to: extractAddress(topics[2]),    // To address
    tokenId: hexToDecimal(topics[3])  // Token ID
  };
}

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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full m-4 p-6 pb-20 font-sans">
      <main className="flex flex-col items-center gap-8 w-full m-4">
        <div className="text-center">
          <p className="text-2xl font-bold">Blockchain Data</p>
          <WalletConnect />
        </div>
        {loading ? (
          <p>Loading transactions...</p>
        ) : (
          <table className="table-auto border-collapse border border-gray-500 w-full m-4">
            <thead>
              <tr>
                <th className="border border-gray-500 p-2">Transaction Hash</th>
                <th className="border border-gray-500 p-2">From</th>
                <th className="border border-gray-500 p-2">To</th>
                <th className="border border-gray-500 p-2">Token ID</th>
              </tr>
            </thead>
            <tbody>
              {data.map((tx, index) => {
                const decoded = decodeTransferEvent(tx.topics);
                return (
                  <tr key={index}>
                    <td className="border border-gray-500 p-2">
                      <a
                        href={`https://polygonscan.com/tx/${tx.transaction_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {tx.transaction_hash.slice(0, 10)}...
                      </a>
                    </td>
                    <td className="border border-gray-500 p-2">{decoded.from}</td>
                    <td className="border border-gray-500 p-2">{decoded.to}</td>
                    <td className="border border-gray-500 p-2">{decoded.tokenId}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
