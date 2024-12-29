import { Vehicle, VehicleStatus, VehicleCategory } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash, Shield, Search, MoreHorizontal, Copy } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { vehicleStatusConfig } from "@/utils/statusUtils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VehicleForm } from "@/components/vehicles/VehicleForm";

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onView: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: VehicleStatus) => void;
  onDuplicate: (vehicle: Vehicle) => void;
}

export function VehicleTable({ 
  vehicles, 
  onEdit, 
  onView, 
  onDelete, 
  onUpdateStatus,
  onDuplicate 
}: VehicleTableProps) {
  const [searchPlate, setSearchPlate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const validVehicles = vehicles.filter(vehicle => 
    vehicle &&
    vehicle.id &&
    vehicle.plate &&
    vehicle.brand &&
    vehicle.model &&
    vehicle.year > 0 &&
    vehicle.category &&
    vehicle.status &&
    (!searchPlate || vehicle.plate.toLowerCase().includes(searchPlate.toLowerCase())) &&
    (selectedCategory === "all" || vehicle.category === selectedCategory)
  );

  const handleEditSuccess = (data: Partial<Vehicle>) => {
    // setIsEditModalOpen(false);
    // setSelectedVehicle(null);
    // setIsDuplicating(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por placa..."
            value={searchPlate}
            onChange={(e) => setSearchPlate(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            <SelectItem value="SUV">SUV</SelectItem>
            <SelectItem value="SEDAN">Sedan</SelectItem>
            <SelectItem value="MINIVAN">Minivan</SelectItem>
            <SelectItem value="VAN">Van</SelectItem>
            <SelectItem value="LUXO">Luxo</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.brand}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell>{vehicle.plate}</TableCell>
                <TableCell>{vehicle.color}</TableCell>
                <TableCell>{vehicle.category}</TableCell>
                <TableCell>{vehicle.supplier}</TableCell>
                <TableCell>
                  {vehicle.isArmored ? (
                    <Badge variant="secondary" className="gap-1">
                      <Shield className="h-3 w-3" />
                      Blindado
                    </Badge>
                  ) : (
                    <Badge variant="outline">Não</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Select
                    value={vehicle.status}
                    onValueChange={(value: VehicleStatus) => onUpdateStatus(vehicle.id, value)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue>
                        <StatusBadge status={vehicle.status} config={vehicleStatusConfig} />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(vehicleStatusConfig).map(([value, config]) => (
                        <SelectItem key={value} value={value}>
                          <StatusBadge status={value} config={vehicleStatusConfig} />
                        </SelectItem>
                      ))}
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
                    onClick={() => onDuplicate(vehicle)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(vehicle.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onEdit(vehicle)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDuplicate(vehicle)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(vehicle.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}