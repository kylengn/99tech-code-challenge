import { useMemo } from 'react';
import { WalletBalance, FormattedWalletBalance } from '../types';
import { getBlockchainPriority, shouldIncludeBalance } from '../utils/blockchain';

// Mock hooks - in real implementation these would be actual hooks
const useWalletBalances = (): WalletBalance[] => {
  return [];
};

const usePrices = (): Record<string, number> => {
  return {};
};

/**
 * Custom hook to process wallet balances with proper memoization
 * @returns Processed and sorted wallet balances
 */
export const useWalletData = () => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // Memoized sorted balances - only recalculates when balances or prices change
  const sortedBalances = useMemo(() => {
    return balances
      .filter(shouldIncludeBalance)
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getBlockchainPriority(lhs.blockchain);
        const rightPriority = getBlockchainPriority(rhs.blockchain);
        
        // Sort by priority (descending) - higher priority first
        return rightPriority - leftPriority;
      });
  }, [balances]);

  // Memoized formatted balances - only recalculates when sortedBalances change
  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance): FormattedWalletBalance => ({
      ...balance,
      formatted: balance.amount.toFixed(2), // Use 2 decimal places for better formatting
    }));
  }, [sortedBalances]);

  return {
    balances: formattedBalances,
    prices,
    sortedBalances,
  };
}; 