"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

/**
 * A client-only component that renders a simple Privy login/logout button
 * Using Privy's hooks for authentication
 */
export function ClientOnlyWallet() {
  const [mounted, setMounted] = useState(false);
  const { ready, authenticated, login, logout, user } = usePrivy();

  // Only show the wallet after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !ready) {
    return <div className="h-[36px] w-[120px]"></div>; // Placeholder with similar dimensions
  }

  if (!authenticated) {
    return (
      <button 
        onClick={login}
        className="flex items-center justify-center bg-[#0052FF] hover:bg-[#0039B3] text-white text-xs px-3 py-1.5 rounded-md transition-colors font-medium"
      >
        Connect
      </button>
    );
  }

  return (
    <button 
      onClick={logout}
      className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors font-medium"
    >
      <span className="text-xs">
        {user?.wallet?.address 
          ? `${user.wallet.address.substring(0, 4)}...${user.wallet.address.substring(user.wallet.address.length - 4)}` 
          : user?.email?.address || "Logout"}
      </span>
    </button>
  );
}
