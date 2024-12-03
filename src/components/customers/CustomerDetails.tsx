import { Customer } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomerDetailsProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDetails({ customer, open, onOpenChange }: CustomerDetailsProps) {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-sm text-gray-500">Nome</h3>
            <p className="mt-1">{customer.name}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">Documento</h3>
            <p className="mt-1">{customer.document}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">Email</h3>
            <p className="mt-1">{customer.email}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">Telefone</h3>
            <p className="mt-1">{customer.phone}</p>
          </div>
          <div className="col-span-2">
            <h3 className="font-medium text-sm text-gray-500">Endereço</h3>
            <p className="mt-1">
              {customer.address.street}, {customer.address.number}
              {customer.address.complement && ` - ${customer.address.complement}`}
              <br />
              {customer.address.neighborhood} - CEP: {customer.address.cep}
              <br />
              {customer.address.city}/{customer.address.state}
            </p>
          </div>
          <div className="col-span-2">
            <h3 className="font-medium text-sm text-gray-500">Observações</h3>
            <p className="mt-1">{customer.notes || "Nenhuma observação"}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
