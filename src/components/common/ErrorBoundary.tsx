import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useI18n } from '@/hooks/useI18n'
import { Button } from '@/components/ui/button'

function ErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  const { t } = useI18n()
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8 text-center">
      <div className="text-4xl">⚠️</div>
      <h2 className="text-xl font-semibold text-text-primary">{t.common.somethingWentWrong}</h2>
      {error?.message && (
        <p className="text-sm text-text-secondary max-w-sm font-mono bg-surface-raised px-3 py-2 rounded">
          {error.message}
        </p>
      )}
      <Button variant="outline" onClick={onReset}>
        {t.common.retry}
      </Button>
    </div>
  )
}

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: null })}
        />
      )
    }
    return this.props.children
  }
}
