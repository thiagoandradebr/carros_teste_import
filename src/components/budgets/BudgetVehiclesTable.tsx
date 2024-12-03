import { BudgetVehicle } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Car } from "lucide-react";

interface BudgetVehiclesTableProps {
  vehicles: BudgetVehicle[];
  onDelete: (index: number) => void;
}

export function BudgetVehiclesTable({ vehicles, onDelete }: BudgetVehiclesTableProps) {
  // Filtra veículos inválidos
  const validVehicles = vehicles.filter(vehicle => 
    vehicle && 
    vehicle.id && 
    vehicle.vehicleName && 
    vehicle.startDate && 
    vehicle.endDate && 
    vehicle.dailyRate > 0
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Veículo</TableHead>
            <TableHead>Data Início</TableHead>
            <TableHead>Data Fim</TableHead>
            <TableHead>Valor Diária</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validVehicles.map((vehicle, index) => (
            <TableRow key={vehicle.id}>
              <TableCell>{vehicle.vehicleName}</TableCell>
              <TableCell>
                {format(new Date(vehicle.startDate), "dd 'de' MMMM", { locale: ptBR })}
              </TableCell>
              <TableCell>
                {format(new Date(vehicle.endDate), "dd 'de' MMMM", { locale: ptBR })}
              </TableCell>
              <TableCell>{formatCurrency(vehicle.dailyRate)}</TableCell>
              <TableCell>{formatCurrency(vehicle.totalAmount)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {validVehicles.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Car className="h-8 w-8" />
                  <p>Nenhum veículo adicionado ao orçamento</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}