import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Wallet } from "lucide-react"
import type { EmptyStateProps } from "../types"

/**
 * Componente de estado vazio quando não há bancas cadastradas
 */
export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <Card className="bg-card text-card-foreground border-border rounded-3xl shadow-sm">
      <CardContent className="py-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Wallet className="h-16 w-16 text-muted-foreground/60" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Nenhuma banca cadastrada
            </h3>
            <p className="text-muted-foreground mt-1">
              Crie sua primeira banca para começar a gerenciar suas apostas
            </p>
          </div>
          <Button
            onClick={onCreateClick}
            className="rounded-xl h-11 px-6 font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeira Banca
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
