"use client";

import { useState } from "react";
import { useMiniApp } from '@neynar/react';
import { sdk } from '@farcaster/miniapp-sdk';

export function FarcasterUserInfo() {
  const { isSDKLoaded, context } = useMiniApp();
  const user = context?.user;
  const [isLoading, setIsLoading] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);

  // Function to refresh user info
  const refreshUser = async () => {
    setIsLoading(true);
    try {
      await sdk.actions.ready();
      // The SDK will automatically update the context
      // We just need to trigger the ready action
    } catch (err) {
      console.error("Error refreshing user info:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to connect to Farcaster
  const connectToFarcaster = async () => {
    if (!isSDKLoaded) return;
    
    setConnectLoading(true);
    try {
      // Request connection using SDK
      await sdk.actions.ready();
    } catch (err) {
      console.error("Error connecting to Farcaster:", err);
    } finally {
      setConnectLoading(false);
    }
  };

  if (!isSDKLoaded) {
    return <div className="text-sm text-gray-500">Initializing Farcaster SDK...</div>;
  }

  return (
    <div className="p-4 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-2">Farcaster User</h2>
      
      {user?.fid ? (
        <div className="space-y-2">
          <p className="font-medium">FID: {user.fid}</p>
          {user.username && (
            <p className="text-sm">Username: @{user.username}</p>
          )}
          {user.displayName && (
            <p className="text-sm">Name: {user.displayName}</p>
          )}
          {user.pfpUrl && (
            <img 
              src={user.pfpUrl} 
              alt="Profile" 
              className="w-10 h-10 rounded-full mt-2"
            />
          )}
          <div className="mt-3">
            <button 
              onClick={() => refreshUser()}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-2">Connect to Farcaster to get your FID</p>
          <div className="flex gap-2">
            <button 
              onClick={connectToFarcaster}
              disabled={connectLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              {connectLoading ? "Connecting..." : "Connect to Farcaster"}
            </button>
            <button 
              onClick={() => refreshUser()}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Get FID"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
