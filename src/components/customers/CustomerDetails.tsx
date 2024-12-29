import { Customer } from "@/types/customer";
import { formatCPFCNPJ, formatPhone, getWhatsAppLink, getCountryFromPhone } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

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
            <h3 className="font-medium text-sm text-gray-500">Tipo</h3>
            <p className="mt-1">{customer.type === 'pj' ? 'Pessoa Jurídica' : 'Pessoa Física'}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">
              {customer.type === 'pj' ? 'Razão Social' : 'Nome'}
            </h3>
            <p className="mt-1">{customer.name}</p>
          </div>
          
          {customer.type === 'pj' && (
            <>
              <div>
                <h3 className="font-medium text-sm text-gray-500">Nome Fantasia</h3>
                <p className="mt-1">{customer.tradingName || '-'}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-500">Representante Legal</h3>
                <p className="mt-1">{customer.representative || '-'}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-500">Inscrição Estadual</h3>
                <p className="mt-1">{customer.stateRegistration || '-'}</p>
              </div>
            </>
          )}

          <div>
            <h3 className="font-medium text-sm text-gray-500">
              {customer.type === 'pj' ? 'CNPJ' : 'CPF'}
            </h3>
            <p className="mt-1">{formatCPFCNPJ(customer.document)}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">Email</h3>
            <p className="mt-1">{customer.email}</p>
          </div>
          <div className="col-span-2">
            <h3 className="font-medium text-sm text-gray-500">Telefone</h3>
            <div className="flex items-center gap-2">
              <ReactCountryFlag
                countryCode={getCountryFromPhone(customer.phone)}
                svg
                style={{
                  width: '1.2em',
                  height: '1.2em',
                }}
              />
              <p className="text-sm font-medium">{formatPhone(customer.phone)}</p>
              <a
                href={getWhatsAppLink(customer.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700"
              >
                <MessageCircle className="text-green-600 hover:text-green-700" size={20} />
              </a>
            </div>
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
