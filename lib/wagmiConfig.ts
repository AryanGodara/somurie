import { base, mainnet } from 'viem/chains';
import { http, createConfig } from 'wagmi';
import { createConfig as createPrivyConfig } from '@privy-io/wagmi';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';

// Configure wagmi with the chains we want to support and Farcaster Mini App connector
export const wagmiConfig = createConfig({
  chains: [base, mainnet],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
  connectors: [
    farcasterMiniApp()
    // Add other wallet connectors if needed
  ]
});

// Keep the Privy wagmi config as well (unused but preserved)
export const privyWagmiConfig = createPrivyConfig({
  chains: [base, mainnet],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});
