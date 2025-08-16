"use client";

import { useState } from "react";
import { Button } from "./components/BasicComponents";
import { ClientOnlyWallet } from "./components/ClientOnlyWallet";

// Simple app with just Privy wallet integration
export default function App() {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Simple Wallet App</h1>
        </header>

        {/* Wallet section - Simple UI */}
        <div className="mb-4 p-4 bg-[var(--app-card-bg)] border-2 border-[#0052FF] rounded-xl shadow-md">
          <h2 className="text-lg font-bold mb-2">Wallet Connection</h2>
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-[var(--app-foreground-muted)] mb-3">Connect your wallet to interact with the application</p>
              {/* Privy Wallet Button */}
              <div className="w-full mb-4">
                <ClientOnlyWallet />
              </div>
              {showDebug && <div className="text-xs text-gray-500 mt-2">Wallet button debug: visible={true}</div>}
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="p-4 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-xl shadow-md">
            <h1 className="text-xl font-bold mb-2">Minimal Wallet App</h1>
            <p className="text-[var(--app-foreground-muted)] mb-4">Simple frontend with Privy wallet integration.</p>
          </div>
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--app-foreground-muted)] text-xs"
          >
            Built with Privy SDK
          </Button>
        </footer>
      </div>
    </div>
  );
}
