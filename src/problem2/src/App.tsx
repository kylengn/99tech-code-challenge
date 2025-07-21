"use client"

import { useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import { useTokens } from '@/hooks/useTokens'
import { useSwapForm } from '@/hooks/useSwapForm'
import { SwapForm } from '@/components/SwapForm'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'

export default function App() {
  const { tokens, isLoading, error, refreshTokens } = useTokens()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const {
    formData,
    errors,
    isLoading: isSwapLoading,
    isSuccess,
    exchangeRate,
    handleInputChange,
    handleSwapCurrencies,
    handleSubmit,
    handleDismissSuccess,
  } = useSwapForm(tokens)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshTokens()
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleRetry = async () => {
    setIsRefreshing(true)
    try {
      await refreshTokens()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <ArrowUpDown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Fancy Form</h1>
          <p className="text-gray-600 dark:text-gray-400">Exchange your digital assets instantly</p>
        </div>

        {/* Main Content */}
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState
            error={error}
            onRetry={handleRetry}
            isRetrying={isRefreshing}
          />
        ) : (
          <SwapForm
            tokens={tokens}
            formData={formData}
            errors={errors}
            isLoading={isSwapLoading}
            isSuccess={isSuccess}
            exchangeRate={exchangeRate}
            onInputChange={handleInputChange}
            onSwapCurrencies={handleSwapCurrencies}
            onSubmit={handleSubmit}
            onRefresh={handleRefresh}
            onDismissSuccess={handleDismissSuccess}
            isRefreshing={isRefreshing}
          />
        )}

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Rates are updated in real-time • Secure & Fast</p>
        </div>
      </div>
    </div>
  )
}
