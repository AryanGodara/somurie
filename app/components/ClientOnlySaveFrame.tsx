"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useMiniApp } from "@neynar/react";
import { Button } from "./DemoComponents";
import { Icon } from "./DemoComponents";

export function ClientOnlySaveFrame() {
  const { isSDKLoaded, context } = useMiniApp();
  const [mounted, setMounted] = useState(false);
  const [frameAdded, setFrameAdded] = useState(false);

  // Only show after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddFrame = useCallback(async () => {
    // Using the Neynar SDK to add frame is not directly equivalent to MiniKit's addFrame
    // Instead, we'll just simulate success for now
    setFrameAdded(true);
  }, []);

  const saveFrameButton = useMemo(() => {
    if (!mounted || !isSDKLoaded) return null;

    if (!frameAdded) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame, mounted]);

  return <div>{saveFrameButton}</div>;
}
