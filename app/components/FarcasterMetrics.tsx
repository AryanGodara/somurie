"use client";

export function FarcasterMetrics() {
  // Hardcoded sample metrics data for demonstration
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
  
  // Hardcoded values for demo purposes
  const fid = "1";
  const isLoading = false;
  const error = null;

  // Dummy functions for UI elements to avoid TypeScript errors
  const setFid = () => {};
  const fetchMetrics = () => {};

  return (
    <div className="p-4 border rounded-lg bg-[var(--app-background)] shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-[var(--app-foreground)]">
        Farcaster Metrics
      </h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-medium text-[var(--app-foreground)]">
          Farcaster ID (FID)
          <input
            type="text"
            value={fid}
            onChange={() => {}} // No-op for demo
            className="w-full p-2 mt-1 bg-[var(--app-gray)] text-[var(--app-foreground)] rounded"
            suppressHydrationWarning
            readOnly
          />
        </label>
        
        <button
          // No actual fetch for demo
          className="mt-2 px-4 py-2 rounded-md font-medium bg-[#0052FF] hover:bg-[#0039B3] text-white"
        >
          Fetch Metrics
        </button>
      </div>
      
      {/* Always show metrics in demo */}
      <div className="grid grid-cols-2 gap-3">
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
