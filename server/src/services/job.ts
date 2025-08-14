import { Queue, Worker, Job } from 'bullmq';
import { env } from '../config/env';
import { NeynarService, neynarService } from './neynar';
import { ScoreCalculator, scoreCalculator } from './score';
import { Creator } from '../models/creator';
import { CreatorScore } from '../models/creatorScore';
import { NotificationService, notificationService } from './notification';

/**
 * Job Processor Service
 * Handles background jobs using BullMQ with Redis
 */
export class JobProcessor {
  private scoreQueue: Queue;
  
  constructor() {
    // Configure Redis connection for BullMQ
    const connection = {
      host: env.REDIS_HOST,
      port: parseInt(env.REDIS_PORT),
      password: env.REDIS_PASSWORD
    };

    // Create queue for score calculations
    this.scoreQueue = new Queue('score-calculations', {
      connection,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 100, // Keep last 100 failed jobs
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        }
      }
    });

    // Set up worker for processing jobs
    this.setupWorkers(connection);

    // Schedule recurring jobs
    this.scheduleJobs();
    
    console.log('🟢 Job processor initialized');
  }

  /**
   * Set up workers to process jobs
   * @param connection Redis connection config
   */
  private setupWorkers(connection: any): void {
    // Worker for score calculations
    new Worker('score-calculations', async (job: Job) => {
      console.log(`⚙️ Processing job: ${job.id}`, job.data);
      
      try {
        const { fid, days } = job.data;
        
        // Get metrics from Neynar
        const metrics = await neynarService.getUserMetrics(fid, days);
        
        // Calculate score
        const score = await scoreCalculator.calculateScore(metrics);
        
        // Save to database
        await this.saveScore(score);
        
        // Update creator profile
        await this.updateCreatorProfile(metrics);
        
        // Send notifications (only if not a batch job)
        if (job.name === 'calculate-score') {
          await notificationService.sendScoreUpdateNotification(fid, score);
        }
        
        return score;
      } catch (error) {
        console.error(`❌ Job failed: ${job.id}`, error);
        throw error;
      }
    }, { connection });
    
    console.log('👷 Score calculation worker set up');
  }

  /**
   * Schedule recurring jobs
   */
  private scheduleJobs(): void {
    // Daily recalculation at 2 AM
    this.scoreQueue.add(
      'daily-batch',
      { type: 'full-recalculation' },
      {
        repeat: { cron: '0 2 * * *' },
        jobId: 'daily-batch-update'
      }
    );
    
    console.log('🗓️ Scheduled recurring jobs');
  }

  /**
   * Queue a score calculation job
   * @param fid Farcaster ID
   * @param priority Job priority (0-100, higher is more important)
   * @returns Job ID
   */
  async queueScoreCalculation(fid: number, priority: number = 0): Promise<string> {
    const job = await this.scoreQueue.add(
      'calculate-score',
      { fid, days: 45 },
      {
        priority,
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 }
      }
    );
    
    return job.id.toString();
  }

  /**
   * Save a score to the database
   * @param score Score data
   * @returns ID of saved score
   */
  private async saveScore(score: any): Promise<string> {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate valid until date (tomorrow)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find existing score or create new one
    const existingScore = await CreatorScore.findOne({
      creatorFid: score.fid,
      scoreDate: { $gte: today }
    });
    
    if (existingScore) {
      // Update existing score
      existingScore.overallScore = score.overallScore;
      existingScore.percentileRank = score.percentileRank;
      existingScore.tier = score.tier;
      existingScore.components = score.components;
      existingScore.validUntil = score.validUntil;
      await existingScore.save();
      return existingScore._id.toString();
    } else {
      // Create new score
      const newScore = new CreatorScore({
        creatorFid: score.fid,
        overallScore: score.overallScore,
        percentileRank: score.percentileRank,
        tier: score.tier,
        components: score.components,
        scoreDate: today,
        validUntil: tomorrow
      });
      await newScore.save();
      return newScore._id.toString();
    }
  }

  /**
   * Update or create creator profile
   * @param metrics Creator metrics
   */
  private async updateCreatorProfile(metrics: any): Promise<void> {
    await Creator.findOneAndUpdate(
      { fid: metrics.fid },
      {
        username: metrics.username,
        followerCount: metrics.followerCount,
        followingCount: metrics.followingCount,
        powerBadge: metrics.powerBadge,
        neynarScore: metrics.neynarScore
      },
      { upsert: true, new: true }
    );
  }
}

// Export singleton instance
export const jobProcessor = new JobProcessor();
