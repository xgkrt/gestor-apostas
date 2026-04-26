import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import {
  useSports,
  useCreateSport,
  useUpdateSport,
  useDeleteSport,
} from "@/services/queries";
import type { Sport, SportDTO } from "@/types";
import { useCrudEntity } from "../../hooks/useCrudEntity";
import { EntityTable } from "../EntityTable";
import { EntityDialog } from "../EntityDialog";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";

export function SportTab() {
  const { data: sports, isLoading } = useSports();
  const createSport = useCreateSport();
  const updateSport = useUpdateSport();
  const deleteSport = useDeleteSport();

  const {
    dialogOpen,
    editingEntity,
    formData,
    deleteDialogOpen,
    entityToDelete,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCloseDialog,
    openDeleteDialog,
    setFormData,
    setDialogOpen,
  } = useCrudEntity<Sport, SportDTO>({
    entityName: "esporte",
    entityNamePlural: "esportes",
    data: sports,
    isLoading,
    createMutation: createSport,
    updateMutation: updateSport,
    deleteMutation: deleteSport,
    initialFormData: { name: "" },
    successMessages: {
      create: "Esporte criado com sucesso!",
      update: "Esporte atualizado com sucesso!",
      delete: "Esporte excluído com sucesso!",
    },
    errorMessages: {
      create: "Erro ao criar esporte",
      update: "Erro ao atualizar esporte",
      delete: "Este esporte está sendo usado em apostas",
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Esportes</CardTitle>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Esporte
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <EntityTable
            data={sports}
            columns={[{ key: "name", label: "Nome" }]}
            emptyMessage="Nenhum esporte cadastrado"
            onEdit={handleEdit}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      <EntityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingEntity ? "Editar Esporte" : "Novo Esporte"}
        formData={formData}
        onSubmit={handleSubmit}
        onCancel={handleCloseDialog}
        isPending={createSport.isPending || updateSport.isPending}
        isEditing={!!editingEntity}
      >
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Esporte</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            placeholder="Ex: Futebol, Basquete, Tênis"
            required
          />
        </div>
      </EntityDialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) handleCloseDialog();
        }}
        entityName="o esporte"
        entityDisplayName={entityToDelete?.name || ""}
        onConfirm={handleDelete}
        onCancel={() => handleCloseDialog()}
        isPending={deleteSport.isPending}
      />
    </>
  );
}
