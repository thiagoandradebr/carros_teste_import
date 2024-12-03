import { useState } from "react";
import { DriverForm } from "@/components/drivers/DriverForm";
import { DriverTable } from "@/components/drivers/DriverTable";
import { DriverDetails } from "@/components/drivers/DriverDetails";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Driver } from "@/types";
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
import { useDrivers } from "@/contexts/DriversContext";

export default function Drivers() {
  const { toast } = useToast();
  const { drivers, addDriver, updateDriver, deleteDriver } = useDrivers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);
  const [driverToView, setDriverToView] = useState<Driver | null>(null);

  const handleSubmit = (driver: Driver) => {
    if (selectedDriver) {
      updateDriver(driver);
      toast({
        title: "Motorista atualizado",
        description: "As informações do motorista foram atualizadas com sucesso.",
      });
    } else {
      addDriver(driver);
      toast({
        title: "Motorista adicionado",
        description: "O motorista foi adicionado com sucesso.",
      });
    }
    setIsFormOpen(false);
    setSelectedDriver(null);
  };

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsFormOpen(true);
  };

  const handleView = (driver: Driver) => {
    setDriverToView(driver);
    setIsDetailsOpen(true);
  };

  const handleDelete = (id: string) => {
    const driver = drivers.find(d => d.id === id);
    if (driver) {
      setDriverToDelete(driver);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    if (driverToDelete) {
      deleteDriver(driverToDelete.id);
      toast({
        title: "Motorista excluído",
        description: "O motorista foi excluído com sucesso.",
      });
      setDriverToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Motoristas</h1>
          <Button onClick={() => {
            setSelectedDriver(null);
            setIsFormOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Motorista
          </Button>
        </div>

        <DriverTable
          drivers={drivers}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedDriver ? "Editar Motorista" : "Novo Motorista"}
              </DialogTitle>
            </DialogHeader>
            <DriverForm
              driver={selectedDriver}
              onSuccess={() => {
                setIsFormOpen(false);
                setSelectedDriver(null);
              }}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Motorista</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o motorista {driverToDelete?.name}? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setDriverToDelete(null);
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

        <DriverDetails
          driver={driverToView}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      </div>
    </div>
  );
}