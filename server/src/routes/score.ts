import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { cacheManager } from '../services/cache';
import { jobProcessor } from '../services/job';
import { loanCalculator } from '../services/loan';
import { CreatorScore } from '../models/creatorScore';
import { Creator } from '../models/creator';

// Create router
const router = new Hono();

// Input schema for score calculation request
const calculateScoreSchema = z.object({
  fid: z.number().int().positive()
});

/**
 * POST /api/score/calculate
 * Calculate a creator's score
 */
router.post('/calculate', zValidator('json', calculateScoreSchema), async (c) => {
  try {
    const { fid } = c.req.valid('json');
    
    // Check cache first
    const cacheKey = `score:${fid}:${new Date().toDateString()}`;
    let score = await cacheManager.get(cacheKey);

    if (!score) {
      // Queue calculation job with priority 10
      const jobId = await jobProcessor.queueScoreCalculation(fid, 10);
      
      // Wait for job to complete (with 10 second timeout)
      const jobPromise = new Promise((resolve, reject) => {
        let timeoutId: NodeJS.Timeout;
        
        // Set timeout to reject after 10 seconds
        timeoutId = setTimeout(() => {
          reject(new Error('Score calculation timed out'));
        }, 10000);
        
        // Poll for job completion
        const interval = setInterval(async () => {
          try {
            // Get score from database
            const calculatedScore = await CreatorScore.findOne({
              creatorFid: fid,
              scoreDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
            }).populate('creatorFid');
            
            if (calculatedScore) {
              clearTimeout(timeoutId);
              clearInterval(interval);
              resolve(calculatedScore);
            }
          } catch (error) {
            clearTimeout(timeoutId);
            clearInterval(interval);
            reject(error);
          }
        }, 500);
      });
      
      try {
        score = await jobPromise;
        
        // Cache the result
        await cacheManager.set(cacheKey, score, cacheManager.TTL.score);
      } catch (error) {
        // Return a 202 Accepted if the job is still processing
        return c.json({
          success: true,
          processing: true,
          message: 'Score calculation is in progress. Please try again in a few seconds.',
          jobId
        }, 202);
      }
    }

    // Calculate loan terms
    const loanTerms = loanCalculator.calculateTerms(score);

    return c.json({
      success: true,
      data: {
        score,
        loanTerms,
        shareUrl: `/share/${score.shareableId}`,
      },
    });
  } catch (error) {
    console.error('Score calculation error:', error);
    return c.json({ success: false, error: 'Failed to calculate score' }, 500);
  }
});

/**
 * GET /api/score/:fid
 * Get a specific creator's score
 */
router.get('/:fid', async (c) => {
  try {
    const fid = parseInt(c.req.param('fid'));
    
    if (isNaN(fid)) {
      return c.json({ success: false, error: 'Invalid FID' }, 400);
    }
    
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find score in database
    const score = await CreatorScore.findOne({
      creatorFid: fid,
      scoreDate: { $gte: today }
    });
    
    if (!score) {
      return c.json({ success: false, error: 'Score not found' }, 404);
    }
    
    // Get creator info
    const creator = await Creator.findOne({ fid });
    
    return c.json({
      success: true,
      data: {
        ...score.toObject(),
        username: creator?.username,
        followerCount: creator?.followerCount
      }
    });
  } catch (error) {
    console.error('Score fetch error:', error);
    return c.json({ success: false, error: 'Failed to fetch score' }, 500);
  }
});

/**
 * GET /api/score/share/:id
 * Get a score by its shareable ID
 */
router.get('/share/:id', async (c) => {
  try {
    const shareableId = c.req.param('id');
    
    // Find score by shareable ID
    const score = await CreatorScore.findOne({ shareableId });
    
    if (!score) {
      return c.json({ success: false, error: 'Score not found' }, 404);
    }
    
    // Get creator info
    const creator = await Creator.findOne({ fid: score.creatorFid });
    
    // Calculate loan terms
    const loanTerms = loanCalculator.calculateTerms(score);
    
    return c.json({
      success: true,
      data: {
        score: {
          ...score.toObject(),
          username: creator?.username,
          followerCount: creator?.followerCount
        },
        loanTerms
      }
    });
  } catch (error) {
    console.error('Shared score fetch error:', error);
    return c.json({ success: false, error: 'Failed to fetch shared score' }, 500);
  }
});

export { router as scoreRoutes };
