import { ReactNode } from 'react';

export interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

export interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

export interface WalletRowProps {
  className?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}

export interface BoxProps {
  children?: ReactNode;
  [key: string]: any;
}

export interface WalletPageProps extends BoxProps {}

export type BlockchainType = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';