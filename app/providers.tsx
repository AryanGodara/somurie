"use client";

import { type ReactNode } from "react";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { base } from "viem/chains";
import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "@privy-io/wagmi";
import { wagmiConfig } from "../lib/wagmiConfig";
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { SignInButton } from '@farcaster/auth-kit';


// Create a client for React Query
const queryClient = new QueryClient();

const config = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'https://9cb3d68d-e052-484b-b158-28263539c3db-00-37kvekkc2zd0z.spock.replit.dev/',
  siweUri: 'https://9cb3d68d-e052-484b-b158-28263539c3db-00-37kvekkc2zd0z.spock.replit.dev/',
};

export function Providers(props: { children: ReactNode }) {
  
  return (
    <AuthKitProvider config={config}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || ""}
        config={{
        // Create embedded wallets for users who don't have a wallet
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
        <>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <MiniKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={base}
            config={{
              appearance: {
                mode: "auto",
                theme: "mini-app-theme",
                name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
                logo: process.env.NEXT_PUBLIC_ICON_URL,
              },
            }}
          >
            {props.children}
          </MiniKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </>
      </PrivyProvider>
    </AuthKitProvider>
  );
}
