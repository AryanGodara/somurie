import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { notificationService } from '../services/notification';
import { Creator } from '../models/creator';

// Create router
const router = new Hono();

// Challenge schema validation
const challengeSchema = z.object({
  challengerFid: z.number().int().positive(),
  targetFid: z.number().int().positive()
});

/**
 * POST /api/challenge
 * Send a challenge to another creator
 */
router.post('/', zValidator('json', challengeSchema), async (c) => {
  try {
    const { challengerFid, targetFid } = c.req.valid('json');
    
    // Prevent self-challenges
    if (challengerFid === targetFid) {
      return c.json({
        success: false,
        error: 'You cannot challenge yourself'
      }, 400);
    }
    
    // Verify both users exist
    const [challenger, target] = await Promise.all([
      Creator.findOne({ fid: challengerFid }),
      Creator.findOne({ fid: targetFid })
    ]);
    
    if (!challenger) {
      return c.json({
        success: false,
        error: 'Challenger not found'
      }, 404);
    }
    
    if (!target) {
      return c.json({
        success: false,
        error: 'Target user not found'
      }, 404);
    }
    
    // Send notification
    await notificationService.sendChallengeNotification(challengerFid, targetFid);
    
    return c.json({
      success: true,
      message: 'Challenge sent!',
      data: {
        challenger: {
          fid: challenger.fid,
          username: challenger.username
        },
        target: {
          fid: target.fid,
          username: target.username
        }
      }
    });
  } catch (error) {
    console.error('Challenge error:', error);
    return c.json({ success: false, error: 'Failed to send challenge' }, 500);
  }
});

/**
 * GET /api/challenge/history/:fid
 * Get challenge history for a creator
 * This is a placeholder - in a full implementation, we would store challenges in a collection
 */
router.get('/history/:fid', async (c) => {
  try {
    const fid = parseInt(c.req.param('fid'));
    
    if (isNaN(fid)) {
      return c.json({ success: false, error: 'Invalid FID' }, 400);
    }
    
    // In a full implementation, we would query a challenges collection
    // For now, return an empty array
    return c.json({
      success: true,
      data: {
        sent: [],
        received: []
      }
    });
  } catch (error) {
    console.error('Challenge history error:', error);
    return c.json({ success: false, error: 'Failed to fetch challenge history' }, 500);
  }
});

export { router as challengeRoutes };
