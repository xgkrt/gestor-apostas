import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Bankroll } from "@/types"

interface BankrollSelectorProps {
  bankrolls: Bankroll[]
  selectedBankrollId: number | null
  onValueChange: (bankrollId: number) => void
}

export function BankrollSelector({
  bankrolls,
  selectedBankrollId,
  onValueChange,
}: BankrollSelectorProps) {
  return (
    <div className="w-64">
      <label
        htmlFor="bankroll-selector"
        className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
      >
        Selecione a Banca
      </label>
      <Select
        value={selectedBankrollId?.toString() || ""}
        onValueChange={(value) => onValueChange(Number(value))}
      >
        <SelectTrigger
          id="bankroll-selector"
          className="w-full rounded-xl border-border bg-card px-4 py-3 text-sm text-foreground transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          aria-label="Selecione uma banca para visualizar o dashboard"
        >
          <SelectValue placeholder="Selecione uma banca">
            {selectedBankrollId ? bankrolls.find((bankroll) => bankroll.id === selectedBankrollId)?.name : null}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {bankrolls.map((bankroll) => (
            <SelectItem key={bankroll.id} value={bankroll.id.toString()}>
              {bankroll.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
