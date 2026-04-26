import { useState } from "react"
import {
  useBankrolls,
  useCreateBankroll,
  useUpdateBankroll,
  useDeleteBankroll,
} from "@/services/queries"
import type { Bankroll, BankrollDTO } from "@/types"
import type { BankrollsPageState, BankrollsPageHandlers } from "../types"

/**
 * Hook personalizado para gerenciar o estado e lógica da página de bancas
 */
export function useBankrollsPage() {
  // Estados do dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBankroll, setEditingBankroll] = useState<Bankroll | null>(null)
  const [formData, setFormData] = useState<Partial<BankrollDTO>>({})

  // Estados de deleção
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [bankrollToDelete, setBankrollToDelete] = useState<number | null>(null)

  // Hooks de dados e mutações
  const { data: bankrolls, isLoading } = useBankrolls()
  const createBankroll = useCreateBankroll()
  const updateBankroll = useUpdateBankroll()
  const deleteBankroll = useDeleteBankroll()

  // Handler para abrir dialog (criar ou editar)
  const handleOpenDialog = (bankroll?: Bankroll) => {
    if (bankroll) {
      setEditingBankroll(bankroll)
      setFormData({
        name: bankroll.name,
        initialBalance: bankroll.initialBalance,
      })
    } else {
      setEditingBankroll(null)
      setFormData({})
    }
    setDialogOpen(true)
  }

  // Handler para fechar dialog
  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingBankroll(null)
    setFormData({})
  }

  // Handler para submeter formulário (criar ou atualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingBankroll) {
        await updateBankroll.mutateAsync({
          id: editingBankroll.id,
          data: formData as BankrollDTO,
        })
      } else {
        await createBankroll.mutateAsync(formData as BankrollDTO)
      }
      handleCloseDialog()
    } catch (error) {
      console.error("Erro ao salvar banca:", error)
    }
  }

  // Handler para abrir dialog de confirmação de exclusão
  const handleDeleteClick = (id: number) => {
    setBankrollToDelete(id)
    setDeleteConfirmOpen(true)
  }

  // Handler para confirmar exclusão
  const handleConfirmDelete = async () => {
    if (bankrollToDelete) {
      try {
        await deleteBankroll.mutateAsync(bankrollToDelete)
        setBankrollToDelete(null)
      } catch (error) {
        console.error("Erro ao excluir banca:", error)
      }
    }
  }

  // Estado retornado
  const state: BankrollsPageState = {
    dialogOpen,
    editingBankroll,
    formData,
    deleteConfirmOpen,
    bankrollToDelete,
  }

  // Handlers retornados
  const handlers: BankrollsPageHandlers = {
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    setFormData,
    handleDeleteClick,
    handleConfirmDelete,
    setDeleteConfirmOpen,
  }

  return {
    state,
    handlers,
    bankrolls,
    isLoading,
    isPending: createBankroll.isPending || updateBankroll.isPending,
  }
}
