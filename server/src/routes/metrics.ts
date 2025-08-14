import { Hono } from 'hono';

/**
 * Interface for user metrics response
 */
interface UserMetrics {
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
 * Interface for trending cast
 */
interface TrendingCast {
  hash: string;
  text: string;
  reactions: number;
  recasts: number;
  replies: number;
  timestamp: string;
}

// This will be expanded once we integrate with Farcaster API
export const metricsRoutes = new Hono();

// Get metrics for a specified Farcaster user
metricsRoutes.get('/:fid', async (c) => {
  const fid = c.req.param('fid');
  
  try {
    // TODO: Implement actual Farcaster metrics fetching
    // This is a placeholder response with proper typing
    const metrics: UserMetrics = {
      followers: 1024,
      following: 512,
      casts: 256,
      reactions: 2048,
      replies: 128,
      recasts: 64,
      engagement_rate: 0.045,
      last_updated: new Date().toISOString()
    };
    
    return c.json({
      fid,
      metrics
    });
  } catch (error) {
    console.error('Error fetching Farcaster metrics:', error);
    return c.json({ error: 'Failed to fetch metrics' }, 500);
  }
});

// Get trending casts for a specified Farcaster user
metricsRoutes.get('/:fid/trending', async (c) => {
  const fid = c.req.param('fid');
  
  try {
    // TODO: Implement actual trending casts fetching
    const trendingCast: TrendingCast = {
      hash: '0x123456789abcdef',
      text: 'This is a placeholder trending cast',
      reactions: 42,
      recasts: 21,
      replies: 7,
      timestamp: new Date().toISOString()
    };
    
    return c.json({
      fid,
      trending_casts: [trendingCast]
    });
  } catch (error) {
    console.error('Error fetching trending casts:', error);
    return c.json({ error: 'Failed to fetch trending casts' }, 500);
  }
});
