import type { ReactNode } from "react";
import type { UseMutationResult } from "@tanstack/react-query";

/**
 * Tipos base para entidades CRUD
 */
export interface BaseEntity {
  id: number;
  name: string;
}

export interface BaseDTO {
  name: string;
}

/**
 * Configuração para operações CRUD
 */
export interface CrudConfig<TEntity extends BaseEntity, TDto extends BaseDTO> {
  entityName: string;
  entityNamePlural: string;
  data: TEntity[] | undefined;
  isLoading: boolean;
  createMutation: UseMutationResult<any, Error, TDto, unknown>;
  updateMutation: UseMutationResult<any, Error, { id: number; data: TDto }, unknown>;
  deleteMutation: UseMutationResult<any, Error, number, unknown>;
  initialFormData: TDto;
  successMessages: {
    create: string;
    update: string;
    delete: string;
  };
  errorMessages: {
    create: string;
    update: string;
    delete: string;
  };
}

/**
 * Estado e handlers retornados pelo hook useCrudEntity
 */
export interface CrudEntityState<TEntity extends BaseEntity, TDto extends BaseDTO> {
  // Estados
  dialogOpen: boolean;
  editingEntity: TEntity | null;
  formData: TDto;
  deleteDialogOpen: boolean;
  entityToDelete: TEntity | null;
  
  // Handlers
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleEdit: (entity: TEntity) => void;
  handleDelete: () => Promise<void>;
  handleCloseDialog: () => void;
  openDeleteDialog: (entity: TEntity) => void;
  setFormData: React.Dispatch<React.SetStateAction<TDto>>;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Props para o componente EntityTable
 */
export interface EntityTableProps<TEntity extends BaseEntity> {
  data: TEntity[] | undefined;
  columns: TableColumn<TEntity>[];
  emptyMessage: string;
  onEdit: (entity: TEntity) => void;
  onDelete: (entity: TEntity) => void;
}

export interface TableColumn<TEntity> {
  key: keyof TEntity | string;
  label?: string;
  render?: (entity: TEntity) => ReactNode;
}

/**
 * Props para o componente EntityDialog
 */
export interface EntityDialogProps<TDto extends BaseDTO> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formData: TDto;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
  isEditing: boolean;
  children: ReactNode;
}

/**
 * Props para o componente DeleteConfirmDialog
 */
export interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityName: string;
  entityDisplayName: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
}
