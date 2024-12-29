import { useState, useCallback, useEffect } from "react";
import { DriverForm } from "@/components/drivers/DriverForm";
import { DriverTable } from "@/components/drivers/DriverTable";
import { DriverDetails } from "@/components/drivers/DriverDetails";
import { Driver, DriverStatus } from "@/types/driver";
import { useDrivers } from "@/contexts/DriversContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { Plus } from "lucide-react";
import { addMockDriversToStorage } from "@/data/mock-drivers";
import { differenceInYears } from "date-fns";

export default function Drivers() {
  const { toast } = useToast();
  const { drivers, addDriver, updateDriver, removeDriver, updateDriverStatus } = useDrivers();
  const [showForm, setShowForm] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);
  const [driverToView, setDriverToView] = useState<Driver | null>(null);

  // Métricas
  const totalDrivers = drivers.length;

  const getMostActiveDrivers = () => {
    return drivers
      .filter(driver => driver.activity?.totalTrips)
      .sort((a, b) => (b.activity?.totalTrips || 0) - (a.activity?.totalTrips || 0))
      .slice(0, 3)
      .map(driver => ({
        name: driver.name,
        trips: driver.activity?.totalTrips || 0
      }));
  };

  const getLeastActiveDrivers = () => {
    return drivers
      .filter(driver => driver.activity?.totalTrips !== undefined)
      .sort((a, b) => (a.activity?.totalTrips || 0) - (b.activity?.totalTrips || 0))
      .slice(0, 3)
      .map(driver => ({
        name: driver.name,
        trips: driver.activity?.totalTrips || 0
      }));
  };

  const getAverageAge = () => {
    const driversWithAge = drivers.filter(driver => driver.birthDate);
    if (driversWithAge.length === 0) return 0;

    const totalAge = driversWithAge.reduce((sum, driver) => {
      if (!driver.birthDate) return sum;
      return sum + differenceInYears(new Date(), new Date(driver.birthDate));
    }, 0);

    return Math.round(totalAge / driversWithAge.length);
  };

  // Renderização do dashboard
  const renderDashboard = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Motoristas</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDrivers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Motoristas Mais Ativos</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {getMostActiveDrivers().map((driver, index) => (
              <div key={index} className="text-sm">
                {driver.name}: {driver.trips} viagens
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Motoristas Menos Ativos</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {getLeastActiveDrivers().map((driver, index) => (
              <div key={index} className="text-sm">
                {driver.name}: {driver.trips} viagens
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Idade Média</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getAverageAge()} anos</div>
        </CardContent>
      </Card>
    </div>
  );

  useEffect(() => {
    addMockDriversToStorage();
  }, []);

  const handleSubmit = async (driverData: Omit<Driver, "id">) => {
    try {
      if (selectedDriver) {
        await updateDriver(selectedDriver.id, driverData);
        toast({
          title: "Sucesso",
          description: "Motorista atualizado com sucesso!",
        });
      } else {
        await addDriver(driverData);
        toast({
          title: "Sucesso",
          description: "Motorista adicionado com sucesso!",
        });
      }
      setShowForm(false);
      setSelectedDriver(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar o motorista",
        variant: "destructive",
      });
    }
  };

  const handleEdit = useCallback((driver: Driver) => {
    setSelectedDriver(driver);
    setShowForm(true);
  }, []);

  const handleView = useCallback((driver: Driver) => {
    setDriverToView(driver);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setDriverToDelete(id);
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (driverToDelete) {
      try {
        await removeDriver(driverToDelete);
        toast({
          title: "Sucesso",
          description: "Motorista excluído com sucesso!",
        });
        setShowDeleteDialog(false);
        setDriverToDelete(null);
      } catch (error) {
        toast({
          title: "Erro",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao excluir o motorista",
          variant: "destructive",
        });
      }
    }
  }, [driverToDelete, removeDriver, toast]);

  const handleUpdateStatus = useCallback(
    async (id: string, status: DriverStatus) => {
      try {
        await updateDriverStatus(id, status);
        const statusMessages = {
          active: "Motorista ativado com sucesso!",
          inactive: "Motorista inativado com sucesso!",
          suspended: "Motorista suspenso com sucesso!"
        };
        
        toast({
          title: "Status Atualizado",
          description: statusMessages[status],
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Erro ao Atualizar Status",
          description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o status do motorista",
          variant: "destructive",
        });
      }
    },
    [updateDriverStatus, toast]
  );

  return (
    <div className="container mx-auto py-6">
      {renderDashboard()}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Motoristas</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Motorista
        </Button>
      </div>

      <DriverTable
        drivers={drivers}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onUpdateStatus={handleUpdateStatus}
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDriver ? "Editar Motorista" : "Novo Motorista"}
            </DialogTitle>
          </DialogHeader>
          <DriverForm
            driver={selectedDriver}
            onSuccess={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedDriver(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este motorista? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {driverToView && (
        <DriverDetails
          driver={driverToView}
          open={true}
          onOpenChange={() => setDriverToView(null)}
        />
      )}
    </div>
  );
}