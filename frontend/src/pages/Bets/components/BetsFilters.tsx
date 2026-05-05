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
  sportFilter,
  marketFilter,
  bookmakerFilter,
  tipsterFilter,
  startDate,
  endDate,
  sports,
  markets,
  bookmakers,
  tipsters,
  onSearchChange,
  onStatusFilterChange,
  onSportFilterChange,
  onMarketFilterChange,
  onBookmakerFilterChange,
  onTipsterFilterChange,
  onStartDateChange,
  onEndDateChange,
}: BetsFiltersProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 xl:items-end">
        <Input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por evento"
          className="h-10 rounded-xl border-border bg-card text-foreground"
        />

        <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as BetsStatusFilter)}>
          <SelectTrigger className="h-10 rounded-xl border-border bg-card text-foreground" aria-label="Status">
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

        <Select value={sportFilter} onValueChange={onSportFilterChange}>
          <SelectTrigger className="h-10 rounded-xl border-border bg-card text-foreground" aria-label="Esporte">
            <SelectValue placeholder="Esporte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os esportes</SelectItem>
            {sports?.map((sport) => (
              <SelectItem key={sport.id} value={sport.id.toString()}>
                {sport.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={marketFilter} onValueChange={onMarketFilterChange}>
          <SelectTrigger className="h-10 rounded-xl border-border bg-card text-foreground" aria-label="Mercado">
            <SelectValue placeholder="Mercado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os mercados</SelectItem>
            {markets?.map((market) => (
              <SelectItem key={market.id} value={market.id.toString()}>
                {market.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={bookmakerFilter} onValueChange={onBookmakerFilterChange}>
          <SelectTrigger className="h-10 rounded-xl border-border bg-card text-foreground" aria-label="Casa">
            <SelectValue placeholder="Casa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas as casas</SelectItem>
            {bookmakers?.map((bookmaker) => (
              <SelectItem key={bookmaker.id} value={bookmaker.id.toString()}>
                {bookmaker.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={tipsterFilter} onValueChange={onTipsterFilterChange}>
          <SelectTrigger className="h-10 rounded-xl border-border bg-card text-foreground" aria-label="Tipster">
            <SelectValue placeholder="Tipster" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os tipsters</SelectItem>
            {tipsters?.map((tipster) => (
              <SelectItem key={tipster.id} value={tipster.id.toString()}>
                {tipster.name}
              </SelectItem>
            ))}
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
