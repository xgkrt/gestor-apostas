import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { BetsFiltersProps } from "../types"
import type { BetsStatusFilter } from "../types"

/**
 * Componente de filtros e busca para a página de apostas
 */
export function BetsFilters({
  searchTerm,
  statusFilter,
  startDate,
  endDate,
  onSearchChange,
  onStatusFilterChange,
  onStartDateChange,
  onEndDateChange,
}: BetsFiltersProps) {
  return (
    <div className="w-full md:w-auto">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:items-end">
        <Input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por evento"
          className="h-10 rounded-xl border-border bg-card text-foreground"
        />

        <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as BetsStatusFilter)}>
          <SelectTrigger className="h-10 rounded-xl border-border bg-card text-foreground">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="GREEN">Green</SelectItem>
            <SelectItem value="RED">Red</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="VOID">Void</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={startDate}
          onChange={(event) => onStartDateChange(event.target.value)}
          className="h-10 rounded-xl border-border bg-card text-foreground"
          aria-label="Data inicial"
        />

        <Input
          type="date"
          value={endDate}
          onChange={(event) => onEndDateChange(event.target.value)}
          className="h-10 rounded-xl border-border bg-card text-foreground"
          aria-label="Data final"
        />
      </div>
    </div>
  )
}
