"use client";

import { type ReactNode } from "react";
import { MiniAppProvider } from "@neynar/react";
import { base } from "viem/chains";
import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { WagmiProvider as PrivyWagmiProvider } from "@privy-io/wagmi";
import { wagmiConfig, privyWagmiConfig } from "../lib/wagmiConfig";

// Create a client for React Query
const queryClient = new QueryClient();

export function Providers(props: { children: ReactNode }) {
  // Keeping Privy provider in the code, but using it as a fallback
  // The active provider is now MiniAppProvider for Farcaster integration
  const useFarcaster = true; // Toggle this to switch between providers
  
  if (useFarcaster) {
    return (
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <MiniAppProvider analyticsEnabled={true}>
            {props.children}
          </MiniAppProvider>
        </WagmiProvider>
      </QueryClientProvider>
    );
  } else {
    // Original Privy implementation (kept for reference but not used)
    return (
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || ""}
        config={{
          embeddedWallets: {
            ethereum: {
              createOnLogin: 'users-without-wallets'
            },
          },
          appearance: {
            walletList: ["detected_wallets"],
          },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <PrivyWagmiProvider config={privyWagmiConfig}>
            {props.children}
          </PrivyWagmiProvider>
        </QueryClientProvider>
      </PrivyProvider>
    );
  }
}
