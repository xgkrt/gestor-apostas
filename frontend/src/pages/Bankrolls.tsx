import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { Plus } from "lucide-react"
import { useBankrollsPage } from "./Bankrolls/hooks/useBankrollsPage"
import { BankrollCard } from "./Bankrolls/components/BankrollCard"
import { BankrollDialog } from "./Bankrolls/components/BankrollDialog"
import { EmptyState } from "./Bankrolls/components/EmptyState"

/**
 * Página de gerenciamento de bancas
 * Container que orquestra todos os componentes e lógica da página
 */
export default function Bankrolls() {
  const { state, handlers, bankrolls, isLoading, isPending } = useBankrollsPage()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground p-6">
        Carregando bancas...
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Bancas</h1>
        <Button
          onClick={() => handlers.handleOpenDialog()}
          className="rounded-xl h-11 px-6 font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Banca
        </Button>
      </div>

      {!bankrolls || bankrolls.length === 0 ? (
        <EmptyState onCreateClick={() => handlers.handleOpenDialog()} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bankrolls.map((bankroll) => (
            <BankrollCard
              key={bankroll.id}
              bankroll={bankroll}
              onEdit={handlers.handleOpenDialog}
              onDelete={handlers.handleDeleteClick}
            />
          ))}
        </div>
      )}

      <BankrollDialog
        open={state.dialogOpen}
        onOpenChange={handlers.handleCloseDialog}
        editingBankroll={state.editingBankroll}
        formData={state.formData}
        setFormData={handlers.setFormData}
        onSubmit={handlers.handleSubmit}
        isPending={isPending}
      />

      <ConfirmDialog
        open={state.deleteConfirmOpen}
        onOpenChange={handlers.setDeleteConfirmOpen}
        title="Excluir Banca"
        description={
          <p>
            Tem certeza que deseja excluir esta banca?{" "}
            <strong>Todas as apostas associadas serão removidas permanentemente.</strong> Esta
            ação não pode ser desfeita.
          </p>
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handlers.handleConfirmDelete}
        variant="destructive"
      />
    </div>
  )
}
