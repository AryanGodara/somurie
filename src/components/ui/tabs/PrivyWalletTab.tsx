"use client";

import { useCallback, useMemo, useState } from "react";
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Button } from "../Button";
import { truncateAddress } from "../../../lib/truncateAddress";
import { USE_WALLET, APP_NAME } from "../../../lib/constants";

// Chain IDs for different networks
const CHAIN_IDS = {
  BASE: "8453", // Base
  OPTIMISM: "10", // Optimism
  MAINNET: "1", // Ethereum Mainnet
  DEGEN: "69420", // Degen
  UNICHAIN: "1337" // Unichain
};

/**
 * PrivyWalletTab component manages wallet-related UI using Privy.
 * 
 * This component provides a comprehensive wallet interface that supports:
 * - Wallet connections through Privy
 * - Message signing
 * - Transaction sending
 * - Chain switching for EVM chains
 * 
 * @example
 * ```tsx
 * <PrivyWalletTab />
 * ```
 */

interface WalletStatusProps {
  address?: string;
  chainId?: number;
}

/**
 * Displays the current wallet address and chain ID.
 */
function WalletStatus({ address, chainId }: WalletStatusProps) {
  return (
    <>
      {address && (
        <div className="text-xs w-full">
          Address: <pre className="inline w-full">{truncateAddress(address)}</pre>
        </div>
      )}
      {chainId && (
        <div className="text-xs w-full">
          Chain ID: <pre className="inline w-full">{chainId}</pre>
        </div>
      )}
    </>
  );
}

export function PrivyWalletTab() {
  // --- State ---
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [isTransactionConfirmed, setIsTransactionConfirmed] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signError, setSignError] = useState<string | null>(null);

  // --- Privy Hooks ---
  const { authenticated, ready, login } = usePrivy();
  const { wallets } = useWallets();

  // Get the active wallet (first connected wallet or undefined)
  const activeWallet = wallets && wallets.length > 0 ? wallets[0] : undefined;
  const connectedAddress = activeWallet?.address;
  const chainId = activeWallet?.chainId;

  // --- Computed Values ---
  /**
   * Determines the next chain to switch to based on the current chain.
   * Cycles through: Base → Optimism → Mainnet → Base
   */
  const nextChain = useMemo(() => {
    if (chainId === CHAIN_IDS.BASE) {
      return { id: CHAIN_IDS.OPTIMISM, name: "Optimism" };
    } else if (chainId === CHAIN_IDS.OPTIMISM) {
      return { id: CHAIN_IDS.MAINNET, name: "Ethereum Mainnet" };
    } else {
      return { id: CHAIN_IDS.BASE, name: "Base" };
    }
  }, [chainId]);

  // --- Handlers ---
  /**
   * Connects a wallet using Privy.
   * This opens the Privy wallet connection modal.
   */
  const handleConnectWallet = useCallback(async () => {
    try {
      // Use the login function from usePrivy to open the wallet connection modal
      login({ provider: "wallet" });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  }, [login]);

  /**
   * Signs a message using the connected wallet.
   */
  const handleSignMessage = useCallback(async () => {
    if (!activeWallet) return;

    try {
      setSignError(null);
      const message = `Hello from ${APP_NAME}!`;
      // Use the correct Privy method to sign a message
      const signature = await activeWallet.sign({ message });
      setSignatureData(signature);
    } catch (error) {
      console.error("Failed to sign message:", error);
      setSignError(String(error));
    }
  }, [activeWallet]);

  /**
   * Sends a transaction to call the yoink() function on the Yoink contract.
   */
  const handleSendTransaction = useCallback(async () => {
    if (!activeWallet) return;

    try {
      setIsTransactionPending(true);
      setTransactionError(null);
      setIsTransactionConfirmed(false);
      setTransactionHash(null);

      // Example transaction
      const tx = {
        to: "0x4bBFD120d9f352A0BEd7a014bd67913a2007a878",
        data: "0x9846cd9efc000023c0", // call yoink() on Yoink contract
      };
      
      // Use the correct Privy method to send a transaction
      const result = await activeWallet.sendTransaction({
        to: tx.to,
        data: tx.data
      });
      
      setTransactionHash(result.transactionHash || result.hash || "");
      
      // Listen for transaction confirmation (simplified)
      // In a real implementation, you would want proper confirmation handling
      setTimeout(() => {
        setIsTransactionConfirmed(true);
        setIsTransactionPending(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to send transaction:", error);
      setTransactionError(String(error));
      setIsTransactionPending(false);
    }
  }, [activeWallet]);

  /**
   * Handles switching to the next chain in the rotation.
   */
  const handleSwitchChain = useCallback(async () => {
    if (!activeWallet) return;

    try {
      // Use the correct Privy method to switch chains
      await activeWallet.switchChain({ chainId: nextChain.id });
    } catch (error) {
      console.error("Failed to switch chain:", error);
    }
  }, [activeWallet, nextChain.id]);

  // --- Early Return ---
  if (!USE_WALLET) {
    return null;
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="spinner h-8 w-8 mx-auto mb-4"></div>
          <p>Loading wallet...</p>
        </div>
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="space-y-3 px-6 w-full max-w-md mx-auto">
      {/* Wallet Information Display */}
      <WalletStatus address={connectedAddress} chainId={chainId} />

      {/* Connection Controls */}
      {!authenticated || !activeWallet ? (
        <Button onClick={handleConnectWallet} className="w-full">
          Connect Wallet
        </Button>
      ) : (
        <div className="space-y-3">
          {/* Wallet Actions */}
          <Button
            onClick={handleSignMessage}
            className="w-full"
          >
            Sign Message
          </Button>
          
          {signatureData && (
            <div className="text-xs w-full">
              <div className="font-semibold text-gray-500 dark:text-gray-300 mb-1">
                Signature
              </div>
              <div className="whitespace-pre-wrap overflow-auto text-gray-700 dark:text-gray-200">
                {truncateAddress(signatureData, 20, 20)}
              </div>
            </div>
          )}
          
          {signError && (
            <div className="text-xs w-full text-red-500">
              Signing Error: {signError}
            </div>
          )}

          <Button
            onClick={handleSendTransaction}
            disabled={isTransactionPending}
            isLoading={isTransactionPending}
            className="w-full"
          >
            Send Transaction
          </Button>
          
          {transactionError && (
            <div className="text-xs w-full text-red-500">
              Transaction Error: {transactionError}
            </div>
          )}
          
          {transactionHash && (
            <div className="text-xs w-full">
              <div>Hash: {truncateAddress(transactionHash)}</div>
              <div>
                Status:{" "}
                {isTransactionPending
                  ? "Confirming..."
                  : isTransactionConfirmed
                  ? "Confirmed!"
                  : "Pending"}
              </div>
            </div>
          )}

          <Button
            onClick={handleSwitchChain}
            className="w-full"
          >
            Switch to {nextChain.name}
          </Button>
        </div>
      )}
    </div>
  );
}


// Makeration what does makeration even mean?