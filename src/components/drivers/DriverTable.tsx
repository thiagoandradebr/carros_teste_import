import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Driver, DriverStatus } from "@/types/driver";
import { driverStatusConfig } from "@/utils/statusUtils";
import { Eye, Edit, Trash, Search, MoreHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface DriverTableProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onView: (driver: Driver) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: DriverStatus) => void;
}

export function DriverTable({
  drivers,
  onEdit,
  onView,
  onDelete,
  onUpdateStatus,
}: DriverTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver &&
      (driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.cpf.includes(searchTerm) ||
        driver.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome, CPF ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>CNH</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>{driver.name}</TableCell>
                <TableCell>{driver.cpf}</TableCell>
                <TableCell>{driver.phone}</TableCell>
                <TableCell>{driver.cnh}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={driver.status}
                    onValueChange={(value: DriverStatus) => {
                      const element = document.getElementById(`status-${driver.id}`);
                      if (element) {
                        element.classList.add('status-updating');
                        setTimeout(() => {
                          onUpdateStatus(driver.id, value);
                          element.classList.remove('status-updating');
                        }, 150);
                      } else {
                        onUpdateStatus(driver.id, value);
                      }
                    }}
                  >
                    <SelectTrigger id={`status-${driver.id}`} className="w-[140px] transition-all duration-150">
                      <SelectValue>
                        <StatusBadge status={driver.status} config={driverStatusConfig} />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(driverStatusConfig).map(([value, config]) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={value} config={driverStatusConfig} />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(driver)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(driver)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(driver.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
