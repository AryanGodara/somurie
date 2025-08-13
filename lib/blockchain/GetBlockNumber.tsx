"use client";

import { useState } from "react";
import { useBlockNumber } from "wagmi";

/**
 * A modular component for getting the current block number
 * using wagmi hooks
 */
export function GetBlockNumber() {
  const [error, setError] = useState<string>("");
  
  const { data: blockNumber, isLoading, refetch } = useBlockNumber({
    watch: true,
  });

  const handleRefresh = async () => {
    try {
      setError("");
      await refetch();
    } catch (err) {
      setError(`Failed to get block number: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-[var(--app-background)] shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-[var(--app-foreground)]">Current Block</h2>
      
      <div className="mb-4">
        <div className="font-medium text-[var(--app-foreground)]">Block Number:</div>
        <div className="p-2 bg-[var(--app-gray)] rounded mb-2 text-lg font-mono text-[var(--app-foreground)]">
          {isLoading ? "Loading..." : blockNumber?.toString() || "Not available"}
        </div>
      </div>
      
      <button
        onClick={handleRefresh}
        disabled={isLoading}
        className={`px-4 py-2 rounded-md font-medium ${
          isLoading
            ? "bg-[var(--app-gray)] text-[var(--app-foreground-muted)] cursor-not-allowed"
            : "bg-[#0052FF] hover:bg-[#0039B3] text-white"
        }`}
      >
        {isLoading ? "Loading..." : "Refresh Block Number"}
      </button>
      
      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
