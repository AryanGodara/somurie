import { Configuration, NeynarAPIClient } from '@neynar/nodejs-sdk';
import { RateLimiter } from '../utils/rateLimiter';
import { env } from '../config/env';

/**
 * Interface for Neynar API user profile response
 */
interface NeynarUserProfile {
  username: string;
  follower_count: number;
  following_count: number;
  power_badge?: boolean;
  fid_score?: number;
}

/**
 * Interface for Cast metrics
 */
export interface CastMetrics {
  hash: string;
  timestamp: Date;
  likes: number;
  recasts: number;
  replies: number;
  // Note: impressions no longer available in Neynar API
  // Engagement will be calculated based on likes, recasts and replies only
}

/**
 * Interface for Creator metrics
 */
export interface CreatorMetrics {
  fid: number;
  username: string;
  followerCount: number;
  followingCount: number;
  powerBadge: boolean;
  neynarScore: number;
  casts: CastMetrics[];
  engagementRate: number;
  postingFrequency: number;
  growthRate: number;
  viralCoefficient: number;
  networkScore: number;
}

/**
 * Neynar Service
 * Handles interactions with Neynar API for Farcaster data
 */
export class NeynarService {
  private client: NeynarAPIClient;
  private rateLimiter: RateLimiter;
  
  // In-memory cache for MVP (no Redis dependency)
  private memoryCache: Map<string, { value: any; expiry: number }> = new Map();

  constructor() {
    // Initialize Neynar client with API key
    const config = new Configuration({ apiKey: env.NEYNAR_API_KEY });
    this.client = new NeynarAPIClient(config);
    // 300 RPM limit for Neynar free tier
    this.rateLimiter = new RateLimiter(300);
  }

  /**
   * Simple in-memory cache methods for MVP
   */
  private getCachedValue<T>(key: string): T | null {
    const item = this.memoryCache.get(key);
    
    if (!item) return null;
    
    // Check if item has expired
    if (item.expiry < Date.now()) {
      this.memoryCache.delete(key);
      return null;
    }
    
    return item.value as T;
  }
  
  private setCachedValue(key: string, value: any, ttlSeconds: number): void {
    this.memoryCache.set(key, {
      value,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
  }
  
  private deleteCachedValue(key: string): void {
    this.memoryCache.delete(key);
  }
  
  /**
   * Delete cached values by pattern (simple implementation for MVP)
   */
  private invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern.replace('*', '.*'));
    
    for (const key of this.memoryCache.keys()) {
      if (regex.test(key)) {
        this.memoryCache.delete(key);
      }
    }
  }
  
  /**
   * Get metrics for a creator
   * @param fid Farcaster ID
   * @param days Number of days to analyze
   * @returns Creator metrics
   */
  async getUserMetrics(fid: number, days: number = 45): Promise<CreatorMetrics> {
    const cacheKey = `metrics:${fid}:${days}`;
    
    // Check cache first
    const cached = this.getCachedValue<CreatorMetrics>(cacheKey);
    if (cached) return cached;

    // Respect rate limits
    await this.rateLimiter.wait();

    // Fetch user profile
    const user = await this.client.fetchBulkUsers({ fids: [fid] });
    const profile = user.users[0];

    // Fetch recent casts with pagination
    const casts = await this.fetchRecentCasts(fid, days);
    
    // Calculate engagement metrics
    const metrics: CreatorMetrics = {
      fid,
      username: profile.username,
      followerCount: profile.follower_count,
      followingCount: profile.following_count,
      powerBadge: profile.power_badge || false,
      neynarScore: profile.score || 0,
      casts: casts,
      engagementRate: this.calculateEngagementRate(casts),
      postingFrequency: casts.length / days,
      growthRate: 0, // Would need historical data
      viralCoefficient: this.calculateViralCoefficient(casts),
      networkScore: this.calculateNetworkScore(profile),
    };

    // Cache the result (30 minutes TTL for MVP)
    this.setCachedValue(cacheKey, metrics, 30 * 60);
    return metrics;
  }

  /**
   * Fetch recent casts for a user
   * @param fid Farcaster ID
   * @param days Number of days to fetch
   * @returns Array of cast metrics
   */
  private async fetchRecentCasts(fid: number, days: number): Promise<CastMetrics[]> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const casts: CastMetrics[] = [];
    let cursor: string | undefined;

    // Fetch up to 500 casts (batches of 100)
    for (let i = 0; i < 5; i++) {
      await this.rateLimiter.wait();
      
      const response = await this.client.fetchCastsForUser({
        fid,
        limit: 100,
        cursor,
      });

      for (const cast of response.casts) {
        const castDate = new Date(cast.timestamp);
        if (castDate < cutoffDate) {
          return casts; // Stop if we've gone past our time window
        }

        casts.push({
          hash: cast.hash,
          timestamp: castDate,
          likes: cast.reactions?.likes_count || 0,
          recasts: cast.reactions?.recasts_count || 0,
          replies: cast.replies?.count || 0,
        });
      }

      cursor = response.next.cursor ?? undefined;
      if (!cursor) break;
    }

    return casts;
  }

  /**
   * Calculate engagement rate based on cast metrics
   * @param casts Array of cast metrics
   * @returns Engagement rate score
   */
  private calculateEngagementRate(casts: CastMetrics[]): number {
    if (casts.length === 0) return 0;
    
    const totalEngagement = casts.reduce((sum, cast) => 
      sum + cast.likes + cast.recasts * 2 + cast.replies * 1.5, 0
    );
    
    return totalEngagement / casts.length;
  }

  /**
   * Calculate viral coefficient based on cast metrics
   * @param casts Array of cast metrics
   * @returns Viral coefficient score
   */
  private calculateViralCoefficient(casts: CastMetrics[]): number {
    const viralCasts = casts.filter(c => c.recasts > 10 || c.likes > 50);
    return (viralCasts.length / Math.max(casts.length, 1)) * 100;
  }

  /**
   * Calculate network score based on user profile
   * @param profile User profile data
   * @returns Network score (0-100)
   */
  private calculateNetworkScore(profile: { follower_count: number; following_count: number; power_badge?: boolean; fid_score?: number }): number {
    const followerRatio = profile.follower_count / Math.max(profile.following_count, 1);
    const powerBadgeBonus = profile.power_badge ? 20 : 0;
    const neynarScoreBonus = (profile.fid_score || 0) * 10;
    
    return Math.min(100, followerRatio * 10 + powerBadgeBonus + neynarScoreBonus);
  }
}

// Export singleton instance
export const neynarService = new NeynarService();
