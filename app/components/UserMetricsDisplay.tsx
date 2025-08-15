"use client";

import React, { useEffect, useState } from 'react';
import { useMiniApp } from '@neynar/react';
import { farcasterApi } from '../api/farcasterApi';

interface UserMetricsDisplayProps {
  className?: string;
}

export const UserMetricsDisplay: React.FC<UserMetricsDisplayProps> = ({ className }) => {
  const { isSDKLoaded, context } = useMiniApp();
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!isSDKLoaded || !context) return;

      setIsLoading(true);
      setError(null);

      try {
        const result = await farcasterApi.getCurrentUserMetrics(context);
        setMetrics(result);
      } catch (err) {
        console.error('Failed to fetch metrics:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user metrics');
      } finally {
        setIsLoading(false);
      }
    };

    if (isSDKLoaded && context) {
      fetchMetrics();
    }
  }, [isSDKLoaded, context]);

  if (!isSDKLoaded) {
    return <div className="text-sm text-gray-500">Connect with Farcaster to view metrics</div>;
  }

  if (isLoading) {
    return <div className="text-sm">Loading metrics...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">Error: {error}</div>;
  }

  if (!metrics) {
    return <div className="text-sm text-gray-500">No metrics available</div>;
  }

  return (
    <div className={`rounded-lg border border-gray-200 p-4 ${className}`}>
      <h3 className="text-lg font-medium mb-3">Your Farcaster Metrics</h3>
      
      {metrics.userInfo && (
        <div className="mb-4">
          <p className="font-medium">@{metrics.userInfo.username}</p>
          <div className="flex gap-4 mt-2 text-sm">
            <div>
              <span className="font-medium">{metrics.userInfo.followerCount}</span> followers
            </div>
            <div>
              <span className="font-medium">{metrics.userInfo.followingCount}</span> following
            </div>
          </div>
        </div>
      )}

      {metrics.metrics && (
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="p-2 rounded bg-gray-50">
            <div className="text-xs text-gray-500">Engagement Rate</div>
            <div className="font-medium">{(metrics.metrics.engagementRate || 0).toFixed(2)}</div>
          </div>
          <div className="p-2 rounded bg-gray-50">
            <div className="text-xs text-gray-500">Posting Frequency</div>
            <div className="font-medium">{(metrics.metrics.postingFrequency || 0).toFixed(2)}/day</div>
          </div>
          <div className="p-2 rounded bg-gray-50">
            <div className="text-xs text-gray-500">Growth Rate</div>
            <div className="font-medium">{metrics.metrics.growthRate || 0}%</div>
          </div>
          <div className="p-2 rounded bg-gray-50">
            <div className="text-xs text-gray-500">Network Score</div>
            <div className="font-medium">{metrics.metrics.networkScore || 0}/100</div>
          </div>
        </div>
      )}

      {metrics.casts && metrics.casts.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Recent Cast Metrics</h4>
          <div className="max-h-40 overflow-y-auto">
            {metrics.casts.slice(0, 3).map((cast: any, index: number) => (
              <div key={index} className="text-xs p-2 border-t border-gray-100 flex justify-between">
                <div className="truncate flex-1">{new Date(cast.timestamp).toLocaleDateString()}</div>
                <div className="flex gap-2">
                  <span>❤️ {cast.likes}</span>
                  <span>🔁 {cast.recasts}</span>
                  <span>💬 {cast.replies}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
