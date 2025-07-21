
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading tokens...' }: LoadingStateProps) {
  return (
    <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
        </div>
      </CardContent>
    </Card>
  )
} 