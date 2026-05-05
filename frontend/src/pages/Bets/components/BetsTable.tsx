import type { Bet, BetStatus } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Pencil, Trash2 } from "lucide-react"
import { formatBetDate, getStatusClasses, getProfitClasses } from "../utils/formatting"
import { STATUS_LABELS, ALL_STATUSES } from "../types"
import type { BetsTableProps } from "../types"

/**
 * Componente puro de UI para exibir tabela de apostas com paginação
 */
export function BetsTable({
  paginatedBets,
  filteredBets,
  currentPage,
  totalPages,
  onEditClick,
  onDeleteClick,
  onStatusChange,
  onPageChange,
  isUpdatingStatus,
  isUpdatingBet,
}: BetsTableProps) {
  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex-1 min-h-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Data</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Esporte</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Evento</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mercado</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Casa</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tipster</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Odd</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stake</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Lucro</TableHead>
              <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBets.map((bet: Bet) => (
              <TableRow key={bet.id} className="border-border/50 transition-colors hover:bg-muted/30 h-[56px]">
                <TableCell className="text-sm text-muted-foreground">{formatBetDate(bet.betDate)}</TableCell>
                <TableCell className="text-sm font-medium text-foreground">{bet.sportName || bet.sport || "-"}</TableCell>
                <TableCell className="text-sm font-medium text-foreground max-w-[280px]">
                  <span className="block overflow-hidden leading-tight [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                    {bet.event}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-foreground/80">{bet.marketName || bet.market || "-"}</TableCell>
                <TableCell>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {bet.bookmakerName || bet.bookmaker || "-"}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {bet.tipsterName || bet.tipster || <span className="italic text-muted-foreground">-</span>}
                </TableCell>
                <TableCell className="text-sm impact-value text-foreground">{bet.odd.toFixed(2)}</TableCell>
                <TableCell className="text-sm impact-money text-foreground/90">R$ {bet.stake.toFixed(2)}</TableCell>
                <TableCell>
                  <Select
                    value={bet.status}
                    onValueChange={(value) => onStatusChange(bet.id, value as BetStatus)}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className={`h-9 w-36 rounded-lg border text-xs ${getStatusClasses(bet.status)}`}>
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
                </TableCell>
                <TableCell className={getProfitClasses(bet.profit)}>
                  R$ {bet.profit.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEditClick(bet)}
                      disabled={isUpdatingBet}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg cursor-pointer text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                      aria-label="Editar aposta"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteClick(bet.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg cursor-pointer text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Excluir aposta"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-auto pt-4 border-t border-border p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <span className="text-sm text-muted-foreground">
          Mostrando {paginatedBets.length} de {filteredBets.length} apostas
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
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
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
