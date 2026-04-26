import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import {
  useBookmakers,
  useCreateBookmaker,
  useUpdateBookmaker,
  useDeleteBookmaker,
} from "@/services/queries";
import type { Bookmaker, BookmakerDTO } from "@/types";
import { useCrudEntity } from "../../hooks/useCrudEntity";
import { EntityTable } from "../EntityTable";
import { EntityDialog } from "../EntityDialog";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";

export function BookmakerTab() {
  const { data: bookmakers, isLoading } = useBookmakers();
  const createBookmaker = useCreateBookmaker();
  const updateBookmaker = useUpdateBookmaker();
  const deleteBookmaker = useDeleteBookmaker();

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
  } = useCrudEntity<Bookmaker, BookmakerDTO>({
    entityName: "casa de aposta",
    entityNamePlural: "casas de apostas",
    data: bookmakers,
    isLoading,
    createMutation: createBookmaker,
    updateMutation: updateBookmaker,
    deleteMutation: deleteBookmaker,
    initialFormData: { name: "" },
    successMessages: {
      create: "Casa de aposta criada com sucesso!",
      update: "Casa de aposta atualizada com sucesso!",
      delete: "Casa de aposta excluída com sucesso!",
    },
    errorMessages: {
      create: "Erro ao criar casa de aposta",
      update: "Erro ao atualizar casa de aposta",
      delete: "Esta casa de aposta está sendo usada em apostas",
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
            <CardTitle>Casas de Apostas</CardTitle>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Casa de Aposta
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <EntityTable
            data={bookmakers}
            columns={[{ key: "name", label: "Nome" }]}
            emptyMessage="Nenhuma casa de aposta cadastrada"
            onEdit={handleEdit}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      <EntityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingEntity ? "Editar Casa de Aposta" : "Nova Casa de Aposta"}
        formData={formData}
        onSubmit={handleSubmit}
        onCancel={handleCloseDialog}
        isPending={createBookmaker.isPending || updateBookmaker.isPending}
        isEditing={!!editingEntity}
      >
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Casa de Aposta</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            placeholder="Ex: Bet365, Betano, KTO"
            required
          />
        </div>
      </EntityDialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) handleCloseDialog();
        }}
        entityName="a casa de aposta"
        entityDisplayName={entityToDelete?.name || ""}
        onConfirm={handleDelete}
        onCancel={() => handleCloseDialog()}
        isPending={deleteBookmaker.isPending}
      />
    </>
  );
}
