import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Driver } from "@/types/driver";
import { StatusBadge } from "@/components/ui/status-badge";
import { driverStatusConfig } from "@/utils/statusUtils";

interface DriverDetailsProps {
  driver: Driver;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DriverDetails({ driver, open, onOpenChange }: DriverDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do Motorista</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-1">Nome</h4>
              <p>{driver.name}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Status</h4>
              <StatusBadge status={driver.status} config={driverStatusConfig} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-1">CPF</h4>
              <p>{driver.cpf}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Telefone</h4>
              <p>{driver.phone}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-1">Email</h4>
            <p>{driver.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-1">CNH</h4>
              <p>{driver.cnh}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Categoria</h4>
              <p>{driver.cnhCategory}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-1">Vencimento da CNH</h4>
            <p>{new Date(driver.cnhExpiration).toLocaleDateString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
