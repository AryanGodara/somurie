"use client";

import { useMiniApp } from "@neynar/react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "./components/DemoComponents";
import { Home } from "./components/DemoComponents";
import { Features } from "./components/DemoComponents";
import { ClientOnlyWallet_Privy } from "./components/ClientOnlyWallet_Privy";
import { ClientOnlySaveFrame } from "./components/ClientOnlySaveFrame";
// Blockchain features moved to separate page

export default function App() {
  const { isSDKLoaded, context } = useMiniApp();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // SDK is initialized automatically by MiniAppProvider

  // This would be handled by Neynar's components or SDK

  // Moved saveFrameButton to ClientOnlySaveFrame component

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-3 h-11">
          <div>
            {isSDKLoaded ? (
              <div className="text-sm font-medium">
                {context!.user?.username}<br/>
                {context!.user?.displayName}<br/>
                {context!.user?.fid}<br/>
                Connected to Farcaster
              </div>
            ) : (
              <ClientOnlyWallet_Privy />
            )}
          </div>
          <ClientOnlySaveFrame />
        </header>

        <main className="flex-1">
          {activeTab === "home" && <Home setActiveTab={setActiveTab} />}
          {activeTab === "features" && <Features setActiveTab={setActiveTab} />}
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => {
              if (isSDKLoaded) {
                // Use window.open as a fallback since we don't have direct sdk access
                window.open("https://base.org/builders/minikit", "_blank");
              }
            }}
          >
            Built with Farcaster Mini App SDK
          </Button>
        </footer>
        </div>
      </div>
  );
}
