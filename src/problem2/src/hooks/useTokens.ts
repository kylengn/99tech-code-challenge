import { useState, useEffect, useCallback } from 'react'
import type { Token, ApiPriceData } from '@/types'
import { apiService } from '@/services/api'

interface UseTokensReturn {
  tokens: Token[]
  isLoading: boolean
  error: string | null
  refreshTokens: () => Promise<void>
}

// Fallback icons for common tokens
const FALLBACK_ICONS: Record<string, string> = {
  BTC: '₿',
  ETH: 'Ξ',
  USDT: '💎',
  BNB: '🟡',
  SOL: '◎',
  ADA: '₳',
  AVAX: '🔴',
  DOT: '●',
  SWTH: '🟡',
  USDC: '💙',
  MATIC: '🟣',
  LINK: '🔗',
  UNI: '🦄',
  AAVE: '🔴',
  COMP: '🟡',
  BUSD: '💵',
  LUNA: '🌙',
  ATOM: '⚛️',
  GMX: '🟢',
  KUJI: '🟣',
  STRD: '⭐',
  EVMOS: '🟢',
  IBCX: '🔵',
  IRIS: '🌸',
  RATOM: '⚛️',
  STEVMOS: '🟢',
  STOSMO: '🟢',
  STATOM: '⚛️',
  OSMO: '🟢',
  rSWTH: '🟡',
  STLUNA: '🌙',
  LSI: '💎',
  OKB: '🟡',
  OKT: '🟡',
  USC: '💵',
  WBTC: '₿',
  wstETH: '🔷',
  YieldUSD: '💵',
  ZIL: '🟣',
}

export function useTokens(): UseTokensReturn {
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const processTokenData = useCallback(async (priceData: ApiPriceData): Promise<Token[]> => {
    // Create a map to handle duplicates (keep the latest price)
    const tokenMap = new Map<string, { currency: string; price: number; date: string }>()
    
    priceData.forEach((item) => {
      const existing = tokenMap.get(item.currency)
      if (!existing || new Date(item.date) > new Date(existing.date)) {
        tokenMap.set(item.currency, item)
      }
    })
    
    const uniqueTokens = Array.from(tokenMap.values())
    const tokenIds = uniqueTokens.map(token => token.currency)
    
    // Fetch icons for all tokens
    const iconData = await apiService.batchCheckTokenIcons(tokenIds)
    
    return uniqueTokens.map((token) => {
      const iconUrl = iconData[token.currency]
      const fallbackIcon = FALLBACK_ICONS[token.currency] || '🪙'
      
      return {
        id: token.currency,
        name: token.currency, // Using currency as name since API doesn't provide names
        symbol: token.currency,
        price: token.price,
        iconUrl: iconUrl || undefined,
        fallbackIcon,
      }
    }).sort((a, b) => b.price - a.price) // Sort by price descending
  }, [])

  const fetchTokens = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const priceData = await apiService.fetchTokenPrices()
      const processedTokens = await processTokenData(priceData)
      
      setTokens(processedTokens)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tokens'
      setError(errorMessage)
      console.error('Error fetching tokens:', err)
    } finally {
      setIsLoading(false)
    }
  }, [processTokenData])

  const refreshTokens = useCallback(async () => {
    apiService.clearCache()
    await fetchTokens()
  }, [fetchTokens])

  useEffect(() => {
    fetchTokens()
  }, [fetchTokens])

  return {
    tokens,
    isLoading,
    error,
    refreshTokens,
  }
} 