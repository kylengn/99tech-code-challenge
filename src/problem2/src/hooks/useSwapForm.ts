import { useState, useEffect, useCallback, useRef } from 'react'
import type { SwapFormData, FormErrors, Token } from '@/types'

interface UseSwapFormReturn {
  formData: SwapFormData
  errors: FormErrors
  isLoading: boolean
  isSuccess: boolean
  exchangeRate: number | null
  handleInputChange: (field: keyof SwapFormData, value: string) => void
  handleSwapCurrencies: () => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  handleDismissSuccess: () => void
}

export function useSwapForm(tokens: Token[]): UseSwapFormReturn {
  const [formData, setFormData] = useState<SwapFormData>({
    fromCurrency: "",
    toCurrency: "",
    fromAmount: "",
    toAmount: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const autoDismissTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate exchange rate and to amount
  useEffect(() => {
    if (formData.fromCurrency && formData.toCurrency && formData.fromAmount) {
      const fromCurrency = tokens.find((c) => c.id === formData.fromCurrency)
      const toCurrency = tokens.find((c) => c.id === formData.toCurrency)

      if (fromCurrency && toCurrency && !isNaN(Number.parseFloat(formData.fromAmount))) {
        const rate = fromCurrency.price / toCurrency.price
        setExchangeRate(rate)

        const calculatedAmount = (Number.parseFloat(formData.fromAmount) * rate).toFixed(6)
        setFormData((prev) => ({ ...prev, toAmount: calculatedAmount }))
      }
    }
  }, [formData.fromCurrency, formData.toCurrency, formData.fromAmount, tokens])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoDismissTimeoutRef.current) {
        clearTimeout(autoDismissTimeoutRef.current)
      }
    }
  }, [])

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fromCurrency) {
      newErrors.fromCurrency = "Please select a currency to swap from"
    }

    if (!formData.toCurrency) {
      newErrors.toCurrency = "Please select a currency to swap to"
    }

    if (formData.fromCurrency === formData.toCurrency) {
      newErrors.general = "Cannot swap to the same currency"
    }

    if (!formData.fromAmount) {
      newErrors.fromAmount = "Please enter an amount"
    } else if (isNaN(Number.parseFloat(formData.fromAmount)) || Number.parseFloat(formData.fromAmount) <= 0) {
      newErrors.fromAmount = "Please enter a valid positive number"
    } else if (Number.parseFloat(formData.fromAmount) > 1000000) {
      newErrors.fromAmount = "Amount too large"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSwapCurrencies = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount,
    }))
    setErrors({})
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setIsSuccess(false)
    setErrors({})

    // Simulate API call with timeout
    try {
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Simulate random success/failure for demo
      if (Math.random() > 0.2) {
        setIsSuccess(true)
        // Auto-dismiss success message after 3 seconds
        autoDismissTimeoutRef.current = setTimeout(() => {
          setIsSuccess(false)
        }, 3000)
      } else {
        setErrors({ general: "Swap failed. Please try again." })
      }
    } catch {
      setErrors({ general: "Network error. Please check your connection." })
    } finally {
      setIsLoading(false)
    }
  }, [validateForm])

  const handleDismissSuccess = useCallback(() => {
    setIsSuccess(false)
    if (autoDismissTimeoutRef.current) {
      clearTimeout(autoDismissTimeoutRef.current)
      autoDismissTimeoutRef.current = null
    }
  }, [])

  const handleInputChange = useCallback((field: keyof SwapFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    setIsSuccess(false)
  }, [errors])

  return {
    formData,
    errors,
    isLoading,
    isSuccess,
    exchangeRate,
    handleInputChange,
    handleSwapCurrencies,
    handleSubmit,
    handleDismissSuccess,
  }
} 