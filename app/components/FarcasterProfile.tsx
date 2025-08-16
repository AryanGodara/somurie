"use client";

import { useMiniApp } from '@neynar/react';
import Link from "next/link";

export function FarcasterProfile() {
  const { isSDKLoaded, context } = useMiniApp();
  const user = context?.user;
  
  // Show placeholder while loading or if no user
  if (!isSDKLoaded || !user) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
        <span className="text-gray-500">?</span>
      </div>
    );
  }
  
  return (
    <Link href="/profile" className="flex items-center">
      {user.pfpUrl ? (
        <img 
          src={user.pfpUrl} 
          alt={user.displayName || user.username || `FID: ${user.fid}`}
          className="w-8 h-8 rounded-full object-cover border border-gray-200"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs border border-gray-300">
          {user.username?.substring(0, 1) || user.displayName?.substring(0, 1) || '?'}
        </div>
      )}
    </Link>
  );
}
