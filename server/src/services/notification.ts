import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { env } from '../config/env';
import { Creator } from '../models/creator';
import { CreatorScore } from '../models/creatorScore';

/**
 * Interface for notification payload
 */
interface NotificationPayload {
  title: string;
  body: string;
  actionUrl?: string;
}

/**
 * Notification Service
 * Handles sending notifications to users via Neynar
 */
export class NotificationService {
  private client: NeynarAPIClient;

  constructor() {
    this.client = new NeynarAPIClient(env.NEYNAR_API_KEY);
  }

  /**
   * Send score update notification
   * @param fid Creator FID
   * @param score Creator score
   */
  async sendScoreUpdateNotification(fid: number, score: any): Promise<void> {
    try {
      // Get user's friends who might be interested
      const friends = await this.getFriendsWithScores(fid);
      
      // Notify friends who this user just beat
      for (const friend of friends) {
        if (friend.score < score.overallScore && friend.score > score.overallScore - 5) {
          await this.sendNotification(friend.fid, {
            title: 'Friend Alert! 🎯',
            body: `@${score.fid} just beat your score with ${score.overallScore}!`,
            actionUrl: `/challenge/${score.fid}`,
          });
        }
      }
    } catch (error) {
      console.error('Failed to send score update notification:', error);
    }
  }

  /**
   * Send challenge notification
   * @param challengerFid Challenger FID
   * @param targetFid Target FID
   */
  async sendChallengeNotification(challengerFid: number, targetFid: number): Promise<void> {
    try {
      // Get usernames for more personalized message
      const challenger = await Creator.findOne({ fid: challengerFid });
      
      await this.sendNotification(targetFid, {
        title: 'You\'ve been challenged! ⚔️',
        body: `@${challenger?.username || challengerFid} challenged you to beat their Creator Score!`,
        actionUrl: `/score/calculate`,
      });
    } catch (error) {
      console.error('Failed to send challenge notification:', error);
    }
  }

  /**
   * Send a notification to a user
   * @param fid Farcaster ID
   * @param notification Notification payload
   */
  private async sendNotification(fid: number, notification: NotificationPayload): Promise<void> {
    try {
      // In a production environment, this would integrate with Neynar's notification API
      // For now, we'll just log the notification
      console.log(`[NOTIFICATION] To FID ${fid}:`, notification);
      
      // TODO: Implement actual notification sending when Neynar supports it
      // This would use their webhook/notification system
    } catch (error) {
      console.error(`Failed to send notification to FID ${fid}:`, error);
    }
  }

  /**
   * Get friends of a user with their scores
   * @param fid Farcaster ID
   * @returns Array of friends with scores
   */
  private async getFriendsWithScores(fid: number): Promise<Array<{fid: number, score: number}>> {
    try {
      // In a production environment with proper follow relationships,
      // we would query a "follows" collection to find friends
      
      // For now, let's simulate by finding users with similar scores
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get user's score
      const userScore = await CreatorScore.findOne({ 
        creatorFid: fid,
        scoreDate: { $gte: today }
      });
      
      if (!userScore) return [];
      
      // Find users with similar scores
      const similarScores = await CreatorScore.find({
        creatorFid: { $ne: fid },
        scoreDate: { $gte: today },
        overallScore: { 
          $gte: userScore.overallScore - 20,
          $lte: userScore.overallScore + 20
        }
      }).limit(10);
      
      return similarScores.map(score => ({
        fid: score.creatorFid,
        score: score.overallScore
      }));
    } catch (error) {
      console.error('Failed to get friends with scores:', error);
      return [];
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
