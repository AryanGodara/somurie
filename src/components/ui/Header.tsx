"use client";

import { useState } from "react";
import { APP_NAME } from "~/lib/constants";
import { User } from "@privy-io/react-auth";

// Define Farcaster account type for better type support
type FarcasterAccount = {
  type: "farcaster";
  username?: string;
  fid: string | number;
  metadata?: {
    profileImageUrl?: string;
    displayName?: string;
  }
};

export type HeaderProps = {
  user?: User | null;
};

export function Header({ user }: HeaderProps) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  // Extract Farcaster data from Privy user if available
  const farcasterAccount = user?.linkedAccounts?.find(
    account => account.type === "farcaster"
  ) as FarcasterAccount | undefined;
  
  // Get profile image and display name
  const profileImage = farcasterAccount?.metadata?.profileImageUrl;
  const displayName = farcasterAccount?.metadata?.displayName;

  return (
    <div className="relative">
      <div 
        className="mt-4 mb-4 mx-4 px-2 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-between border-[3px] border-double border-primary"
      >
        <div className="text-lg font-light">
          Welcome to {APP_NAME}!
        </div>
        {user && (
          <div 
            className="cursor-pointer"
            onClick={() => {
              setIsUserDropdownOpen(!isUserDropdownOpen);
            }}
          >
            {/* Display profile image if available */}
            {profileImage && (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-primary"
              />
            )}
          </div>
        )}
      </div>
      {user && (
        <>      
          {isUserDropdownOpen && (
            <div className="absolute top-full right-0 z-50 w-fit mt-1 mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-3 space-y-2">
                <div className="text-right">
                  <h3 className="font-bold text-sm inline-block">
                    {farcasterAccount?.metadata?.displayName || (user.email?.address || "User")}
                  </h3>
                  
                  {farcasterAccount && (
                    <>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        @{farcasterAccount.username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        FID: {farcasterAccount.fid}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
