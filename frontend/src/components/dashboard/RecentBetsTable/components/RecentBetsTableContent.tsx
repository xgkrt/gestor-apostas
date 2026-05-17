import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import type { Bet } from "@/types"
import { formatBetDate, getStatusClasses } from "../utils/formatting"
import type { RecentBetsStatusFilter } from "../types"

const UNIT_VALUE = 50

function formatUnits(value: number): string {
  const units = value / UNIT_VALUE
  const sign = units > 0 ? "+" : ""
  return `${sign}${units.toFixed(2)}u`
}

interface RecentBetsTableContentProps {
  bets: Bet[]
  filteredBets: Bet[]
  paginatedBets: Bet[]
  searchTerm: string
  statusFilter: RecentBetsStatusFilter
  currentPage: number
  totalPages: number
  isUpdatingStatus: boolean
  isDeletingBet: boolean
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: RecentBetsStatusFilter) => void
  onStatusChange: (betId: number, value: string) => void
  onDeleteClick: (bet: Bet) => void
  onPageChange: (page: number | ((page: number) => number)) => void
  onViewAll?: () => void
}

export function RecentBetsTableContent({
  bets,
  filteredBets,
  paginatedBets,
  searchTerm,
  statusFilter,
  currentPage,
  totalPages,
  isUpdatingStatus,
  isDeletingBet,
  onSearchChange,
  onStatusFilterChange,
  onStatusChange,
  onDeleteClick,
  onPageChange,
  onViewAll,
}: RecentBetsTableContentProps) {
  return (
    <>
      <div className="p-8 pb-4 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h4 className="text-lg font-semibold text-foreground">Últimas Apostas</h4>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <div className="w-full md:w-80 hidden">
              <Input
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Buscar por evento"
                className="h-10 rounded-xl border-border bg-card text-foreground"
              />
            </div>

            <div className="w-full md:w-44">
              <Select
                value={statusFilter}
                onValueChange={(value) => onStatusFilterChange(value as RecentBetsStatusFilter)}
              >
                <SelectTrigger className="h-10 rounded-xl border-border bg-card text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas</SelectItem>
                  <SelectItem value="GREEN">Green</SelectItem>
                  <SelectItem value="RED">Red</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="VOID">Void</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-x-auto">
        {bets.length > 0 ? (
          filteredBets.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Data
                  </TableHead>
                  <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Esporte
                  </TableHead>
                  <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Evento
                  </TableHead>
                  <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Mercado
                  </TableHead>
                  <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Casa
                  </TableHead>
                  <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Tipster
                  </TableHead>
                  <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Odd
                  </TableHead>
                  <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Stake
                  </TableHead>
                  <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Lucro
                  </TableHead>
                  <TableHead className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBets.map((bet) => (
                  <TableRow
                    key={bet.id}
                    className="hover:bg-muted/30 transition-colors border-border/50"
                  >
                    <TableCell className="px-8 py-4 text-sm text-muted-foreground">
                      {formatBetDate(bet.betDate)}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm font-medium text-foreground">
                      {bet.sportName || bet.sport || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-4 font-medium text-sm text-foreground max-w-[260px]">
                      <span className="block overflow-hidden leading-tight [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                        {bet.event}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm text-foreground/80">
                      {bet.marketName || bet.market || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <span className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground font-medium">
                        {bet.bookmakerName || bet.bookmaker || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                      {bet.tipsterName || bet.tipster || <span className="text-muted-foreground italic">-</span>}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm impact-value text-foreground">
                      {bet.odd.toFixed(2)}
                    </TableCell>
                    <TableCell className="px-4 py-4 text-sm impact-money text-foreground/90">
                      R$ {bet.stake.toFixed(2)}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      <Select
                        value={bet.status}
                        onValueChange={(value) => value && onStatusChange(bet.id, value)}
                        disabled={isUpdatingStatus}
                      >
                        <SelectTrigger
                          className={`w-36 h-9 text-xs rounded-lg transition-all ${getStatusClasses(bet.status)}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="GREEN">Green</SelectItem>
                          <SelectItem value="RED">Red</SelectItem>
                          <SelectItem value="VOID">Void</SelectItem>
                          <SelectItem value="HALF_GREEN">Half Green</SelectItem>
                          <SelectItem value="HALF_RED">Half Red</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell
                      className={`min-w-[96px] whitespace-nowrap px-4 py-4 text-sm impact-money ${
                        bet.profit >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-red-600 dark:text-rose-300"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center leading-tight">
                        <span>R$ {bet.profit.toFixed(2)}</span>
                        <span className="mt-0.5 text-xs font-semibold opacity-85">{formatUnits(bet.profit)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteClick(bet)}
                        disabled={isDeletingBet}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                        title="Excluir aposta"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum evento encontrado para a busca informada
            </div>
          )
        ) : (
          <div className="p-8 text-center text-muted-foreground">Nenhuma aposta registrada ainda</div>
        )}
      </div>

      {filteredBets.length > 0 && (
        <div className="mt-auto pt-4 border-t border-border p-4 bg-muted/30 space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <span className="text-sm text-muted-foreground">
              Mostrando {paginatedBets.length} de {filteredBets.length} apostas
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onPageChange((page) => Math.max(page - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onPageChange((page) => Math.min(page + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>

          {onViewAll && (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={onViewAll}
                className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:underline transition-all hover:bg-transparent"
              >
                Ver Histórico Completo
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
