"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import WalletConnect from "@/components/WalletConnect";
import Erc1155Transactions from "@/components/Erc1155Transactions";

export default function Home() {  
  return (
    <div className="w-full m-4 p-6 pb-20 font-sans">
      <main className="min-h-screen p-6 bg-blue-900">
      <h1 className="text-2xl font-bold mb-4">Polygon ERC-1155 Transactions</h1>
      <Erc1155Transactions />
    </main>
    </div>
  );
}
