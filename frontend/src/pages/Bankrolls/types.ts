import type { Bankroll, BankrollDTO } from "@/types"

/**
 * Estado do hook useBankrollsPage
 */
export interface BankrollsPageState {
  // Estados do dialog
  dialogOpen: boolean
  editingBankroll: Bankroll | null
  formData: Partial<BankrollDTO>
  
  // Estados de deleção
  deleteConfirmOpen: boolean
  bankrollToDelete: number | null
}

/**
 * Handlers retornados pelo hook useBankrollsPage
 */
export interface BankrollsPageHandlers {
  // Dialog
  handleOpenDialog: (bankroll?: Bankroll) => void
  handleCloseDialog: () => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  setFormData: React.Dispatch<React.SetStateAction<Partial<BankrollDTO>>>
  
  // Deleção
  handleDeleteClick: (id: number) => void
  handleConfirmDelete: () => Promise<void>
  setDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * Props para o componente BankrollCard
 */
export interface BankrollCardProps {
  bankroll: Bankroll
  onEdit: (bankroll: Bankroll) => void
  onDelete: (id: number) => void
}

/**
 * Props para o componente BankrollDialog
 */
export interface BankrollDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingBankroll: Bankroll | null
  formData: Partial<BankrollDTO>
  setFormData: React.Dispatch<React.SetStateAction<Partial<BankrollDTO>>>
  onSubmit: (e: React.FormEvent) => Promise<void>
  isPending: boolean
}

/**
 * Props para o componente EmptyState
 */
export interface EmptyStateProps {
  onCreateClick: () => void
}
