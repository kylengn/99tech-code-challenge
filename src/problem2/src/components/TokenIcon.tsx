
import type { Token } from '@/types'
import { cn } from '@/lib/utils'

interface TokenIconProps {
  token: Token
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

export function TokenIcon({ token, size = 'md', className = '' }: TokenIconProps) {
  if (token.iconUrl) {
    return (
      <div className="relative">
        <img
          src={token.iconUrl}
          alt={`${token.name} icon`}
          className={`${sizeClasses[size]} ${className} rounded-full`}
          onError={(e) => {
            // Fallback to emoji if image fails to load
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const fallback = target.nextElementSibling as HTMLElement
            if (fallback) {
              fallback.style.display = 'flex'
            }
          }}
        />
        <span
          className={`${sizeClasses[size]} ${className} hidden items-center justify-center text-lg rounded-full bg-gray-100 dark:bg-gray-700`}
        >
          {token.fallbackIcon || '🪙'}
        </span>
      </div>
    )
  }

  return (
    <span
      className={cn(
        sizeClasses[size],
        className,
        'flex items-center justify-center text-lg rounded-full bg-gray-100 dark:bg-gray-700'
      )}
    >
      {token.fallbackIcon || '🪙'}
    </span>
  )
} 