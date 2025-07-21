import { BlockchainType } from '../types';

// Blockchain priority mapping - moved outside component to avoid recreation
export const BLOCKCHAIN_PRIORITIES: Record<BlockchainType, number> = {
  'Osmosis': 100,
  'Ethereum': 50,
  'Arbitrum': 30,
  'Zilliqa': 20,
  'Neo': 20,
} as const;

export const DEFAULT_PRIORITY = -99;

/**
 * Get priority for a blockchain
 * @param blockchain - The blockchain name
 * @returns Priority number (higher = more important)
 */
export const getBlockchainPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain as BlockchainType] ?? DEFAULT_PRIORITY;
};

/**
 * Check if a balance should be included based on priority and amount
 * @param balance - The wallet balance to check
 * @returns True if balance should be included
 */
export const shouldIncludeBalance = (balance: { blockchain: string; amount: number }): boolean => {
  const priority = getBlockchainPriority(balance.blockchain);
  return priority > DEFAULT_PRIORITY && balance.amount > 0;
}; 