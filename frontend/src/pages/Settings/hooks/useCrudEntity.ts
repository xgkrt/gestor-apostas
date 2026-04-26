import { useState, type FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import type { BaseEntity, BaseDTO, CrudConfig, CrudEntityState } from "../types";

/**
 * Hook genérico para gerenciar operações CRUD (Create, Read, Update, Delete)
 * Centraliza toda a lógica de estado e handlers que eram repetidos em cada tab
 * 
 * @template TEntity - Tipo da entidade (ex: Sport, Market, etc)
 * @template TDto - Tipo do DTO usado para criar/atualizar
 */
export function useCrudEntity<TEntity extends BaseEntity, TDto extends BaseDTO>(
  config: CrudConfig<TEntity, TDto>
): CrudEntityState<TEntity, TDto> {
  const { toast } = useToast();
  
  // Estados do dialog de create/edit
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<TEntity | null>(null);
  const [formData, setFormData] = useState<TDto>(config.initialFormData);
  
  // Estados do dialog de delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<TEntity | null>(null);

  /**
   * Handler para submissão do formulário (create ou update)
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingEntity) {
        await config.updateMutation.mutateAsync({ id: editingEntity.id, data: formData });
        toast({ title: config.successMessages.update });
      } else {
        await config.createMutation.mutateAsync(formData);
        toast({ title: config.successMessages.create });
      }
      handleCloseDialog();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || 
                     (editingEntity ? config.errorMessages.update : config.errorMessages.create),
        variant: "destructive",
      });
    }
  };

  /**
   * Handler para abrir o dialog de edição
   */
  const handleEdit = (entity: TEntity) => {
    setEditingEntity(entity);
    // Cria uma cópia do objeto para evitar mutação direta
    setFormData({ ...formData, ...entity } as TDto);
    setDialogOpen(true);
  };

  /**
   * Handler para confirmar a exclusão
   */
  const handleDelete = async () => {
    if (!entityToDelete) return;
    try {
      await config.deleteMutation.mutateAsync(entityToDelete.id);
      toast({ title: config.successMessages.delete });
      setDeleteDialogOpen(false);
      setEntityToDelete(null);
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.response?.data?.message || config.errorMessages.delete,
        variant: "destructive",
      });
    }
  };

  /**
   * Handler para fechar o dialog de create/edit
   */
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEntity(null);
    setFormData(config.initialFormData);
  };

  /**
   * Handler para abrir o dialog de confirmação de exclusão
   */
  const openDeleteDialog = (entity: TEntity) => {
    setEntityToDelete(entity);
    setDeleteDialogOpen(true);
  };

  return {
    // Estados
    dialogOpen,
    editingEntity,
    formData,
    deleteDialogOpen,
    entityToDelete,
    
    // Handlers
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCloseDialog,
    openDeleteDialog,
    setFormData,
    setDialogOpen,
  };
}
