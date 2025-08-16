"use client";

import { MiniAppProvider, useMiniApp } from '@neynar/react';
import { ClientOnlyWallet } from "./components/ClientOnlyWallet";
import Link from 'next/link';
import { FarcasterProfile } from './components/FarcasterProfile';
import { FarcasterUserInfo } from './components/FarcasterUserInfo';

// Component to display app name/logo
function AppHeader() {
  return (
    <div className="text-xl font-bold">NoicE</div>
  );
}

// Main app component
export default function App() {
  return (
    <MiniAppProvider analyticsEnabled={true}>
      <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
        {/* Fixed header with wallet button */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex justify-between items-center max-w-md mx-auto">
            <div className="flex items-center space-x-2">
              <FarcasterProfile />
              <AppHeader />
            </div>
            <ClientOnlyWallet />
          </div>
        </header>

        <main className="flex-1 px-4 py-4 max-w-md mx-auto w-full">
          {/* Main CTA */}
          <div className="mt-6 mb-8">
            <Link href="/creator-score" className="block w-full border-2 border-black p-4 text-center text-lg font-bold bg-white hover:bg-gray-100 transition-colors rounded-md">
              CALCULATE YOUR CREATOR SCORE!
            </Link>
          </div>
          
          {/* Farcaster User Info - Hidden on mobile by default, can be toggled */}
          <div className="mt-6 mb-4">
            <details className="bg-white border border-gray-200 rounded-md">
              <summary className="p-3 font-medium cursor-pointer">Show Farcaster Details</summary>
              <div className="p-3 pt-0">
                <FarcasterUserInfo />
              </div>
            </details>
          </div>
        </main>

        <footer className="mt-auto py-4 flex justify-center w-full border-t border-gray-100">
          <div className="text-[var(--app-foreground-muted)] text-xs">
            Somurie ~Aryan
          </div>
        </footer>
      </div>
    </MiniAppProvider>
  );
}
