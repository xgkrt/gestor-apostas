import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BankrollDialogProps } from "../types"

/**
 * Dialog para criar ou editar uma banca
 */
export function BankrollDialog({
  open,
  onOpenChange,
  editingBankroll,
  formData,
  setFormData,
  onSubmit,
  isPending,
}: BankrollDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border text-card-foreground rounded-2xl sm:rounded-3xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl font-bold">
            {editingBankroll ? "Editar Banca" : "Nova Banca"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-foreground/80 font-semibold">
              Nome da Banca
            </Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Banca Principal"
              required
              className="bg-card border-border text-foreground rounded-lg mt-1"
            />
          </div>

          <div>
            <Label htmlFor="initialBalance" className="text-foreground/80 font-semibold">
              Saldo Inicial (R$)
            </Label>
            <Input
              id="initialBalance"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.initialBalance || ""}
              onChange={(e) =>
                setFormData({ ...formData, initialBalance: parseFloat(e.target.value) })
              }
              placeholder="1000.00"
              required
              className="bg-card border-border text-foreground rounded-lg mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Este valor não pode ser alterado após a criação
            </p>
          </div>

          <DialogFooter className="mt-6 gap-2 sm:flex-row sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-xl h-11"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl h-11 font-semibold"
            >
              {editingBankroll ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
