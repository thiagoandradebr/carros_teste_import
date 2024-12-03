import { useState } from "react";
import { v4 as uuid } from "uuid";
import { BudgetVehicle } from "@/types";
import { VehicleCategory } from "@/types/vehicle";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Car, DollarSign } from "lucide-react";
import { useVehicles } from "@/contexts/VehiclesContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface BudgetVehicleFormProps {
  onSubmit: (vehicle: BudgetVehicle) => void;
  onCancel: () => void;
}

export function BudgetVehicleForm({ onSubmit, onCancel }: BudgetVehicleFormProps) {
  const [vehicleName, setVehicleName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dailyRate, setDailyRate] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState<VehicleCategory>("HATCH");
  const [errors, setErrors] = useState<string[]>([]);

  const { addVehicle } = useVehicles();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!vehicleName) newErrors.push("Nome do veículo é obrigatório");
    if (!startDate) newErrors.push("Data inicial é obrigatória");
    if (!endDate) newErrors.push("Data final é obrigatória");
    if (dailyRate <= 0) newErrors.push("Valor da diária deve ser maior que zero");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // Calcula o total de dias
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Cria o veículo apenas se todos os campos estiverem preenchidos
    if (vehicleName && startDate && endDate && dailyRate > 0) {
      const vehicleId = uuid();

      const budgetVehicle: BudgetVehicle = {
        id: vehicleId,
        vehicleId,
        vehicleName,
        startDate,
        endDate,
        dailyRate,
        totalDays,
        totalAmount: totalDays * dailyRate,
        notes: notes || undefined
      };

      onSubmit(budgetVehicle);
      
      // Limpa o formulário
      setVehicleName("");
      setStartDate("");
      setEndDate("");
      setDailyRate(0);
      setNotes("");
      setCategory("HATCH");
      setErrors([]);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {errors.length > 0 && (
          <div className="bg-red-50 p-4 rounded-md mb-4">
            {errors.map((error, index) => (
              <p key={index} className="text-red-500">{error}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Primeira linha: Veículo, Categoria, Valor diárias */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Veículo</Label>
              <div className="relative">
                <Car className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="pl-8"
                  placeholder="Nome do veículo"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select 
                value={category} 
                onValueChange={(value) => setCategory(value as VehicleCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HATCH">Hatch</SelectItem>
                  <SelectItem value="SEDAN">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="LUXURY">Luxo</SelectItem>
                  <SelectItem value="TRUCK">Caminhonete</SelectItem>
                  <SelectItem value="MOTORCYCLE">Moto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Valor Diária</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(Number(e.target.value))}
                  className="pl-8"
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Segunda linha: Data Inicial, Data Final, Total de Diárias */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Data Inicial</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Data Final</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Total de Diárias</Label>
              <Input
                type="number"
                value={startDate && endDate ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          {/* Terceira linha: Observações */}
          <div className="space-y-1.5">
            <Label>Observações</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações adicionais sobre o veículo..."
              className="resize-none"
            />
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar Veículo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}