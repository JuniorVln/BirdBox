import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((label, index) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors',
                index < currentStep
                  ? 'bg-accent text-white'
                  : index === currentStep
                    ? 'bg-accent/20 text-accent border border-accent'
                    : 'bg-surface-raised text-text-muted border border-border'
              )}
            >
              {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <span
              className={cn(
                'text-sm hidden sm:block',
                index <= currentStep ? 'text-text-primary' : 'text-text-muted'
              )}
            >
              {label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'h-px w-8 sm:w-12',
                index < currentStep ? 'bg-accent' : 'bg-border'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
