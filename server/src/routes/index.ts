import { Hono } from 'hono';
import { scoreRoutes } from './score';
import { leaderboardRoutes } from './leaderboard';
import { challengeRoutes } from './challenge';
import { waitlistRoutes } from './waitlist';
import { webhookRoutes } from './webhooks';
import { metricsRoutes } from './metrics';

// Create API router
const apiRouter = new Hono();

// Mount routes
apiRouter.route('/score', scoreRoutes);
apiRouter.route('/leaderboard', leaderboardRoutes);
apiRouter.route('/challenge', challengeRoutes);
apiRouter.route('/waitlist', waitlistRoutes);
apiRouter.route('/webhooks', webhookRoutes);
apiRouter.route('/metrics', metricsRoutes); // Keep existing metrics routes

// Health check endpoint
apiRouter.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

export { apiRouter };
