import React, { memo } from 'react';
import { WalletRowProps } from '../types';

/**
 * WalletRow component - memoized to prevent unnecessary re-renders
 * Only re-renders when props actually change
 */
export const WalletRow = memo<WalletRowProps>(({
  className,
  usdValue,
  formattedAmount,
}) => {
  return (
    <div className={className}>
      <span>Amount: {formattedAmount}</span>
      <span>USD Value: ${usdValue.toFixed(2)}</span>
    </div>
  );
});

WalletRow.displayName = 'WalletRow'; 