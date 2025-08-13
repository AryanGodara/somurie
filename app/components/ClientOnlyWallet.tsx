"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";

// This component will only render on the client side
export function ClientOnlyWallet() {
  const [mounted, setMounted] = useState(false);

  // Only show the wallet after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[36px] w-[120px]"></div>; // Placeholder with similar dimensions
  }

  return (
    <div className="flex items-center space-x-2">
      <Wallet className="z-10">
        <ConnectWallet>
          <Name className="text-inherit" />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
