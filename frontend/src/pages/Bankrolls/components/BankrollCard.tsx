import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { formatBankrollDate } from "../utils/formatting"
import type { BankrollCardProps } from "../types"

/**
 * Componente de card para exibir uma banca individual
 */
export function BankrollCard({ bankroll, onEdit, onDelete }: BankrollCardProps) {
  return (
    <Card className="bg-card text-card-foreground border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-muted/40 border-b border-border p-6">
        <CardTitle className="flex items-center justify-between text-foreground text-lg">
          <span>{bankroll.name}</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(bankroll)}
              className="text-muted-foreground hover:text-accent-foreground hover:bg-accent h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(bankroll.id)}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
              aria-label="Excluir banca"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div>
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
            Saldo Inicial
          </p>
          <p className="text-2xl font-bold text-foreground">
            R$ {bankroll.initialBalance.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">
            Saldo Atual
          </p>
          <p className="text-2xl font-bold text-emerald-600">
            R$ {bankroll.currentBalance.toFixed(2)}
          </p>
        </div>
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Criada em {formatBankrollDate(bankroll.createdAt)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
