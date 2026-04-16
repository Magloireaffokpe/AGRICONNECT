import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '../ui/Button'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 p-8 text-center">
          <div className="text-6xl mb-6">🌱</div>
          <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2">
            Quelque chose s'est mal passé
          </h1>
          <p className="text-stone-500 mb-8 max-w-md">
            Une erreur inattendue s'est produite. Rechargez la page ou revenez à l'accueil.
          </p>
          {this.state.error && (
            <pre className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-6 max-w-lg overflow-auto">
              {this.state.error.message}
            </pre>
          )}
          <Button onClick={() => window.location.href = '/'}>Retour à l'accueil</Button>
        </div>
      )
    }
    return this.props.children
  }
}
