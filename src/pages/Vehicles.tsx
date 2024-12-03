import { useState } from "react";
import { VehicleForm } from "@/components/vehicles/VehicleForm";
import { VehicleTable } from "@/components/vehicles/VehicleTable";
import { VehicleDetails } from "@/components/vehicles/VehicleDetails";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Vehicle } from "@/types";
import { Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useVehicles } from "@/contexts/VehiclesContext";

export default function Vehicles() {
  const { toast } = useToast();
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, updateVehicleStatus } = useVehicles();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [vehicleToView, setVehicleToView] = useState<Vehicle | null>(null);

  const handleSubmit = (data: Omit<Vehicle, 'id' | 'updatedAt'>) => {
    if (selectedVehicle) {
      updateVehicle({
        ...selectedVehicle,
        ...data,
        id: data.plate, // Usar a placa como ID
        updatedAt: new Date().toISOString()
      });
      toast({
        title: "Veículo atualizado",
        description: "As informações do veículo foram atualizadas com sucesso.",
      });
    } else {
      // Verificar se já existe um veículo com essa placa
      const existingVehicle = vehicles.find(v => v.plate === data.plate);
      if (existingVehicle) {
        toast({
          title: "Erro",
          description: "Já existe um veículo cadastrado com essa placa.",
          variant: "destructive",
        });
        return;
      }

      addVehicle({
        ...data,
        id: data.plate, // Usar a placa como ID
        updatedAt: new Date().toISOString()
      });
      toast({
        title: "Veículo adicionado",
        description: "O veículo foi adicionado com sucesso.",
      });
    }
    setIsFormOpen(false);
    setSelectedVehicle(null);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleView = (vehicle: Vehicle) => {
    setVehicleToView(vehicle);
    setIsDetailsOpen(true);
  };

  const handleDelete = (id: string) => {
    const vehicle = vehicles.find(v => v.id === id);
    if (vehicle) {
      setVehicleToDelete(vehicle);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleStatusChange = (vehicleId: string, status: Vehicle['status']) => {
    updateVehicleStatus(vehicleId, status);
    toast({
      title: "Status atualizado",
      description: "O status do veículo foi atualizado com sucesso.",
    });
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      deleteVehicle(vehicleToDelete.id);
      toast({
        title: "Veículo excluído",
        description: "O veículo foi excluído com sucesso.",
      });
      setVehicleToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Veículos</h1>
          <Button onClick={() => {
            setSelectedVehicle(null);
            setIsFormOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Veículo
          </Button>
        </div>

        <VehicleTable
          vehicles={vehicles}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedVehicle ? "Editar Veículo" : "Novo Veículo"}
              </DialogTitle>
            </DialogHeader>
            <VehicleForm
              vehicle={selectedVehicle}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedVehicle(null);
              }}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Veículo</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o veículo {vehicleToDelete?.plate}? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setVehicleToDelete(null);
                setIsDeleteDialogOpen(false);
              }}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <VehicleDetails
          vehicle={vehicleToView}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      </div>
    </div>
  );
}