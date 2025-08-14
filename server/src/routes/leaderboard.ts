import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { cacheManager } from '../services/cache';
import { Creator } from '../models/creator';
import { CreatorScore } from '../models/creatorScore';

// Create router
const router = new Hono();

// Type validation schema
const leaderboardTypeSchema = z.enum(['all', 'weekly', 'friends']);

/**
 * GET /api/leaderboard/:type
 * Get leaderboard by type
 */
router.get('/:type', async (c) => {
  try {
    const type = c.req.param('type');
    const fidParam = c.req.query('fid');
    const fid = fidParam ? parseInt(fidParam) : undefined;
    
    // Validate type
    const result = leaderboardTypeSchema.safeParse(type);
    if (!result.success) {
      return c.json({ 
        success: false, 
        error: 'Invalid leaderboard type. Must be one of: all, weekly, friends' 
      }, 400);
    }

    // If friends type is specified, FID is required
    if (type === 'friends' && !fid) {
      return c.json({ success: false, error: 'FID required for friends leaderboard' }, 400);
    }
    
    // Check cache first
    const cacheKey = `leaderboard:${type}:${fid || 'all'}`;
    let leaderboard = await cacheManager.get(cacheKey);

    if (!leaderboard) {
      // Get fresh data
      leaderboard = await getLeaderboard(type as any, fid);
      
      // Cache the result
      await cacheManager.set(cacheKey, leaderboard, cacheManager.TTL.leaderboard);
    }

    return c.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return c.json({ success: false, error: 'Failed to fetch leaderboard' }, 500);
  }
});

/**
 * Get leaderboard data based on type
 * @param type Leaderboard type
 * @param fid Optional Farcaster ID for friends leaderboard
 * @returns Array of leaderboard entries
 */
async function getLeaderboard(type: 'all' | 'weekly' | 'friends', fid?: number): Promise<any[]> {
  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let query = {};
  let limit = 100;
  
  switch (type) {
    case 'weekly': {
      // Get scores from the last 7 days
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      query = {
        scoreDate: { $gte: oneWeekAgo }
      };
      break;
    }
    
    case 'friends': {
      if (!fid) throw new Error('FID required for friends leaderboard');
      
      // In a production environment with proper follow relationships,
      // we would query a "follows" collection
      
      // For now, we'll simulate by getting similar-scoring creators
      const userScore = await CreatorScore.findOne({
        creatorFid: fid,
        scoreDate: { $gte: today }
      });
      
      if (!userScore) {
        return [];
      }
      
      query = {
        creatorFid: { $ne: fid },
        scoreDate: { $gte: today },
        overallScore: { 
          $gte: Math.max(0, userScore.overallScore - 20),
          $lte: Math.min(100, userScore.overallScore + 20)
        }
      };
      
      limit = 50;
      break;
    }
    
    default: {
      // Get today's scores
      query = {
        scoreDate: { $gte: today }
      };
    }
  }
  
  // Get scores from database
  const scores = await CreatorScore.find(query)
    .sort({ overallScore: -1 })
    .limit(limit);
  
  // Get creator info for these scores
  const creatorFids = scores.map(score => score.creatorFid);
  const creators = await Creator.find({ fid: { $in: creatorFids } });
  
  // Map creator info to scores
  return scores.map(score => {
    const creator = creators.find(c => c.fid === score.creatorFid);
    return {
      fid: score.creatorFid,
      username: creator?.username || `user_${score.creatorFid}`,
      overallScore: score.overallScore,
      tier: score.tier,
      percentileRank: score.percentileRank,
      followerCount: creator?.followerCount || 0,
      powerBadge: creator?.powerBadge || false
    };
  });
}

export { router as leaderboardRoutes };
