"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Header } from "~/components/ui/Header";
import { Footer } from "~/components/ui/Footer";
import { HomeTab, ActionsTab, ContextTab } from "~/components/ui/tabs";
import { PrivyWalletTab } from "~/components/ui/tabs/PrivyWalletTab";
import { USE_WALLET } from "~/lib/constants";

// --- Types ---
export enum Tab {
  Home = "home",
  Actions = "actions",
  Context = "context",
  Wallet = "wallet",
}

export interface AppProps {
  title?: string;
}

/**
 * App component serves as the main container for the mini app interface.
 * 
 * This component orchestrates the overall mini app experience by:
 * - Managing tab navigation and state
 * - Handling Privy authentication and wallet integration
 * - Coordinating wallet and context state
 * - Providing error handling and loading states
 * - Rendering the appropriate tab content based on user selection
 * 
 * The component integrates with the Privy SDK for authentication and wallet functionality
 * and provides a complete mini app experience with multiple tabs for different functionality areas.
 * 
 * Features:
 * - Tab-based navigation (Home, Actions, Context, Wallet)
 * - Privy authentication and wallet integration
 * - Wallet connection management
 * - Error handling and display
 * - Loading states for async operations
 * 
 * @param props - Component props
 * @param props.title - Optional title for the mini app (defaults to "Privy App")
 * 
 * @example
 * ```tsx
 * <App title="My Mini App" />
 * ```
 */
export default function App(
  { title }: AppProps = { title: "Privy App" }
) {
  // --- Hooks ---
  const { ready, authenticated, user } = usePrivy();
  
  // --- State ---
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.Home);
  
  // --- Early Returns ---
  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="spinner h-8 w-8 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // --- Render ---
  return (
    <div>
      {/* Header should be full width */}
      <Header user={user} />

      {/* Main content and footer should be centered */}
      <div className="container py-2 pb-20">
        {/* Main title */}
        <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>

        {/* Tab content rendering */}
        {currentTab === Tab.Home && <HomeTab />}
        {currentTab === Tab.Actions && <ActionsTab />}
        {currentTab === Tab.Context && <ContextTab />}
        {currentTab === Tab.Wallet && <PrivyWalletTab />}

        {/* Footer with navigation */}
        <Footer 
          activeTab={currentTab} 
          setActiveTab={(tab) => setCurrentTab(tab as Tab)} 
          showWallet={USE_WALLET} 
        />
      </div>
    </div>
  );
}

