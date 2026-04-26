import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Bet } from "@/types"

interface DeleteBetDialogProps {
  betToDelete: Bet | null
  isDeletingBet: boolean
  onOpenChange: () => void
  onConfirm: () => void
}

export function DeleteBetDialog({
  betToDelete,
  isDeletingBet,
  onOpenChange,
  onConfirm,
}: DeleteBetDialogProps) {
  return (
    <Dialog open={!!betToDelete} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card text-card-foreground rounded-3xl border-border shadow-2xl max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">Confirmar Exclusao</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed pt-2">
            Tem certeza que deseja excluir esta aposta? Esta acao nao pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        {betToDelete && (
          <div className="bg-muted rounded-2xl p-4 my-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Evento</span>
              <span className="text-sm font-semibold text-foreground">{betToDelete.event}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mercado</span>
              <span className="text-sm text-foreground/80">{betToDelete.market}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Stake</span>
              <span className="text-sm font-bold text-foreground">R$ {betToDelete.stake.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Odd</span>
              <span className="text-sm font-bold text-foreground">{betToDelete.odd.toFixed(2)}</span>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="ghost"
            onClick={onOpenChange}
            disabled={isDeletingBet}
            className="flex-1 h-11 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeletingBet}
            className="flex-1 h-11 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            {isDeletingBet ? "Excluindo..." : "Excluir Aposta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
