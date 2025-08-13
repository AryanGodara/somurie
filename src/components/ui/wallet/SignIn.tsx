'use client';

import { useCallback, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '../Button';

/**
 * SignIn component handles user authentication using Privy.
 *
 * This component provides a complete authentication flow for users:
 * - Uses Privy for authentication with multiple methods (Farcaster, wallet, email)
 * - Manages authentication state
 * - Provides sign-out functionality
 * - Displays authentication status and results including Farcaster details when available
 *
 * The component integrates with the Privy Auth SDK to provide seamless authentication.
 *
 * @example
 * ```tsx
 * <SignIn />
 * ```
 */

interface AuthState {
  signingIn: boolean;
  signingOut: boolean;
}

export function SignIn() {
  // --- State ---
  const [authState, setAuthState] = useState<AuthState>({
    signingIn: false,
    signingOut: false,
  });
  const [signInFailure, setSignInFailure] = useState<string>();

  // --- Hooks ---
  const { authenticated, user, login, logout, ready } = usePrivy();

  // --- Handlers ---
  /**
   * Handles the sign-in process using Privy.
   *
   * This function uses Privy's login functionality which supports multiple authentication methods
   * including Farcaster, wallet, and email.
   *
   * @returns Promise<void>
   */
  const handleSignIn = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, signingIn: true }));
      setSignInFailure(undefined);
      
      // Privy login handles the authentication flow
      login();
    } catch (e) {
      setSignInFailure('Authentication error');
      console.error('Sign-in error:', e);
    } finally {
      setAuthState(prev => ({ ...prev, signingIn: false }));
    }
  }, [login]);

  /**
   * Handles the sign-out process.
   *
   * This function uses Privy's logout functionality to end the user session.
   *
   * @returns Promise<void>
   */
  const handleSignOut = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, signingOut: true }));
      await logout();
    } finally {
      setAuthState(prev => ({ ...prev, signingOut: false }));
    }
  }, [logout]);

  // --- Render ---
  return (
    <>
      {/* Authentication Buttons */}
      {!authenticated && (
        <Button onClick={handleSignIn} disabled={authState.signingIn}>
          Sign In with Privy
        </Button>
      )}
      {authenticated && (
        <Button onClick={handleSignOut} disabled={authState.signingOut}>
          Sign out
        </Button>
      )}

      {/* Session Information */}
      {authenticated && user && (
        <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 dark:bg-gray-900 rounded-lg font-mono">
          <div className="font-semibold text-gray-500 dark:text-gray-300 mb-1">
            Authenticated User
          </div>
          <div className="whitespace-pre text-gray-700 dark:text-gray-200">
            {JSON.stringify(user, null, 2)}
          </div>
          {/* Display Farcaster details if available */}
          {user.farcaster && (
            <div className="mt-2">
              <div className="font-semibold text-gray-500 dark:text-gray-300 mb-1">
                Farcaster Details
              </div>
              <div className="whitespace-pre text-gray-700 dark:text-gray-200">
                FID: {user.farcaster.fid}
                {user.farcaster.username && <><br/>Username: {user.farcaster.username}</>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {signInFailure && !authState.signingIn && (
        <div className="my-2 p-2 text-xs overflow-x-scroll bg-gray-100 dark:bg-gray-900 rounded-lg font-mono">
          <div className="font-semibold text-gray-500 dark:text-gray-300 mb-1">
            Authentication Error
          </div>
          <div className="whitespace-pre text-gray-700 dark:text-gray-200">
            {signInFailure}
          </div>
        </div>
      )}
    </>
  );
}