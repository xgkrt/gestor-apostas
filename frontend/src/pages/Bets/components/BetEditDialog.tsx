import type { FormEvent } from "react"
import {
  useBankrolls,
  useBookmakers,
  useMarkets,
  useSports,
  useTipsters,
} from "@/services/queries"
import type { BetStatus } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatBetDate } from "../utils/formatting"
import { STATUS_LABELS, ALL_STATUSES } from "../types"
import type { BetEditDialogProps } from "../types"

/**
 * Dialog para editar uma aposta existente
 */
export function BetEditDialog({
  open,
  onOpenChange,
  betToEdit,
  formData,
  setFormData,
  onSubmit,
  isPending,
}: BetEditDialogProps) {
  const { data: bankrolls } = useBankrolls()
  const { data: sports } = useSports()
  const { data: markets } = useMarkets()
  const { data: bookmakers } = useBookmakers()
  const { data: tipsters } = useTipsters()

  const handleSubmit = (event: FormEvent) => {
    onSubmit(event)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-border bg-card text-card-foreground sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar Aposta</DialogTitle>
          <DialogDescription>
            Atualize os dados da aposta. A data e mantida como no cadastro original.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl border border-border bg-muted p-3 text-sm text-muted-foreground">
            Data da aposta:{" "}
            <span className="font-semibold text-foreground">
              {betToEdit ? formatBetDate(betToEdit.betDate) : "-"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="edit-bankroll" className="text-foreground/80">
                Banca
              </Label>
              <Select
                value={formData.bankrollId?.toString() || ""}
                onValueChange={(value) =>
                  setFormData((current) => ({ ...current, bankrollId: Number(value) }))
                }
              >
                <SelectTrigger id="edit-bankroll" className="mt-1 rounded-xl border-border bg-card text-foreground">
                  <SelectValue placeholder="Selecione uma banca" />
                </SelectTrigger>
                <SelectContent>
                  {bankrolls?.map((bankroll) => (
                    <SelectItem key={bankroll.id} value={bankroll.id.toString()}>
                      {bankroll.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-event" className="text-foreground/80">
                Evento
              </Label>
              <Input
                id="edit-event"
                value={formData.event || ""}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, event: event.target.value }))
                }
                placeholder="Ex: Time A vs Time B"
                className="mt-1 rounded-xl border-border bg-card text-foreground"
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-sport" className="text-foreground/80">
                Esporte
              </Label>
              <Select
                value={formData.sportId?.toString() || ""}
                onValueChange={(value) => {
                  const sportId = Number(value)
                  setFormData((current) => ({
                    ...current,
                    sportId,
                  }))
                }}
              >
                <SelectTrigger id="edit-sport" className="mt-1 rounded-xl border-border bg-card text-foreground">
                  <SelectValue placeholder="Selecione o esporte" />
                </SelectTrigger>
                <SelectContent>
                  {sports?.map((sport) => (
                    <SelectItem key={sport.id} value={sport.id.toString()}>
                      {sport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-market" className="text-foreground/80">
                Mercado
              </Label>
              <Select
                value={formData.marketId?.toString() || ""}
                onValueChange={(value) =>
                  setFormData((current) => ({ ...current, marketId: Number(value) }))
                }
              >
                <SelectTrigger id="edit-market" className="mt-1 rounded-xl border-border bg-card text-foreground">
                  <SelectValue placeholder="Selecione o mercado" />
                </SelectTrigger>
                <SelectContent>
                  {markets?.map((market) => (
                    <SelectItem key={market.id} value={market.id.toString()}>
                      {market.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-bookmaker" className="text-foreground/80">
                Casa
              </Label>
              <Select
                value={formData.bookmakerId?.toString() || ""}
                onValueChange={(value) =>
                  setFormData((current) => ({ ...current, bookmakerId: Number(value) }))
                }
              >
                <SelectTrigger id="edit-bookmaker" className="mt-1 rounded-xl border-border bg-card text-foreground">
                  <SelectValue placeholder="Selecione a casa" />
                </SelectTrigger>
                <SelectContent>
                  {bookmakers?.map((bookmaker) => (
                    <SelectItem key={bookmaker.id} value={bookmaker.id.toString()}>
                      {bookmaker.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-tipster" className="text-foreground/80">
                Tipster
              </Label>
              <Select
                value={formData.tipsterId?.toString() || "none"}
                onValueChange={(value) =>
                  setFormData((current) => ({
                    ...current,
                    tipsterId: value === "none" ? undefined : Number(value),
                  }))
                }
              >
                <SelectTrigger id="edit-tipster" className="mt-1 rounded-xl border-border bg-card text-foreground">
                  <SelectValue placeholder="Selecione o tipster" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {tipsters?.map((tipster) => (
                    <SelectItem key={tipster.id} value={tipster.id.toString()}>
                      {tipster.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-odd" className="text-foreground/80">
                Odd
              </Label>
              <Input
                id="edit-odd"
                type="number"
                step="0.01"
                min="1.01"
                value={formData.odd || ""}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    odd: parseFloat(event.target.value),
                  }))
                }
                className="mt-1 rounded-xl border-border bg-card text-foreground"
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-stake" className="text-foreground/80">
                Stake
              </Label>
              <Input
                id="edit-stake"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.stake || ""}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    stake: parseFloat(event.target.value),
                  }))
                }
                className="mt-1 rounded-xl border-border bg-card text-foreground"
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-status" className="text-foreground/80">
                Status
              </Label>
              <Select
                value={formData.status || "PENDING"}
                onValueChange={(value) =>
                  setFormData((current) => ({ ...current, status: value as BetStatus }))
                }
              >
                <SelectTrigger id="edit-status" className="mt-1 rounded-xl border-border bg-card text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
