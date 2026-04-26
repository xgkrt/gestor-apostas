import { Component } from "react"
import type { ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service (e.g., Sentry, LogRocket)
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
          <Card className="max-w-2xl w-full bg-white border-red-200 shadow-lg">
            <CardHeader className="bg-red-50 border-b border-red-100">
              <CardTitle className="flex items-center gap-3 text-red-900">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                Algo deu errado
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-slate-700">
                Desculpe, ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando na solução.
              </p>

              {this.state.error && (
                <details className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <summary className="text-sm font-semibold text-slate-700 cursor-pointer hover:text-slate-900">
                    Detalhes técnicos
                  </summary>
                  <div className="mt-3 space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Mensagem de erro:
                      </p>
                      <pre className="text-xs text-red-700 bg-red-50 p-3 rounded border border-red-200 overflow-x-auto">
                        {this.state.error.message}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Stack trace:
                        </p>
                        <pre className="text-xs text-slate-600 bg-slate-100 p-3 rounded border border-slate-200 overflow-x-auto max-h-48">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={this.handleReset}
                  className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl h-11 px-6 font-semibold"
                >
                  Tentar novamente
                </Button>
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl h-11 px-6"
                >
                  Voltar ao início
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
