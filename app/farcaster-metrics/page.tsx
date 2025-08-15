"use client";

import Link from "next/link";
import { FarcasterMetrics } from "../components/FarcasterMetrics";

export default function FarcasterMetricsPage() {
  return (
    <div className="min-h-screen bg-[var(--app-background)] text-[var(--app-foreground)] p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <nav className="mb-6">
            <Link 
              href="/" 
              className="text-[var(--app-accent)] hover:underline flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back to Home
            </Link>
          </nav>
          <h1 className="text-2xl font-bold">Farcaster Metrics Dashboard</h1>
          <p className="text-[var(--app-foreground-muted)] mt-2">
            View metrics and analytics for your Farcaster profile
          </p>
        </header>

        <div className="space-y-8">
          <FarcasterMetrics />
        </div>
      </div>
    </div>
  );
}
