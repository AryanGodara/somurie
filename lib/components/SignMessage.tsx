"use client";

import { useState } from "react";
import { useSignMessage } from "wagmi";
import { useAccount } from "wagmi";

/**
 * A simple component that demonstrates signing a message with wagmi
 * This shows how to use Privy's wallet with wagmi hooks
 */
export function SignMessage() {
  const [message] = useState<string>("Hello from Somurie MiniApp!");
  const [signature, setSignature] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  
  const { address } = useAccount();
  const { signMessageAsync, isPending } = useSignMessage();

  const handleSign = async () => {
    if (!address) {
      setError("Please connect your wallet first");
      return;
    }
    
    try {
      setError("");
      const sig = await signMessageAsync({ message });
      setSignature(sig);
      setIsSuccess(true);
    } catch (err) {
      setError(`Failed to sign: ${err instanceof Error ? err.message : String(err)}`);
      setIsSuccess(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-[var(--app-background)] shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-[var(--app-foreground)]">Sign Message Test</h2>
      
      <div className="mb-4">
        <div className="font-medium text-[var(--app-foreground)]">Message:</div>
        <div className="p-2 bg-[var(--app-gray)] rounded mb-2 text-sm text-[var(--app-foreground)]">{message}</div>
      </div>
      
      <button
        onClick={handleSign}
        disabled={isPending || !address}
        className={`px-4 py-2 rounded-md font-medium ${
          isPending || !address
            ? "bg-[var(--app-gray)] text-[var(--app-foreground-muted)] cursor-not-allowed"
            : "bg-[#0052FF] hover:bg-[#0039B3] text-white"
        }`}
      >
        {isPending ? "Signing..." : "Sign Message"}
      </button>
      
      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      
      {isSuccess && (
        <div className="mt-4">
          <div className="font-medium text-[var(--app-foreground)]">Signature:</div>
          <div className="p-2 bg-[var(--app-gray)] rounded text-xs break-all text-[var(--app-foreground)]">
            {signature}
          </div>
        </div>
      )}
    </div>
  );
}
