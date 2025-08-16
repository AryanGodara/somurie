"use client";

import { useState } from 'react';
import { useMiniApp } from '@neynar/react';
import Link from 'next/link';
import { MetricsDisplay } from './MetricsDisplay';
import { UserMetrics } from '../../lib/hooks/useFarcaster';

export function CreatorScore() {
  const { isSDKLoaded, context } = useMiniApp();
  const user = context?.user;
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [showScore, setShowScore] = useState(false);
  
  // Calculate a score based on metrics (simplified version)
  const calculateScore = () => {
    if (!metrics) return 0;
    
    // Simple algorithm to calculate score based on engagement
    const followersWeight = 0.3;
    const engagementWeight = 0.7;
    
    const followerScore = Math.min(100, metrics.followers / 10);
    const engagementScore = metrics.engagement_rate * 100;
    
    return Math.round((followerScore * followersWeight) + (engagementScore * engagementWeight));
  };
  
  const fetchUserMetrics = async () => {
    if (!user?.fid) {
      setMetricsError("No user FID available");
      return;
    }

    setMetricsLoading(true);
    setMetricsError(null);

    try {
      // Hardcoded backend URL as requested
      const response = await fetch(`http://localhost:4000/api/metrics/${user.fid}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.status}`);
      }
      
      const data = await response.json();
      setMetrics(data.metrics);
      setMetricsLoading(false);
      setShowScore(true);
    } catch (err) {
      console.error("Error fetching user metrics:", err);
      setMetricsError("Failed to fetch user metrics");
      setMetricsLoading(false);
    }
  };
  
  const handleCalculateScore = async () => {
    await fetchUserMetrics();
  };
  
  const score = calculateScore();
  
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Fixed header with home button */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-gray-800 hover:text-gray-600 font-medium">
            ← Home
          </Link>
        </div>
      </header>
      
      <div className="flex-1 px-4 py-4 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">
          👑 CREATOR SCORE 👑
        </h1>
        
        {/* Avatar Gallery */}
        <div className="flex justify-center mb-6 overflow-x-auto w-full">
          <div className="flex space-x-2">
            {['🎮', '🦄', '🎨', '🚀', '⚡', '🌟', '💎', '🔥'].map((emoji, i) => (
              <span key={i} className="text-xl">{emoji}</span>
            ))}
          </div>
        </div>
        
        {!showScore ? (
          <div className="w-full">
            <button
              onClick={handleCalculateScore}
              disabled={metricsLoading || !user?.fid}
              className="w-full border-2 border-black p-4 text-lg font-bold bg-white hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
            >
              {metricsLoading ? "CALCULATING..." : "CALCULATE YOUR SCORE NOW!"}
            </button>
            
            {!user?.fid && (
              <p className="mt-3 text-center text-red-500 text-sm">
                Connect your Farcaster account first to calculate your score
              </p>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {metricsError ? (
              <div className="text-red-500 text-center">
                <p className="mb-2 text-sm">Failed to fetch your metrics</p>
                <button 
                  onClick={handleCalculateScore}
                  className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="w-full text-center">
                <MetricsDisplay metrics={metrics} score={score} />
                
                <div className="border border-black p-3 mb-4 rounded-md">
                  <h3 className="text-base font-bold mb-2">🏆 TODAY'S TOP CREATORS</h3>
                  <ol className="text-left pl-5 space-y-1 text-sm">
                    <li>@alice.eth - Score: 94</li>
                    <li>@bob.lens - Score: 91</li>
                    <li>@charlie - Score: 89</li>
                  </ol>
                </div>
                
                <p className="text-sm mb-4">
                  "Join {Math.floor(Math.random() * 5000)} creators who've
                  unlocked better loan rates"
                </p>
                
                <div className="text-center mb-4">
                  <p className="text-xs mb-1">
                    [ {Math.floor(Math.random() * 10)} friends are already playing ]
                  </p>
                  <p className="text-gray-600 text-xs">
                    @friend1 @friend2 @friend3
                  </p>
                </div>
                
                <button
                  onClick={() => setShowScore(false)}
                  className="mt-4 px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
                >
                  Calculate Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
