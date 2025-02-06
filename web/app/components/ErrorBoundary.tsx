import { Component, ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 bg-red-500/10 text-red-400 rounded-lg">
            <h2 className="text-lg font-medium mb-2">Something went wrong</h2>
            <p className="text-sm">{this.state.error?.message}</p>
          </div>
        )
      )
    }

    return this.props.children
  }
}
