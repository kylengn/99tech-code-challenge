
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TokenIcon } from './TokenIcon'
import type { Token } from '@/types'
import { cn } from '@/lib/utils'

interface CurrencySelectorProps {
  value: string
  onValueChange: (value: string) => void
  tokens: Token[]
  placeholder?: string
  hasError?: boolean
  disabled?: boolean
}

export function CurrencySelector({
  value,
  onValueChange,
  tokens,
  placeholder = 'Select',
  hasError = false,
  disabled = false,
}: CurrencySelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={cn('w-full cursor-pointer', hasError ? 'border-red-500' : '')}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {tokens.map((token) => (
          <SelectItem key={token.id} value={token.id} className='cursor-pointer'>
            <div className="flex items-center gap-2">
              <TokenIcon token={token} size="sm" />
              <div>
                <div className="font-medium">{token.id}</div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 