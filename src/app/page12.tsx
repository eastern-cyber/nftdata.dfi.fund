"use client";

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
      return { eventId: "", from: "N/A", to: "N/A", tokenId: "Invalid Token ID" };
    }
  
    const extractAddress = (topic: string | undefined) => {
      if (!topic || topic.length < 42) return "N/A";
      const hex = topic.startsWith("0x") ? topic.slice(2) : topic;
      return "0x" + hex.slice(hex.length - 40);
    };
  
    const hexToDecimal = (hex: string | undefined) => {
      if (!hex) return "Invalid Token ID";
      try {
        hex = hex.startsWith("0x") ? hex.slice(2) : hex; // Remove 0x prefix if present
        return BigInt("0x" + hex).toString(); // Convert hex to decimal
      } catch {
        return "Invalid Token ID";
      }
    };
  
    return {
      eventId: topics[0],
      from: extractAddress(topics[1]),
      to: extractAddress(topics[2]),
      tokenId: hexToDecimal(topics[3]),
    };
  }  

export default function Home() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://insight.thirdweb.com/v1/events/0x2a61627c3457cCEA35482cAdEC698C7360fFB9F2?chain=137&sort_by=block_timestamp&startblock=0&endblock=99999999&sort_order=desc&limit=50000&clientId=${process.env.NEXT_PUBLIC_CLIENT_ID}`
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

  const handleDownload = () => {
    const filteredData = data
      .map((tx) => ({
        ...decodeTransferEvent(tx.topics),
        block_number: tx.block_number,
        block_timestamp: new Date(tx.block_timestamp * 1000).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
        transaction_hash: tx.transaction_hash,
      }))
      .filter((decoded) => decoded.from !== "N/A" && decoded.from !== "0x0000000000000000000000000000000000000000");

    const jsonBlob = new Blob([JSON.stringify(filteredData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(jsonBlob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "PlanA-40POL-NFT-Transactions.json";
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center justify-center w-full p-6 pb-20 font-sans">
      <main className="flex flex-col items-center justify-center gap-8 w-full m-2">
      <div className="text-center">
          <p className="text-2xl font-bold mb-6">Blockchain Data</p>
          <WalletConnect />
        </div>        
        {loading ? (
          <p>Loading transactions...</p>
        ) : (
          <table className="table-auto border-collapse border border-gray-500 w-full mx-4">
            <thead>
              <tr>
                <th className="border border-gray-500 p-2">Transaction Hash</th>
                <th className="border border-gray-500 p-2">From</th>
                {/* <th className="border border-gray-500 p-2">To</th> */}
                <th className="border border-gray-500 p-2 w-[30px]">Token ID</th>
                <th className="border border-gray-500 p-2">Block Number</th>
                <th className="border border-gray-500 p-2">Block Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data
                .map((tx) => ({
                  ...decodeTransferEvent(tx.topics),
                  block_number: tx.block_number,
                  block_timestamp: tx.block_timestamp,
                }))
                .filter((decoded) => decoded.from !== "N/A" && decoded.from !== "0x0000000000000000000000000000000000000000")
                .map((decoded, index) => (
                  <tr key={index}>
                    <td className="border border-gray-500 p-2">
                      <a
                        href={`https://polygonscan.com/tx/${data[index].transaction_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {data[index].transaction_hash.slice(0, 10)}...
                      </a>
                    </td>
                    <td className="flex border border-gray-500 p-2">{decoded.from}</td>
                    {/* <td className="border border-gray-500 p-2">{decoded.to}</td> */}
                    <td className="border border-gray-500 p-2 w-[30px]">{decoded.tokenId.slice(0, 10)}...</td>
                    <td className="border border-gray-500 p-2">{decoded.block_number}</td>
                    <td className="border border-gray-500 p-2">
                      {new Date(decoded.block_timestamp * 1000).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
          <div className="text-center">
            {!loading && (
              <button
                onClick={handleDownload}
                className="justify-right items-right mt-2 border border-gray-400 hover:border-gray-200 bg-blue-900 text-white font-bold text-[20px] px-2 py-2 rounded hover:bg-red-900"
              >
                Download JSON
              </button>
            )}
          </div>
      </main>
    </div>
  );
}