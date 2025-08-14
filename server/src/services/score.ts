import { Creator } from '../models/creator';
import { CreatorScore } from '../models/creatorScore';
import { CreatorMetrics } from './neynar';

/**
 * Score Calculator Service
 * Handles calculation of creator scores based on metrics
 */
export class ScoreCalculator {
  // Weights for different score components
  private weights = {
    engagement: 0.35,
    consistency: 0.20,
    growth: 0.20,
    quality: 0.15,
    network: 0.10,
  };

  /**
   * Calculate a creator's score based on metrics
   * @param metrics Creator metrics from Neynar
   * @returns Complete creator score
   */
  async calculateScore(metrics: CreatorMetrics): Promise<any> {
    // Calculate component scores
    const components = {
      engagement: this.normalizeEngagement(metrics.engagementRate),
      consistency: this.normalizeConsistency(metrics.postingFrequency),
      growth: this.normalizeGrowth(metrics.growthRate, metrics.followerCount),
      quality: this.normalizeQuality(metrics.viralCoefficient, metrics.neynarScore),
      network: Math.min(100, metrics.networkScore),
    };

    // Apply diminishing returns to prevent gaming
    const adjusted = this.applyDiminishingReturns(components, metrics);

    // Calculate weighted score
    const rawScore = Object.entries(adjusted).reduce(
      (sum, [key, value]) => sum + value * this.weights[key as keyof typeof this.weights],
      0
    );

    // Get percentile rank for normalization
    const percentileRank = await this.getPercentileRank(rawScore);
    
    // Apply distribution cap (only 20% can score > 80)
    const finalScore = this.enforceDistribution(rawScore, percentileRank);

    // Determine tier based on score
    const tier = this.calculateTier(finalScore);

    return {
      fid: metrics.fid,
      overallScore: Math.round(finalScore),
      percentileRank,
      tier,
      components: adjusted,
      timestamp: new Date(),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  }

  /**
   * Normalize engagement rate on a 0-100 scale
   * @param rate Raw engagement rate
   * @returns Normalized score (0-100)
   */
  private normalizeEngagement(rate: number): number {
    // Logarithmic scaling for engagement
    const normalized = Math.log10(Math.max(1, rate)) * 25;
    return Math.min(100, normalized);
  }

  /**
   * Normalize posting consistency on a 0-100 scale
   * @param frequency Posts per day
   * @returns Normalized score (0-100)
   */
  private normalizeConsistency(frequency: number): number {
    // Optimal frequency is 1-3 posts per day
    const optimal = 2;
    const deviation = Math.abs(frequency - optimal);
    const score = Math.max(0, 100 - deviation * 20);
    return Math.min(100, score);
  }

  /**
   * Normalize growth rate with follower boost
   * @param growthRate Growth rate percentage
   * @param followers Number of followers
   * @returns Normalized score (0-100)
   */
  private normalizeGrowth(growthRate: number, followers: number): number {
    // Higher base score for established creators
    const baseScore = Math.min(50, Math.log10(Math.max(1, followers)) * 10);
    const growthBonus = Math.min(50, growthRate * 100);
    return baseScore + growthBonus;
  }

  /**
   * Normalize quality based on viral coefficient and Neynar score
   * @param viralCoefficient Percentage of viral posts
   * @param neynarScore Neynar's quality score
   * @returns Normalized score (0-100)
   */
  private normalizeQuality(viralCoefficient: number, neynarScore: number): number {
    const viralScore = Math.min(50, viralCoefficient);
    const qualityScore = Math.min(50, neynarScore * 50);
    return viralScore + qualityScore;
  }

  /**
   * Apply diminishing returns to prevent gaming the system
   * @param components Raw component scores
   * @param metrics Original metrics
   * @returns Adjusted component scores
   */
  private applyDiminishingReturns(
    components: any,
    metrics: CreatorMetrics
  ): any {
    const adjusted = { ...components };

    // Penalize excessive posting
    if (metrics.postingFrequency > 10) {
      adjusted.consistency *= 0.7;
    }

    // Penalize low engagement relative to posting
    const engagementRatio = metrics.engagementRate / Math.max(1, metrics.postingFrequency);
    if (engagementRatio < 0.5) {
      adjusted.quality *= 0.8;
    }

    return adjusted;
  }

  /**
   * Calculate percentile rank compared to other creators
   * @param score Raw score
   * @returns Percentile (0-100)
   */
  private async getPercentileRank(score: number): Promise<number> {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count scores below this one
    const belowCount = await CreatorScore.countDocuments({
      scoreDate: { $gte: today },
      overallScore: { $lt: score }
    });
    
    // Count total scores
    const totalCount = await CreatorScore.countDocuments({
      scoreDate: { $gte: today }
    });
    
    // Calculate percentile
    return Math.round((belowCount / Math.max(totalCount, 1)) * 100);
  }

  /**
   * Apply distribution cap to ensure proper score distribution
   * @param score Raw score
   * @param percentile Percentile rank
   * @returns Adjusted score
   */
  private enforceDistribution(score: number, percentile: number): number {
    // Only top 20% can score above 80
    if (percentile < 80) {
      return Math.min(score, 79);
    }

    // Logarithmic compression for top scorers
    if (score > 80) {
      const excess = score - 80;
      const compressed = Math.log(1 + excess) * 10;
      return Math.min(100, 80 + compressed);
    }

    return score;
  }

  /**
   * Calculate tier level based on score
   * @param score Final score
   * @returns Tier level (1-6)
   */
  private calculateTier(score: number): number {
    if (score >= 90) return 6; // Diamond
    if (score >= 80) return 5; // Platinum
    if (score >= 70) return 4; // Gold
    if (score >= 60) return 3; // Silver
    if (score >= 40) return 2; // Bronze
    return 1; // Starter
  }
}

// Export singleton instance
export const scoreCalculator = new ScoreCalculator();
