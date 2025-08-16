"use client";

import { type ReactNode } from "react";
import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider as PrivyWagmiProvider } from "@privy-io/wagmi";
import { privyWagmiConfig } from "../lib/wagmiConfig";

// Create a client for React Query
const queryClient = new QueryClient();

export function Providers(props: { children: ReactNode }) {
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
