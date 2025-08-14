"use client";

import { FarcasterMetrics, TrendingCastsResponse } from "../../shared/types/metrics";

/**
 * Base API URL that points to our Hono backend
 * Uses environment variable in production, fallbacks to localhost in development
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * API client for interacting with the Farcaster metrics backend
 */
export const farcasterApi = {
  /**
   * Get metrics for a specific Farcaster user by FID
   * @param fid Farcaster ID
   */
  async getMetrics(fid: string): Promise<FarcasterMetrics> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/${fid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch metrics');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching Farcaster metrics:', error);
      throw error;
    }
  },

  /**
   * Get trending casts for a specific Farcaster user by FID
   * @param fid Farcaster ID
   */
  async getTrendingCasts(fid: string): Promise<TrendingCastsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/${fid}/trending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch trending casts');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching trending casts:', error);
      throw error;
    }
  }
};
