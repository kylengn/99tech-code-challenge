import type { ApiPriceData, TokenIconData } from '@/types'

const PRICES_API_URL = 'https://interview.switcheo.com/prices.json'
const TOKEN_ICONS_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens'

export class ApiService {
  private static instance: ApiService
  private priceCache: ApiPriceData | null = null
  private iconCache: TokenIconData = {}
  private lastFetchTime = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  async fetchTokenPrices(): Promise<ApiPriceData> {
    const now = Date.now()
    
    // Return cached data if still valid
    if (this.priceCache && (now - this.lastFetchTime) < this.CACHE_DURATION) {
      return this.priceCache
    }

    try {
      const response = await fetch(PRICES_API_URL)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      this.priceCache = data
      this.lastFetchTime = now
      return data
    } catch (error) {
      console.error('Failed to fetch token prices:', error)
      throw new Error('Failed to fetch token prices. Please try again later.')
    }
  }

  async checkTokenIcon(tokenId: string): Promise<string | null> {
    // Return cached result if available
    if (this.iconCache[tokenId] !== undefined) {
      return this.iconCache[tokenId]
    }

    try {
      const iconUrl = `${TOKEN_ICONS_BASE_URL}/${tokenId}.svg`
      // Try to fetch the actual image to check if it exists
      const response = await fetch(iconUrl)
      
      if (response.ok && response.headers.get('content-type')?.includes('image')) {
        this.iconCache[tokenId] = iconUrl
        return iconUrl
      } else {
        this.iconCache[tokenId] = null
        return null
      }
    } catch (error) {
      console.warn(`Failed to check icon for ${tokenId}:`, error)
      this.iconCache[tokenId] = null
      return null
    }
  }

  async batchCheckTokenIcons(tokenIds: string[]): Promise<TokenIconData> {
    const promises = tokenIds.map(async (id) => {
      const iconUrl = await this.checkTokenIcon(id)
      return { id, iconUrl }
    })

    const results = await Promise.allSettled(promises)
    const iconData: TokenIconData = {}

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        iconData[result.value.id] = result.value.iconUrl
      }
    })

    return iconData
  }

  clearCache(): void {
    this.priceCache = null
    this.iconCache = {}
    this.lastFetchTime = 0
  }
}

export const apiService = ApiService.getInstance() 