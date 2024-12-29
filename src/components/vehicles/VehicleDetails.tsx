import { Vehicle } from "@/types/vehicle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { vehicleStatusConfig } from "@/utils/statusUtils";
import { Badge } from "@/components/ui/badge";

interface VehicleDetailsProps {
  vehicle: Vehicle;
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
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-1">Tipo de Veículo</h4>
            <Badge variant="secondary">
              {vehicle.ownership === "company" ? "Veículo da Empresa" : "Veículo Próprio"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-1">Marca</h4>
              <p>{vehicle.brand}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Modelo</h4>
              <p>{vehicle.model}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-1">Ano</h4>
              <p>{vehicle.year}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Placa</h4>
              <p>{vehicle.plate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-1">Cor</h4>
              <p>{vehicle.color}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Categoria</h4>
              <p>{vehicle.category}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-1">Status</h4>
              <StatusBadge status={vehicle.status} config={vehicleStatusConfig} />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Blindado</h4>
              <Badge variant={vehicle.isArmored ? "secondary" : "outline"}>
                {vehicle.isArmored ? "Sim" : "Não"}
              </Badge>
            </div>
          </div>

          {vehicle.supplier && (
            <div>
              <h4 className="font-semibold mb-1">Fornecedor</h4>
              <p>{vehicle.supplier}</p>
            </div>
          )}

          {vehicle.mileage && (
            <div>
              <h4 className="font-semibold mb-1">Quilometragem</h4>
              <p>{vehicle.mileage.toLocaleString()} km</p>
            </div>
          )}

          {vehicle.maintenanceHistory && vehicle.maintenanceHistory.length > 0 && (
            <div>
              <h4 className="font-semibold mb-1">Histórico de Manutenção</h4>
              <div className="space-y-2">
                {vehicle.maintenanceHistory.map((maintenance, index) => (
                  <div key={index} className="border p-2 rounded">
                    <p><strong>Data:</strong> {new Date(maintenance.date).toLocaleDateString()}</p>
                    <p><strong>Descrição:</strong> {maintenance.description}</p>
                    <p><strong>Custo:</strong> {maintenance.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
