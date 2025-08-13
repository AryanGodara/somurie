"use client";

import { useState, useEffect, ReactNode } from "react";

interface ClientOnlyProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * This component ensures its children are only rendered on the client side
 * to avoid hydration mismatches between server and client rendering
 */
export function ClientOnlyProvider({ 
  children, 
  fallback = <div className="w-full h-screen bg-[var(--app-background)]"></div> 
}: ClientOnlyProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Add a slight delay to ensure all hydration processes have completed
    const timer = setTimeout(() => {
      setMounted(true);
    }, 50); // Small delay to ensure clean hydration
    
    return () => clearTimeout(timer);
  }, []);

  // Return placeholder during SSR and first render on client
  if (!mounted) {
    return fallback;
  }

  // After component has mounted on client, render children
  return <>{children}</>;
}
