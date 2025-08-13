"use client";

import { useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";

/**
 * A modular component for sending blockchain transactions
 * using wagmi hooks with Privy's wallet
 */
export function SendTransaction() {
  const [to, setTo] = useState<string>("");
  const [amount, setAmount] = useState<string>("0.0001");
  const [error, setError] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const { address } = useAccount();
  const { sendTransactionAsync, isPending } = useSendTransaction();

  const handleSendTransaction = async () => {
    if (!address) {
      setError("Please connect your wallet first");
      return;
    }

    if (!to || !/^0x[a-fA-F0-9]{40}$/.test(to)) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    try {
      setError("");
      const hash = await sendTransactionAsync({
        to,
        value: parseEther(amount)
      });
      
      setTxHash(hash);
      setIsSuccess(true);
    } catch (err) {
      setError(`Transaction failed: ${err instanceof Error ? err.message : String(err)}`);
      setIsSuccess(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-[var(--app-background)] shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-[var(--app-foreground)]">Send Transaction</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium text-[var(--app-foreground)]">
          Recipient Address
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="0x..."
            className="w-full p-2 mt-1 bg-[var(--app-gray)] text-[var(--app-foreground)] rounded"
            suppressHydrationWarning
          />
        </label>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium text-[var(--app-foreground)]">
          Amount (ETH)
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 mt-1 bg-[var(--app-gray)] text-[var(--app-foreground)] rounded"
            suppressHydrationWarning
          />
        </label>
      </div>
      
      <button
        onClick={handleSendTransaction}
        disabled={isPending || !address}
        className={`px-4 py-2 rounded-md font-medium ${
          isPending || !address
            ? "bg-[var(--app-gray)] text-[var(--app-foreground-muted)] cursor-not-allowed"
            : "bg-[#0052FF] hover:bg-[#0039B3] text-white"
        }`}
      >
        {isPending ? "Sending..." : "Send Transaction"}
      </button>
      
      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      
      {isSuccess && (
        <div className="mt-4">
          <div className="font-medium text-[var(--app-foreground)]">Transaction Hash:</div>
          <div className="p-2 bg-[var(--app-gray)] rounded text-xs break-all text-[var(--app-foreground)]">
            {txHash}
          </div>
        </div>
      )}
    </div>
  );
}
