import { Vehicle } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VehicleDetailsProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VehicleDetails({ vehicle, open, onOpenChange }: VehicleDetailsProps) {
  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do Veículo</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Marca</h4>
            <p className="text-sm">{vehicle.brand}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Modelo</h4>
            <p className="text-sm">{vehicle.model}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Ano</h4>
            <p className="text-sm">{vehicle.year}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Placa</h4>
            <p className="text-sm">{vehicle.plate}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Cor</h4>
            <p className="text-sm">{vehicle.color}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Categoria</h4>
            <p className="text-sm">{vehicle.category}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Fornecedor</h4>
            <p className="text-sm">{vehicle.supplier}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Quilometragem</h4>
            <p className="text-sm">{vehicle.mileage?.toLocaleString() || 'Não informada'}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Blindado</h4>
            <p className="text-sm">{vehicle.isArmored ? 'Sim' : 'Não'}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
            <p className="text-sm">
              {vehicle.status === 'available' && 'Disponível'}
              {vehicle.status === 'rented' && 'Alugado'}
              {vehicle.status === 'maintenance' && 'Em Manutenção'}
              {vehicle.status === 'reserved' && 'Reservado'}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground">Diária</h4>
            <p className="text-sm">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(vehicle.dailyRate)}
            </p>
          </div>
          {vehicle.notes && (
            <div className="col-span-2">
              <h4 className="font-medium text-sm text-muted-foreground">Observações</h4>
              <p className="text-sm">{vehicle.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
