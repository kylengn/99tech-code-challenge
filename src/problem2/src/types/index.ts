export interface Token {
  id: string
  name: string
  symbol: string
  price: number
  iconUrl?: string
  fallbackIcon?: string
}

export interface SwapFormData {
  fromCurrency: string
  toCurrency: string
  fromAmount: string
  toAmount: string
}

export interface FormErrors {
  fromAmount?: string
  fromCurrency?: string
  toCurrency?: string
  general?: string
}

export interface ApiPriceDataItem {
  currency: string
  date: string
  price: number
}

export type ApiPriceData = ApiPriceDataItem[]

export interface TokenIconData {
  [key: string]: string | null
} 