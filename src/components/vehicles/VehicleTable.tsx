import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash } from "lucide-react";
import { Vehicle, VehicleStatus } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onView: (vehicle: Vehicle) => void;
  onDelete: (plate: string) => void;
  onStatusChange: (vehicleId: string, status: VehicleStatus) => void;
}

export function VehicleTable({ vehicles, onEdit, onView, onDelete, onStatusChange }: VehicleTableProps) {
  // Filtra veículos inválidos
  const validVehicles = vehicles.filter(vehicle => 
    vehicle &&
    vehicle.id &&
    vehicle.plate &&
    vehicle.brand &&
    vehicle.model &&
    vehicle.year > 0 &&
    vehicle.category &&
    vehicle.status
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Marca</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Ano</TableHead>
            <TableHead>Placa</TableHead>
            <TableHead>Cor</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Blindado</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validVehicles.map((vehicle) => (
            <TableRow key={vehicle.plate}>
              <TableCell>{vehicle.brand}</TableCell>
              <TableCell>{vehicle.model}</TableCell>
              <TableCell>{vehicle.year}</TableCell>
              <TableCell>{vehicle.plate}</TableCell>
              <TableCell>{vehicle.color}</TableCell>
              <TableCell>{vehicle.category}</TableCell>
              <TableCell>{vehicle.supplier}</TableCell>
              <TableCell>
                {vehicle.isArmored ? (
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
                    Sim
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-50 text-gray-700">
                    Não
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Select
                  value={vehicle.status}
                  onValueChange={(value: VehicleStatus) => onStatusChange(vehicle.id, value)}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                        Disponível
                      </span>
                    </SelectItem>
                    <SelectItem value="rented">
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
                        Alugado
                      </span>
                    </SelectItem>
                    <SelectItem value="maintenance">
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700">
                        Manutenção
                      </span>
                    </SelectItem>
                    <SelectItem value="reserved">
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700">
                        Reservado
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(vehicle)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(vehicle)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(vehicle.plate)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}