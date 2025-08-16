"use client";

import { CreatorScore } from '../components/CreatorScore';
import { MiniAppProvider } from '@neynar/react';

export default function CreatorScorePage() {
  return (
    <MiniAppProvider analyticsEnabled={true}>
      <CreatorScore />
    </MiniAppProvider>
  );
}
