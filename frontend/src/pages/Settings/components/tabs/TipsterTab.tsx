import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import {
  useTipsters,
  useCreateTipster,
  useUpdateTipster,
  useDeleteTipster,
} from "@/services/queries";
import type { Tipster, TipsterDTO } from "@/types";
import { useCrudEntity } from "../../hooks/useCrudEntity";
import { EntityTable } from "../EntityTable";
import { EntityDialog } from "../EntityDialog";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";

export function TipsterTab() {
  const { data: tipsters, isLoading } = useTipsters();
  const createTipster = useCreateTipster();
  const updateTipster = useUpdateTipster();
  const deleteTipster = useDeleteTipster();

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
  } = useCrudEntity<Tipster, TipsterDTO>({
    entityName: "tipster",
    entityNamePlural: "tipsters",
    data: tipsters,
    isLoading,
    createMutation: createTipster,
    updateMutation: updateTipster,
    deleteMutation: deleteTipster,
    initialFormData: { name: "" },
    successMessages: {
      create: "Tipster criado com sucesso!",
      update: "Tipster atualizado com sucesso!",
      delete: "Tipster excluído com sucesso!",
    },
    errorMessages: {
      create: "Erro ao criar tipster",
      update: "Erro ao atualizar tipster",
      delete: "Este tipster está sendo usado em apostas",
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
            <CardTitle>Tipsters</CardTitle>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Tipster
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <EntityTable
            data={tipsters}
            columns={[{ key: "name", label: "Nome" }]}
            emptyMessage="Nenhum tipster cadastrado"
            onEdit={handleEdit}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      <EntityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingEntity ? "Editar Tipster" : "Novo Tipster"}
        formData={formData}
        onSubmit={handleSubmit}
        onCancel={handleCloseDialog}
        isPending={createTipster.isPending || updateTipster.isPending}
        isEditing={!!editingEntity}
      >
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Tipster</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            placeholder="Ex: João Silva, Profit Bets, Trading Pro"
            required
          />
        </div>
      </EntityDialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) handleCloseDialog();
        }}
        entityName="o tipster"
        entityDisplayName={entityToDelete?.name || ""}
        onConfirm={handleDelete}
        onCancel={() => handleCloseDialog()}
        isPending={deleteTipster.isPending}
      />
    </>
  );
}
