"use client";

import Link from "next/link";
import { SignMessage } from "../../lib/blockchain/SignMessage";
import { SendTransaction } from "../../lib/blockchain/SendTransaction";
import { GetBlockNumber } from "../../lib/blockchain/GetBlockNumber";

export default function BlockchainFeatures() {
  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Blockchain Features</h1>
          <Link 
            href="/" 
            className="px-4 py-2 rounded-md border border-[var(--app-border)] text-[var(--app-foreground)] hover:bg-[var(--app-gray)]"
          >
            Back to Home
          </Link>
        </header>
        
        <div className="space-y-8">
          <div className="mb-8">
            <p className="mb-4 text-[var(--app-foreground)]">
              Experiment with these blockchain interactions powered by Privy and wagmi.
            </p>
          </div>

          <SignMessage />
          
          <GetBlockNumber />
          
          <SendTransaction />
        </div>
      </div>
    </div>
  );
}
