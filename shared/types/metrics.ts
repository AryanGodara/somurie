/**
 * Shared types for Farcaster metrics between frontend and backend
 */

export interface FarcasterMetrics {
  fid: string;
  metrics: {
    followers: number;
    following: number;
    casts: number;
    reactions: number;
    replies: number;
    recasts: number;
    engagement_rate: number;
    last_updated: string;
  }
}

export interface TrendingCast {
  hash: string;
  text: string;
  reactions: number;
  recasts: number;
  replies: number;
  timestamp: string;
}

export interface TrendingCastsResponse {
  fid: string;
  trending_casts: TrendingCast[];
}

export interface ErrorResponse {
  error: string;
}
