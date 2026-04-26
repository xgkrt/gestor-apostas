import { Card } from "@/components/ui/card"
import { useRecentBetsTable } from "./RecentBetsTable/hooks/useRecentBetsTable"
import { RecentBetsTableContent } from "./RecentBetsTable/components/RecentBetsTableContent"
import { DeleteBetDialog } from "./RecentBetsTable/components/DeleteBetDialog"
import type { RecentBetsTableProps } from "./RecentBetsTable/types"

export function RecentBetsTable({ bets, onViewAll }: RecentBetsTableProps) {
  const { state, handlers, isUpdatingStatus, isDeletingBet } = useRecentBetsTable(bets)

  return (
    <Card className="bg-card text-card-foreground rounded-3xl border border-border shadow-sm overflow-hidden ">
      <RecentBetsTableContent
        bets={bets}
        filteredBets={state.filteredBets}
        paginatedBets={state.paginatedBets}
        searchTerm={state.searchTerm}
        statusFilter={state.statusFilter}
        currentPage={state.currentPage}
        totalPages={state.totalPages}
        isUpdatingStatus={isUpdatingStatus}
        isDeletingBet={isDeletingBet}
        onSearchChange={handlers.setSearchTerm}
        onStatusFilterChange={handlers.setStatusFilter}
        onStatusChange={handlers.handleStatusChange}
        onDeleteClick={handlers.openDeleteDialog}
        onPageChange={handlers.setCurrentPage}
        onViewAll={onViewAll}
      />

      <DeleteBetDialog
        betToDelete={state.betToDelete}
        isDeletingBet={isDeletingBet}
        onOpenChange={handlers.closeDeleteDialog}
        onConfirm={handlers.confirmDelete}
      />
    </Card>
  )
}
