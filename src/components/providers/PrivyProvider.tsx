'use client';

import React from 'react';
import { PrivyProvider as PrivyAuthProvider } from '@privy-io/react-auth';
import { APP_NAME, APP_ICON_URL } from '~/lib/constants';

/**
 * PrivyProvider component serves as the authentication and wallet provider for the application.
 * 
 * This component wraps the application with Privy's authentication context:
 * - Configures authentication methods (Farcaster, wallet, etc.)
 * - Sets up embedded wallet functionality
 * - Provides theming and appearance customization
 * 
 * @example
 * ```tsx
 * <PrivyProvider>
 *   <App />
 * </PrivyProvider>
 * ```
 */
interface PrivyProviderProps {
  children: React.ReactNode;
}

export function PrivyProvider({ children }: PrivyProviderProps) {
  // Replace this with your actual Privy App ID from env variables
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';
  
  return (
    <PrivyAuthProvider
      appId={appId}
      config={{
        loginMethods: ['farcaster', 'wallet', 'email'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF', // Customize to match your app's theme
          logo: APP_ICON_URL, // Optional logo URL from constants
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyAuthProvider>
  );
}
