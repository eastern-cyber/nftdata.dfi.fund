"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Transaction {
  address: string;
  block_hash: string;
  block_number: number;
  block_timestamp: number;
  chain_id:number;
  data: string;
  topics: string[];
    transaction_hash: string;
    transaction_index: number;
    log_index: number;
}

function decodeTransferEvent(topics: string[]) {
  // For Transfer events, we need to properly extract the addresses and token ID
  const eventSignature = topics[0];

  // Helper function to format address from topic
  const extractAddress = (topics: string) => {
    // Remove '0x' prefix and take the last 40 characters (20 bytes) for the address
    const hex = topics.startsWith('0x') ? topics.slice(2) : topics;
    return '0x' + hex.slice(hex.length - 40);
  };
  // Helper function to convert hex to decimal for token ID
  const hexToDecimal = (hex: string) => {
    try {
      hex = hex.startsWith('0x') ? hex.slice(2) : hex;
      return BigInt(`0x${hex}`). toString();
    } catch {
      return hex;
    }
  };

  return {
    eventId: eventSignature,
    from: extractAddress(topics[1]),  // From address
    to: extractAddress(topics[2]),    // to address
    tokenId: hexToDecimal(topics[3])  // Token ID
  };
}

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    
    const response = await fetch(`https://insight.thirdweb.com/v1/events/0x2a61627c3457cCEA35482cAdEC698C7360fFB9F2?chain=137&sort_by=block_timestamp&sort_order=desc&limit=40&clientId=${process.env.NEXT_PUBLIC_CLIENT_ID}`)
    // const response = await fetch(`https://insight.thirdweb.com/v1/events/0x2a61627c3457cCEA35482cAdEC698C7360fFB9F2/?chain=137&sort_by=block_number&sort_order=desc&limit=20&clientId=${process.env.NEXT_PUBLIC_CLIENT_ID}`)
    const responseData = await response.json();
    setData(responseData.data);
    console.log(responseData.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>Blockchain Data</h1>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://polygonscan.com/token/0x2a61627c3457ccea35482cadec698c7360ffb9f2/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/logo-polygon.png"
            alt="Polygon Icon"
            width={34}
            height={30}
          />
          3K NFT Explorer
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://opensea.io/assets/matic/0x2a61627c3457ccea35482cadec698c7360ffb9f2/0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/logo-opensea.svg"
            alt="Opensea Icon"
            width={32}
            height={32}
          />
          Opensea Assets
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/logo-vercel_500x120.png"
            alt="Vercel Icon"
            width={125}
            height={30}
          />
          Vercel Templates
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/next.svg"
            alt="Next Icon"
            width={100}
            height={25}
          />
          Nextjs.org →
        </a>
      </footer>
    </div>
  );
}
