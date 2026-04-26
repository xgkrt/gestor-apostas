import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { useBetsPage } from "./Bets/hooks/useBetsPage"
import { BetsFilters } from "./Bets/components/BetsFilters"
import { BetsTable } from "./Bets/components/BetsTable"
import { BetEditDialog } from "./Bets/components/BetEditDialog"

/**
 * Página de gerenciamento de apostas
 * Container que orquestra todos os componentes e lógica da página
 */
export default function Bets() {
  const { state, handlers, isLoading, bets, isUpdatingBet, isUpdatingStatus } = useBetsPage()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-muted-foreground">
        Carregando apostas...
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Minhas Apostas</h1>
        <p className="mt-2 text-sm text-muted-foreground">Visualize, edite e exclua suas apostas aqui.</p>
      </div>

      <Card className="overflow-hidden rounded-3xl border-border bg-card text-card-foreground shadow-sm">
        <CardHeader className="border-b border-border bg-muted/40 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">Lista de Apostas</CardTitle>
            <BetsFilters
              searchTerm={state.searchTerm}
              statusFilter={state.statusFilter}
              startDate={state.startDate}
              endDate={state.endDate}
              onSearchChange={handlers.setSearchTerm}
              onStatusFilterChange={handlers.setStatusFilter}
              onStartDateChange={handlers.setStartDate}
              onEndDateChange={handlers.setEndDate}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 flex flex-1 flex-col min-h-0">
          {!bets || bets.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-12 text-center text-muted-foreground">
              Nenhuma aposta cadastrada.
            </div>
          ) : state.filteredBets.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-12 text-center text-muted-foreground">
              Nenhum evento encontrado para a busca informada.
            </div>
          ) : (
            <BetsTable
              paginatedBets={state.paginatedBets}
              filteredBets={state.filteredBets}
              currentPage={state.currentPage}
              totalPages={state.totalPages}
              isLoading={isLoading}
              onEditClick={handlers.handleEditClick}
              onDeleteClick={handlers.handleDeleteClick}
              onStatusChange={handlers.handleStatusChange}
              onPageChange={handlers.setCurrentPage}
              isUpdatingStatus={isUpdatingStatus}
              isUpdatingBet={isUpdatingBet}
            />
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={state.deleteConfirmOpen}
        onOpenChange={handlers.setDeleteConfirmOpen}
        title="Excluir Aposta"
        description="Tem certeza que deseja excluir esta aposta? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handlers.handleConfirmDelete}
        variant="destructive"
      />

      <BetEditDialog
        open={state.editDialogOpen}
        onOpenChange={handlers.handleEditDialogChange}
        betToEdit={state.betToEdit}
        formData={state.editFormData}
        setFormData={handlers.setEditFormData}
        onSubmit={handlers.handleSaveEdit}
        isPending={isUpdatingBet}
      />
    </div>
  )
}
