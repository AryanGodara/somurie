import Redis from 'ioredis';
import { env } from '../config/env';

/**
 * TTL (Time to Live) values for different cache keys in seconds
 */
const TTL = {
  score: 300,        // 5 minutes
  leaderboard: 60,   // 1 minute
  userProfile: 1800, // 30 minutes
  metrics: 120,      // 2 minutes
};

/**
 * Cache Manager Service
 * Handles caching data in Redis to reduce API calls and database queries
 */
export class CacheManager {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: env.REDIS_HOST,
      port: parseInt(env.REDIS_PORT),
      password: env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });

    // Log Redis connection events
    this.redis.on('connect', () => {
      console.log('🟢 Redis connected');
    });

    this.redis.on('error', (err) => {
      console.error('❌ Redis error:', err);
    });
  }

  /**
   * Get a value from cache
   * @param key The cache key
   * @returns The cached value or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`❌ Cache get error for key '${key}':`, error);
      return null;
    }
  }

  /**
   * Set a value in cache
   * @param key The cache key
   * @param value The value to cache
   * @param ttl Time to live in seconds (optional)
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await this.redis.setex(key, ttl, serialized);
      } else {
        await this.redis.set(key, serialized);
      }
    } catch (error) {
      console.error(`❌ Cache set error for key '${key}':`, error);
    }
  }

  /**
   * Delete cache keys that match a pattern
   * @param pattern The pattern to match
   */
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error(`❌ Cache invalidation error for pattern '${pattern}':`, error);
    }
  }

  /**
   * Delete a specific cache key
   * @param key The cache key to delete
   */
  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error(`❌ Cache delete error for key '${key}':`, error);
    }
  }

  /**
   * Predefined TTL values
   */
  get TTL(): typeof TTL {
    return TTL;
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();
