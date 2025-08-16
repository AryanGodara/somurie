"use client";

import { UserMetrics } from '../../lib/hooks/useFarcaster';

interface MetricsDisplayProps {
  metrics: UserMetrics | null;
  score: number;
}

export function MetricsDisplay({ metrics, score }: MetricsDisplayProps) {
  if (!metrics) return null;
  
  return (
    <div className="w-full border border-black p-4 mb-4 rounded-md">
      <div className="mb-4 text-center">
        <h2 className="text-lg font-bold mb-1">Your Creator Score</h2>
        <p className="text-4xl font-bold">{score}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="border border-gray-200 p-2 text-center rounded">
          <p className="text-xs text-gray-500">Followers</p>
          <p className="text-base font-bold">{metrics.followers.toLocaleString()}</p>
        </div>
        <div className="border border-gray-200 p-2 text-center rounded">
          <p className="text-xs text-gray-500">Following</p>
          <p className="text-base font-bold">{metrics.following.toLocaleString()}</p>
        </div>
        <div className="border border-gray-200 p-2 text-center rounded">
          <p className="text-xs text-gray-500">Casts</p>
          <p className="text-base font-bold">{metrics.casts.toLocaleString()}</p>
        </div>
        <div className="border border-gray-200 p-2 text-center rounded">
          <p className="text-xs text-gray-500">Reactions</p>
          <p className="text-base font-bold">{metrics.reactions.toLocaleString()}</p>
        </div>
        <div className="border border-gray-200 p-2 text-center rounded">
          <p className="text-xs text-gray-500">Replies</p>
          <p className="text-base font-bold">{metrics.replies.toLocaleString()}</p>
        </div>
        <div className="border border-gray-200 p-2 text-center rounded">
          <p className="text-xs text-gray-500">Recasts</p>
          <p className="text-base font-bold">{metrics.recasts.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="mt-3 border border-gray-200 p-2 text-center rounded">
        <p className="text-xs text-gray-500">Engagement Rate</p>
        <p className="text-base font-bold">{(metrics.engagement_rate * 100).toFixed(2)}%</p>
      </div>
      
      <div className="mt-2 text-[10px] text-gray-400 text-right">
        Last updated: {new Date(metrics.last_updated).toLocaleString()}
      </div>
    </div>
  );
}
