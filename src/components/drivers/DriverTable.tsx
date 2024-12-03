import { Driver } from "@/types";
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

interface DriverTableProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onView: (driver: Driver) => void;
  onDelete: (id: string) => void;
}

export function DriverTable({ drivers, onEdit, onView, onDelete }: DriverTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>CNH</TableHead>
            <TableHead>Validade CNH</TableHead>
            <TableHead>Pontos CNH</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow key={driver.id}>
              <TableCell>{driver.name}</TableCell>
              <TableCell>{driver.cpf}</TableCell>
              <TableCell>{driver.cnh}</TableCell>
              <TableCell>{new Date(driver.cnhValidity).toLocaleDateString()}</TableCell>
              <TableCell>{driver.cnhPoints}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  driver.status === 'active' ? 'bg-green-50 text-green-700' :
                  driver.status === 'inactive' ? 'bg-gray-50 text-gray-700' :
                  driver.status === 'training' ? 'bg-blue-50 text-blue-700' :
                  'bg-yellow-50 text-yellow-700'
                }`}>
                  {driver.status === 'active' ? 'Ativo' :
                   driver.status === 'inactive' ? 'Inativo' :
                   driver.status === 'training' ? 'Em Treinamento' :
                   'Suspenso'}
                </span>
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
  );
}
