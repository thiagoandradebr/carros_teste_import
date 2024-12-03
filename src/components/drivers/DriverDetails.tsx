import { Driver } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DriverDetailsProps {
  driver: Driver | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DriverDetails({ driver, open, onOpenChange }: DriverDetailsProps) {
  if (!driver) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do Motorista</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-sm text-gray-500">Nome</h3>
            <p className="mt-1">{driver.name}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">CPF</h3>
            <p className="mt-1">{driver.cpf}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">CNH</h3>
            <p className="mt-1">{driver.cnh}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">Validade CNH</h3>
            <p className="mt-1">{new Date(driver.cnhValidity).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">Pontos CNH</h3>
            <p className="mt-1">{driver.cnhPoints}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">Status</h3>
            <p className="mt-1 capitalize">{driver.status}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">Telefone</h3>
            <p className="mt-1">{driver.phone}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">Foto</h3>
            <p className="mt-1">{driver.photo || "Não cadastrada"}</p>
          </div>
          <div className="col-span-2">
            <h3 className="font-medium text-sm text-gray-500">Endereço</h3>
            <p className="mt-1">
              {driver.address.street}, {driver.address.number}
              {driver.address.complement && ` - ${driver.address.complement}`}
              <br />
              {driver.address.neighborhood} - CEP: {driver.address.cep}
              <br />
              {driver.address.city}/{driver.address.state}
            </p>
          </div>
          <div className="col-span-2">
            <h3 className="font-medium text-sm text-gray-500">Observações</h3>
            <p className="mt-1">{driver.notes || "Nenhuma observação"}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
