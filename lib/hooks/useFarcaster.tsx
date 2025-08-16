"use client";

import { useEffect, useState, useCallback } from "react";
import { sdk } from '@farcaster/miniapp-sdk';

/**
 * Public interface for Farcaster user data
 * This is what consumers of the hook will receive
 */
export interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

/**
 * Interface for user metrics from the backend
 */
export interface UserMetrics {
  followers: number;
  following: number;
  casts: number;
  reactions: number;
  replies: number;
  recasts: number;
  engagement_rate: number;
  last_updated: string;
}

/**
 * Custom hook for Farcaster Mini App SDK integration
 * Handles initialization, user data retrieval, and connection state
 */
export function useFarcaster() {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  // Initialize the Farcaster SDK when component mounts
  useEffect(() => {
    const initFarcaster = async () => {
      try {
        // Initialize the SDK with ready action
        await sdk.actions.ready();
        setIsReady(true);
        
        // Try to get user info after SDK is ready
        try {
          // Access user data from window.farcaster object
          // This is the recommended way to access user data according to docs
          const farcasterUser = (window as any).farcaster?.user;
          if (farcasterUser && typeof farcasterUser.fid === 'number') {
            setUser({
              fid: farcasterUser.fid,
              username: farcasterUser.username,
              displayName: farcasterUser.displayName,
              pfpUrl: farcasterUser.pfpUrl
            });
          }
        } catch (userError) {
          // Silent fail - user may not be connected yet
          console.log("User context not available yet", userError);
        }
      } catch (error) {
        console.error("Failed to initialize Farcaster SDK:", error);
        setError("Failed to initialize Farcaster SDK. Make sure you're in a Farcaster client.");
      }
    };

    initFarcaster();

    // Cleanup function
    return () => {
      // Reset state if component unmounts
      setIsReady(false);
      setUser(null);
      setError(null);
    };
  }, []);

  /**
   * Function to get current user context
   * Can be called manually to refresh user data
   * Returns the user object if successful, null otherwise
   */
  const getCurrentUser = useCallback(async () => {
    if (!isReady) return null;
    
    setIsLoading(true);
    try {
      // Primary approach: Get user from window.farcaster object
      const farcasterUser = (window as any).farcaster?.user;
      
      if (farcasterUser && typeof farcasterUser.fid === 'number') {
        const newUser = {
          fid: farcasterUser.fid,
          username: farcasterUser.username,
          displayName: farcasterUser.displayName,
          pfpUrl: farcasterUser.pfpUrl
        };
        setUser(newUser);
        setIsLoading(false);
        return newUser;
      }
      
      // Fallback approach: Try SDK methods that might be available
      try {
        // Attempt different SDK methods that might exist depending on version
        const userInfo = await (sdk as any).fetchUserInfo?.() || 
                         await (sdk as any).getInfo?.() || 
                         await (sdk as any).user?.info?.();
                         
        if (userInfo && typeof userInfo.fid === 'number') {
          const newUser = {
            fid: userInfo.fid,
            username: userInfo.username,
            displayName: userInfo.displayName,
            pfpUrl: userInfo.pfpUrl
          };
          setUser(newUser);
          setIsLoading(false);
          return newUser;
        }
      } catch (innerErr) {
        console.log("Could not fetch user info through SDK", innerErr);
      }
      
      setIsLoading(false);
      return null;
    } catch (err) {
      console.error("Error getting Farcaster user:", err);
      setError("Failed to get Farcaster user data");
      setIsLoading(false);
      return null;
    }
  }, [isReady]);

  /**
   * Function to get user metrics from the backend
   * Uses the user's FID to fetch metrics
   */
  const getUserMetrics = useCallback(async () => {
    if (!user?.fid) {
      setMetricsError("No user FID available");
      return null;
    }

    setMetricsLoading(true);
    setMetricsError(null);

    try {
      // Hardcoded backend URL as requested
      const response = await fetch(`http://localhost:4000/api/metrics/${user.fid}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.status}`);
      }
      
      const data = await response.json();
      setMetrics(data.metrics);
      setMetricsLoading(false);
      return data.metrics;
    } catch (err) {
      console.error("Error fetching user metrics:", err);
      setMetricsError("Failed to fetch user metrics");
      setMetricsLoading(false);
      return null;
    }
  }, [user?.fid]);

  return {
    isReady,        // Boolean indicating if SDK is initialized
    user,           // User object with FID and profile info
    error,          // Error message if any
    isLoading,      // Boolean indicating if data is being fetched
    getCurrentUser, // Function to refresh user data
    metrics,        // User metrics from backend
    metricsLoading, // Boolean indicating if metrics are being fetched
    metricsError,   // Error message for metrics if any
    getUserMetrics  // Function to fetch user metrics
  };
}
