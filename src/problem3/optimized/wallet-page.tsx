import React, { useMemo } from 'react';
import { WalletPageProps, FormattedWalletBalance } from './types';
import { useWalletData } from './hooks/useWalletData';
import { WalletRow } from './components/wallet-row';

/**
 * Optimized WalletPage component
 * 
 * Key improvements:
 * - Separated concerns into custom hooks, utils, and components
 * - Proper memoization to prevent unnecessary re-calculations
 * - Fixed logic errors from original code
 * - Better TypeScript typing
 * - Performance optimizations
 */
const WalletPage: React.FC<WalletPageProps> = (props) => {
  const { children, ...rest } = props;
  const { balances, prices } = useWalletData();

  // Memoized rows - only recalculates when balances or prices change
  const rows = useMemo(() => {
    return balances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = (prices[balance.currency] || 0) * balance.amount;

      return (
        <WalletRow
          key={`${balance.currency}-${balance.blockchain}-${index}`}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [balances, prices]);

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};

export default WalletPage;
