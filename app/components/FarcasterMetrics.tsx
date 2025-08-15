"use client";

import { useState } from 'react';
import { useMiniApp } from "@neynar/react";
import { UserMetricsDisplay } from './UserMetricsDisplay';

export function FarcasterMetrics() {
  const { isSDKLoaded, context } = useMiniApp();
  const [showMockData, setShowMockData] = useState(false);
  
  // Mock data as a fallback
  const mockMetrics = {
    fid: "1",
    metrics: {
      followers: 1024,
      following: 512,
      casts: 256,
      reactions: 2048,
      replies: 128,
      recasts: 64,
      engagement_rate: 0.045,
      last_updated: new Date().toISOString(),
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-[var(--app-background)] shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-[var(--app-foreground)]">
        Farcaster Metrics
      </h2>
      
      {isSDKLoaded && context ? (
        // Live user metrics from Farcaster connection
        <UserMetricsDisplay className="mb-4" />
      ) : (
        // Mock data or connection prompt
        <div>
          {showMockData ? (
            // Show mock data
            <div className="grid grid-cols-2 gap-3 mb-4">
              <MetricCard label="Followers" value={mockMetrics.metrics.followers} />
              <MetricCard label="Following" value={mockMetrics.metrics.following} />
              <MetricCard label="Casts" value={mockMetrics.metrics.casts} />
              <MetricCard label="Reactions" value={mockMetrics.metrics.reactions} />
              <MetricCard label="Replies" value={mockMetrics.metrics.replies} />
              <MetricCard label="Recasts" value={mockMetrics.metrics.recasts} />
              <MetricCard 
                label="Engagement" 
                value={`${(mockMetrics.metrics.engagement_rate * 100).toFixed(2)}%`} 
              />
              <MetricCard 
                label="Last Updated" 
                value={new Date(mockMetrics.metrics.last_updated).toLocaleString()} 
              />
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg mb-4">
              <p className="mb-4 text-[var(--app-foreground-muted)]">
                Connect your Farcaster account to view your metrics
              </p>
              <button 
                onClick={() => setShowMockData(true)}
                className="px-4 py-2 rounded-md font-medium bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Show Sample Data
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="text-sm text-[var(--app-foreground-muted)] p-3 bg-[var(--app-gray-dark)] rounded-lg">
        <p>
          <strong>How it works:</strong> This dashboard connects to our backend server that fetches and analyzes your Farcaster data using the Neynar API.
          {!isSDKLoaded && " Connect your Farcaster account to see your actual metrics."}
        </p>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="p-3 border rounded bg-[var(--app-gray)] text-[var(--app-foreground)]">
      <div className="text-sm font-medium text-[var(--app-foreground-muted)]">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
