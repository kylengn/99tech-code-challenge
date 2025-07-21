
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  error: string
  onRetry: () => void
  isRetrying?: boolean
}

export function ErrorState({ error, onRetry, isRetrying = false }: ErrorStateProps) {
  return (
    <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardContent className="py-8">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="text-center">
          <Button
            onClick={onRetry}
            disabled={isRetrying}
            className="flex items-center gap-2 mx-auto"
          >
            <RefreshCw className={cn('w-4 h-4', isRetrying ? 'animate-spin' : '')} />
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 