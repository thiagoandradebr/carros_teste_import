import { useState } from "react";
import { VehicleTable } from "@/components/vehicles/VehicleTable";
import { VehicleDetails } from "@/components/vehicles/VehicleDetails";
import { useVehicles } from "@/contexts/VehiclesContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Vehicle, VehicleStatus, NewVehicle } from "@/types/vehicle";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleForm } from "@/components/vehicles/VehicleForm";

export default function Vehicles() {
  const { toast } = useToast();
  const { vehicles, addVehicle, updateVehicle, removeVehicle, updateVehicleStatus } = useVehicles();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [vehicleToView, setVehicleToView] = useState<Vehicle | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  
  // Filtros
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [plateFilter, setPlateFilter] = useState("");

  // Métricas
  const totalVehicles = vehicles.length;
  const averageKm = vehicles.length > 0
    ? Math.round(vehicles.reduce((acc, v) => acc + (v.mileage || 0), 0) / vehicles.length)
    : 0;

  // Ordenar veículos por número de aluguéis
  const sortedByRentals = [...vehicles].sort((a, b) => 
    (b.rentals?.length || 0) - (a.rentals?.length || 0)
  );

  const mostRented = sortedByRentals[0];
  const leastRented = sortedByRentals[sortedByRentals.length - 1];

  // Filtragem
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesCategory = categoryFilter === "all" || vehicle.category === categoryFilter;
    const matchesPlate = !plateFilter || 
      vehicle.plate.toLowerCase().includes(plateFilter.toLowerCase());
    return matchesCategory && matchesPlate;
  });

  const handleSubmit = (vehicleData: NewVehicle) => {
    if (isDuplicating) {
      const newVehicle: NewVehicle = {
        ...vehicleData,
        documents: [],
        photos: [],
        rentalHistory: [],
        rentals: [],
        maintenanceHistory: []
      };
      addVehicle(newVehicle);
      toast({
        title: "Veículo duplicado",
        description: "O veículo foi duplicado com sucesso.",
      });
    } else if (selectedVehicle) {
      updateVehicle(selectedVehicle.id, vehicleData);
      toast({
        title: "Veículo atualizado",
        description: "As informações do veículo foram atualizadas com sucesso.",
      });
    } else {
      const newVehicle: NewVehicle = {
        ...vehicleData,
        documents: [],
        photos: [],
        rentalHistory: [],
        rentals: [],
        maintenanceHistory: []
      };
      addVehicle(newVehicle);
      toast({
        title: "Veículo adicionado",
        description: "O veículo foi adicionado com sucesso.",
      });
    }
    setIsFormOpen(false);
    setSelectedVehicle(null);
    setIsDuplicating(false);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDuplicating(false);
    setIsFormOpen(true);
  };

  const handleDelete = (vehicleId: string) => {
    setVehicleToDelete(vehicleId);
    setIsDeleteDialogOpen(true);
  };

  const handleDuplicate = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDuplicating(true);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      removeVehicle(vehicleToDelete);
      toast({
        title: "Veículo removido",
        description: "O veículo foi removido com sucesso.",
      });
      setIsDeleteDialogOpen(false);
      setVehicleToDelete(null);
    }
  };

  const handleView = (vehicle: Vehicle) => {
    setVehicleToView(vehicle);
    setIsDetailsOpen(true);
  };

  const handleUpdateStatus = (id: string, status: VehicleStatus) => {
    updateVehicleStatus(id, status);
    toast({
      title: "Status atualizado",
      description: "O status do veículo foi atualizado com sucesso.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Veículos</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Veículo
        </Button>
      </div>

      {/* Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quilometragem Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageKm.toLocaleString()} km</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículo Mais Alugado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostRented?.model || "N/A"}</div>
            <p className="text-xs text-muted-foreground">
              {mostRented ? `${mostRented.rentals?.length || 0} aluguéis` : "Nenhum aluguel"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veículo Menos Alugado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leastRented?.model || "N/A"}</div>
            <p className="text-xs text-muted-foreground">
              {leastRented ? `${leastRented.rentals?.length || 0} aluguéis` : "Nenhum aluguel"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="w-[200px]">
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
              <SelectItem value="SEDAN">Sedan</SelectItem>
              <SelectItem value="MINIVAN">Minivan</SelectItem>
              <SelectItem value="VAN">Van</SelectItem>
              <SelectItem value="LUXO">Luxo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-[200px]">
          <Input
            placeholder="Buscar por placa"
            value={plateFilter}
            onChange={(e) => setPlateFilter(e.target.value)}
          />
        </div>
      </div>

      <VehicleTable
        vehicles={filteredVehicles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onUpdateStatus={handleUpdateStatus}
        onDuplicate={handleDuplicate}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {isDuplicating ? "Duplicar Veículo" : selectedVehicle ? "Editar Veículo" : "Novo Veículo"}
            </DialogTitle>
          </DialogHeader>
          <VehicleForm
            vehicle={selectedVehicle || undefined}
            onSuccess={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedVehicle(null);
              setIsDuplicating(false);
            }}
            isDuplicating={isDuplicating}
          />
        </DialogContent>
      </Dialog>

      <VehicleDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        vehicle={vehicleToView}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}