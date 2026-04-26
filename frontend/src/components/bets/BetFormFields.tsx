import { type Dispatch, type FormEvent, type SetStateAction } from "react"
import type { Bankroll, BetDTO, BetStatus, Market, Bookmaker, Sport, Tipster } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"

const statusLabels: Record<BetStatus, string> = {
  PENDING: "Pending",
  GREEN: "Green",
  RED: "Red",
  VOID: "Void",
  HALF_GREEN: "Half Green",
  HALF_RED: "Half Red",
}

const allStatuses: BetStatus[] = ["PENDING", "GREEN", "RED", "VOID", "HALF_GREEN", "HALF_RED"]

interface BetFormFieldsProps {
  formData: Partial<BetDTO>
  setFormData: Dispatch<SetStateAction<Partial<BetDTO>>>
  bankrolls?: Bankroll[]
  sports?: Sport[]
  markets?: Market[]
  bookmakers?: Bookmaker[]
  tipsters?: Tipster[]
  onSubmit: (e: FormEvent) => Promise<void>
  onCancel?: () => void
  submitLabel: string
  cancelLabel?: string
  isSubmitting?: boolean
}

export function BetFormFields({
  formData,
  setFormData,
  bankrolls,
  sports,
  markets,
  bookmakers,
  tipsters,
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel = "Cancelar",
  isSubmitting = false,
}: BetFormFieldsProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Row 0: Banca */}
      <div>
        <Label htmlFor="bankrollId" className="text-foreground/80 font-medium">Banca</Label>
        <Select
          value={formData.bankrollId?.toString() || ""}
          onValueChange={(value) => setFormData({ ...formData, bankrollId: Number(value) })}
        >
          <SelectTrigger className="h-11 w-full rounded-xl border-border bg-card text-foreground mt-1">
            <SelectValue placeholder="Selecione uma banca">
              {formData.bankrollId ? bankrolls?.find((b) => b.id === formData.bankrollId)?.name : null}
            </SelectValue>
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

      {/* Row 1: Data | Evento | Mercado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="betDate" className="text-foreground/80 font-medium">Data</Label>
          <div className="relative mt-1">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
            <Input
              id="betDate"
              type="date"
              value={formData.betDate || ""}
              onChange={(e) => setFormData({ ...formData, betDate: e.target.value })}
              required
              className="h-11 rounded-xl border-border bg-card text-foreground pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="event" className="text-foreground/80 font-medium">Evento</Label>
          <Input
            id="event"
            value={formData.event || ""}
            onChange={(e) => setFormData({ ...formData, event: e.target.value })}
            required
            placeholder="Ex: Time A vs Time B"
            className="h-11 rounded-xl border-border bg-card text-foreground mt-1"
          />
        </div>

        <div>
          <Label htmlFor="marketId" className="text-foreground/80 font-medium">Mercado</Label>
          <Select
            value={formData.marketId?.toString() || ""}
            onValueChange={(value) => setFormData({ ...formData, marketId: Number(value) })}
          >
            <SelectTrigger className="h-11 w-full rounded-xl border-border bg-card text-foreground mt-1">
              <SelectValue placeholder="Ex: Resultado Final, Over 2.5...">
                {formData.marketId ? markets?.find((m) => m.id === formData.marketId)?.name : null}
              </SelectValue>
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
      </div>

      {/* Row 2: Casa | Esporte | Tipster */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="bookmakerId" className="text-foreground/80 font-medium">Casa</Label>
          <Select
            value={formData.bookmakerId?.toString() || ""}
            onValueChange={(value) => setFormData({ ...formData, bookmakerId: Number(value) })}
          >
            <SelectTrigger className="h-11 w-full rounded-xl border-border bg-card text-foreground mt-1">
              <SelectValue placeholder="Ex: Bet365, Betano...">
                {formData.bookmakerId ? bookmakers?.find((b) => b.id === formData.bookmakerId)?.name : null}
              </SelectValue>
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
          <Label htmlFor="sportId" className="text-foreground/80 font-medium">Esporte</Label>
          <Select
            value={formData.sportId?.toString() || ""}
            onValueChange={(value) => {
              const sportId = Number(value)
              setFormData({ ...formData, sportId })
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-xl border-border bg-card text-foreground mt-1">
              <SelectValue placeholder="Ex: Futebol, Basquete...">
                {formData.sportId ? sports?.find((s) => s.id === formData.sportId)?.name : null}
              </SelectValue>
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
          <Label htmlFor="tipsterId" className="text-foreground/80 font-medium">Tipster</Label>
          <Select
            value={formData.tipsterId?.toString() || "none"}
            onValueChange={(value) => setFormData({ ...formData, tipsterId: value === "none" ? undefined : Number(value) })}
          >
            <SelectTrigger className="h-11 w-full rounded-xl border-border bg-card text-foreground mt-1">
              <SelectValue placeholder="Ex: NomeTipster...">
                {formData.tipsterId ? tipsters?.find((t) => t.id === formData.tipsterId)?.name : null}
              </SelectValue>
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
      </div>

      {/* Row 3: Odd | Stake (R$) | Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="odd" className="text-foreground/80 font-medium">Odd</Label>
          <Input
            id="odd"
            type="number"
            step="0.01"
            min="1.01"
            value={formData.odd || ""}
            onChange={(e) => setFormData({ ...formData, odd: parseFloat(e.target.value) })}
            required
            placeholder="2.500"
            className="h-11 rounded-xl border-border bg-card text-foreground mt-1"
          />
        </div>

        <div>
          <Label htmlFor="stake" className="text-foreground/80 font-medium">Stake (R$)</Label>
          <Input
            id="stake"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.stake || ""}
            onChange={(e) => setFormData({ ...formData, stake: parseFloat(e.target.value) })}
            required
            placeholder="50.00"
            className="h-11 rounded-xl border-border bg-card text-foreground mt-1"
          />
        </div>

        <div>
          <Label htmlFor="status" className="text-foreground/80 font-medium">Status</Label>
          <Select
            value={formData.status || ""}
            onValueChange={(value) => setFormData({ ...formData, status: value as BetStatus })}
          >
            <SelectTrigger className="h-11 w-full rounded-xl border-border bg-card text-foreground mt-1">
              <SelectValue placeholder="Selecione o status">
                {formData.status ? statusLabels[formData.status] : null}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {allStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {statusLabels[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col gap-3 pt-4">
        {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full rounded-xl h-12 font-semibold"
            >
              {cancelLabel}
            </Button>
        )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl h-12 font-semibold shadow-sm"
          >
            {submitLabel}
          </Button>
      </div>
    </form>
  )
}
