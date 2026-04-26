import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import {
  useSports,
  useChampionships,
  useCreateChampionship,
  useUpdateChampionship,
  useDeleteChampionship,
} from "@/services/queries";
import type { Championship, ChampionshipDTO } from "@/types";
import { useCrudEntity } from "../../hooks/useCrudEntity";
import { EntityTable } from "../EntityTable";
import { EntityDialog } from "../EntityDialog";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";

export function ChampionshipTab() {
  const { data: championships, isLoading } = useChampionships();
  const { data: sports } = useSports();
  const createChampionship = useCreateChampionship();
  const updateChampionship = useUpdateChampionship();
  const deleteChampionship = useDeleteChampionship();

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
  } = useCrudEntity<Championship, ChampionshipDTO>({
    entityName: "campeonato",
    entityNamePlural: "campeonatos",
    data: championships,
    isLoading,
    createMutation: createChampionship,
    updateMutation: updateChampionship,
    deleteMutation: deleteChampionship,
    initialFormData: { name: "", sportId: 0 },
    successMessages: {
      create: "Campeonato criado com sucesso!",
      update: "Campeonato atualizado com sucesso!",
      delete: "Campeonato excluído com sucesso!",
    },
    errorMessages: {
      create: "Erro ao criar campeonato",
      update: "Erro ao atualizar campeonato",
      delete: "Este campeonato está sendo usado em apostas",
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
            <CardTitle>Campeonatos</CardTitle>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Campeonato
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <EntityTable
            data={championships}
            columns={[
              { key: "name", label: "Nome" },
              { key: "sportName", label: "Esporte" },
            ]}
            emptyMessage="Nenhum campeonato cadastrado"
            onEdit={handleEdit}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      <EntityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingEntity ? "Editar Campeonato" : "Novo Campeonato"}
        formData={formData}
        onSubmit={handleSubmit}
        onCancel={handleCloseDialog}
        isPending={createChampionship.isPending || updateChampionship.isPending}
        isEditing={!!editingEntity}
      >
        <div className="space-y-2">
          <Label htmlFor="sport">Esporte</Label>
          <Select
            value={formData.sportId.toString()}
            onValueChange={(value) => setFormData({ ...formData, sportId: Number(value) })}
            required
          >
            <SelectTrigger id="sport">
              <SelectValue placeholder="Selecione o esporte" />
            </SelectTrigger>
            <SelectContent>
              {sports?.map((sport) => (
                <SelectItem key={sport.id} value={sport.id.toString()}>
                  {sport.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nome do Campeonato</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Brasileirão, NBA, Wimbledon"
            required
          />
        </div>
      </EntityDialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) handleCloseDialog();
        }}
        entityName="o campeonato"
        entityDisplayName={entityToDelete?.name || ""}
        onConfirm={handleDelete}
        onCancel={() => handleCloseDialog()}
        isPending={deleteChampionship.isPending}
      />
    </>
  );
}
