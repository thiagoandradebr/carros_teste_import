import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Service, Customer, Vehicle, BudgetVehicle } from "@/types";
import { mockCustomers } from "@/mocks/customers";
import { mockVehicles } from "@/mocks/vehicles";
import { formatCurrency } from "@/lib/utils";

interface ServiceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (service: Partial<Service>) => void;
  initialData?: Service;
}

export function ServiceForm({
  open,
  onClose,
  onSubmit,
  initialData,
}: ServiceFormProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    initialData?.customerId || ""
  );
  const [vehicles, setVehicles] = useState<BudgetVehicle[]>(
    initialData?.vehicles || []
  );
  const [selectedVehicle, setSelectedVehicle] = useState<{
    vehicleId: string;
    startDate: string;
    endDate: string;
    dailyRate: number;
  }>({
    vehicleId: "",
    startDate: "",
    endDate: "",
    dailyRate: 0,
  });

  const calculateTotalDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleAddVehicle = () => {
    if (
      !selectedVehicle.vehicleId ||
      !selectedVehicle.startDate ||
      !selectedVehicle.endDate ||
      !selectedVehicle.dailyRate
    )
      return;

    const totalDays = calculateTotalDays(
      selectedVehicle.startDate,
      selectedVehicle.endDate
    );

    const newVehicle: BudgetVehicle = {
      id: `v${Date.now()}`,
      vehicleId: selectedVehicle.vehicleId,
      startDate: selectedVehicle.startDate,
      endDate: selectedVehicle.endDate,
      dailyRate: selectedVehicle.dailyRate,
      totalDays,
      totalAmount: totalDays * selectedVehicle.dailyRate,
      notes: "",
    };

    setVehicles((prev) => [...prev, newVehicle]);
    setSelectedVehicle({
      vehicleId: "",
      startDate: "",
      endDate: "",
      dailyRate: 0,
    });
  };

  const handleRemoveVehicle = (vehicleId: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
  };

  const handleSubmit = () => {
    if (!selectedCustomerId || vehicles.length === 0) return;

    const totalAmount = vehicles.reduce((acc, v) => acc + v.totalAmount, 0);

    const service: Partial<Service> = {
      id: initialData?.id || `s${Date.now()}`,
      customerId: selectedCustomerId,
      vehicles,
      status: initialData?.status || "pending",
      extraCosts: initialData?.extraCosts || [],
      subtotalAmount: totalAmount,
      extraCostsAmount: initialData?.extraCostsAmount || 0,
      totalAmount,
      history: [
        ...(initialData?.history || []),
        {
          id: `h${Date.now()}`,
          date: new Date().toISOString(),
          action: initialData ? "updated" : "created",
          description: initialData
            ? "Serviço atualizado"
            : "Serviço criado manualmente",
          userId: "u1",
        },
      ],
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(service);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Serviço" : "Novo Serviço"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <label className="font-medium">Cliente</label>
            <Select
              value={selectedCustomerId}
              onValueChange={setSelectedCustomerId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {mockCustomers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            <div className="font-medium">Adicionar Veículo</div>
            <div className="grid grid-cols-5 gap-2">
              <Select
                value={selectedVehicle.vehicleId}
                onValueChange={(value) =>
                  setSelectedVehicle({ ...selectedVehicle, vehicleId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Veículo" />
                </SelectTrigger>
                <SelectContent>
                  {mockVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.model} - {vehicle.plate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={selectedVehicle.startDate}
                onChange={(e) =>
                  setSelectedVehicle({
                    ...selectedVehicle,
                    startDate: e.target.value,
                  })
                }
              />

              <Input
                type="date"
                value={selectedVehicle.endDate}
                onChange={(e) =>
                  setSelectedVehicle({
                    ...selectedVehicle,
                    endDate: e.target.value,
                  })
                }
              />

              <Input
                type="number"
                placeholder="Diária"
                value={selectedVehicle.dailyRate}
                onChange={(e) =>
                  setSelectedVehicle({
                    ...selectedVehicle,
                    dailyRate: Number(e.target.value),
                  })
                }
              />

              <Button onClick={handleAddVehicle}>Adicionar</Button>
            </div>
          </div>

          {vehicles.length > 0 && (
            <div className="grid gap-2">
              <div className="font-medium">Veículos Selecionados</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Fim</TableHead>
                    <TableHead>Diária</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => {
                    const vehicleDetails = mockVehicles.find(
                      (v) => v.id === vehicle.vehicleId
                    );
                    return (
                      <TableRow key={vehicle.id}>
                        <TableCell>
                          {vehicleDetails
                            ? `${vehicleDetails.model} - ${vehicleDetails.plate}`
                            : vehicle.vehicleId}
                        </TableCell>
                        <TableCell>
                          {new Date(vehicle.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(vehicle.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{formatCurrency(vehicle.dailyRate)}</TableCell>
                        <TableCell>{formatCurrency(vehicle.totalAmount)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVehicle(vehicle.id)}
                          >
                            Remover
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {initialData ? "Atualizar" : "Criar"} Serviço
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
