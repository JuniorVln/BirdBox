import { cn } from '@/lib/utils'

interface ScoreGaugeProps {
  score: number
  label: string
  size?: 'sm' | 'md' | 'lg'
}

function getScoreColor(score: number) {
  if (score >= 90) return { text: 'text-green-400', stroke: 'stroke-green-400', bg: 'bg-green-400/10' }
  if (score >= 50) return { text: 'text-yellow-400', stroke: 'stroke-yellow-400', bg: 'bg-yellow-400/10' }
  return { text: 'text-red-400', stroke: 'stroke-red-400', bg: 'bg-red-400/10' }
}

const sizes = {
  sm: { container: 'w-16 h-16', text: 'text-sm', label: 'text-[10px]', strokeWidth: 3, radius: 26 },
  md: { container: 'w-24 h-24', text: 'text-xl', label: 'text-xs', strokeWidth: 4, radius: 40 },
  lg: { container: 'w-32 h-32', text: 'text-3xl', label: 'text-sm', strokeWidth: 5, radius: 54 },
}

export function ScoreGauge({ score, label, size = 'md' }: ScoreGaugeProps) {
  const color = getScoreColor(score)
  const s = sizes[size]
  const circumference = 2 * Math.PI * s.radius
  const offset = circumference - (score / 100) * circumference
  const viewBoxSize = (s.radius + s.strokeWidth) * 2

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn('relative', s.container)}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
          <circle
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={s.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={s.strokeWidth}
            className="text-border"
          />
          <circle
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={s.radius}
            fill="none"
            strokeWidth={s.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn(color.stroke, 'transition-all duration-1000 ease-out')}
          />
        </svg>
        <div className={cn('absolute inset-0 flex items-center justify-center font-bold', s.text, color.text)}>
          {score}
        </div>
      </div>
      <span className={cn('text-text-secondary font-medium', s.label)}>{label}</span>
    </div>
  )
}

export function ScoreBar({ score, label }: { score: number; label: string }) {
  const color = getScoreColor(score)

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className={cn('font-semibold', color.text)}>{score}/100</span>
      </div>
      <div className="h-2 rounded-full bg-surface-raised overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-1000 ease-out', {
            'bg-green-400': score >= 90,
            'bg-yellow-400': score >= 50 && score < 90,
            'bg-red-400': score < 50,
          })}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}
