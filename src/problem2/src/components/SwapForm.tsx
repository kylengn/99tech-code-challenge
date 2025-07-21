
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown, Loader2, TrendingUp, Wallet, AlertCircle, RefreshCw, CircleCheck, X } from 'lucide-react'
import { CurrencySelector } from './CurrencySelector'

import type { Token, SwapFormData, FormErrors } from '@/types'

interface SwapFormProps {
  tokens: Token[]
  formData: SwapFormData
  errors: FormErrors
  isLoading: boolean
  isSuccess: boolean
  exchangeRate: number | null
  onInputChange: (field: keyof SwapFormData, value: string) => void
  onSwapCurrencies: () => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  onRefresh: () => Promise<void>
  onDismissSuccess: () => void
  isRefreshing?: boolean
}

export function SwapForm({
  tokens,
  formData,
  errors,
  isLoading,
  isSuccess,
  exchangeRate,
  onInputChange,
  onSwapCurrencies,
  onSubmit,
  onRefresh,
  onDismissSuccess,
  isRefreshing = false,
}: SwapFormProps) {
  const fromToken = tokens.find((t) => t.id === formData.fromCurrency)
  const toToken = tokens.find((t) => t.id === formData.toCurrency)

  return (
    <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            <CardTitle>Swap Assets</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>Enter the amount and select currencies to swap</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* From Section */}
          <div className="space-y-3">
            <Label htmlFor="from-amount" className="text-sm font-medium">
              From
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Input
                  id="from-amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.fromAmount}
                  onChange={(e) => onInputChange("fromAmount", e.target.value)}
                  className={`text-lg font-medium ${errors.fromAmount ? "border-red-500" : ""}`}
                  step="any"
                  min="0"
                  disabled={isLoading}
                />
                {errors.fromAmount && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fromAmount}
                  </p>
                )}
              </div>
              <CurrencySelector
                value={formData.fromCurrency}
                onValueChange={(value) => onInputChange("fromCurrency", value)}
                tokens={tokens}
                hasError={!!errors.fromCurrency}
                disabled={isLoading}
              />
            </div>
            {fromToken && (
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                ${fromToken.price.toLocaleString()}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onSwapCurrencies}
              className="rounded-full border-2 hover:rotate-180 transition-transform duration-300 bg-transparent cursor-pointer"
              disabled={isLoading}
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* To Section */}
          <div className="space-y-3">
            <Label htmlFor="to-amount" className="text-sm font-medium">
              To
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Input
                  id="to-amount"
                  type="text"
                  placeholder="0.00"
                  value={formData.toAmount}
                  readOnly
                  className="text-lg font-medium bg-gray-50 dark:bg-slate-700"
                />
              </div>
              <CurrencySelector
                value={formData.toCurrency}
                onValueChange={(value) => onInputChange("toCurrency", value)}
                tokens={tokens}
                hasError={!!errors.toCurrency}
                disabled={isLoading}
              />
            </div>
            {toToken && (
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                ${toToken.price.toLocaleString()}
              </div>
            )}
          </div>

          {/* Exchange Rate */}
          {exchangeRate && fromToken && toToken && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <div className="flex items-center justify-between">
                  <span>Exchange Rate</span>
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-800">
                    1 {fromToken.id} = {exchangeRate.toFixed(6)} {toToken.id}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {(errors.general || errors.fromCurrency || errors.toCurrency) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general || errors.fromCurrency || errors.toCurrency}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {isSuccess && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 relative overflow-hidden">
              <AlertDescription className="flex items-center justify-between text-green-600 dark:text-green-400 pr-8">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center">
                    <CircleCheck className='w-4 h-4' />
                  </div>
                  <span>Swap completed successfully!</span>
                </div>
                <button
                  onClick={onDismissSuccess}
                  className="absolute top-2 right-2 p-1 hover:bg-green-100 dark:hover:bg-green-800 rounded-full transition-colors cursor-pointer"
                  aria-label="Dismiss success message"
                >
                  <X className="w-3 h-3" />
                </button>
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 text-sm cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Swapping...
              </>
            ) : (
              "Swap Now"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 