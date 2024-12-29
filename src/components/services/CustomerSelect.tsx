import { Button } from "@/components/ui/button";
import { Customer } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, User, Mail, Phone, UserPlus } from "lucide-react";
import { useCustomers } from "@/contexts/CustomersContext";
import { useModals } from "@/contexts/ModalsContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CustomerSelectProps {
  selectedCustomer: Customer | null;
  onSelect: (customer: Customer) => void;
  onNext: () => void;
}

export function CustomerSelect({ selectedCustomer, onSelect, onNext }: CustomerSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { customers } = useCustomers();
  const { openCustomerForm } = useModals();

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleSelectCustomer = (customer: Customer) => {
    onSelect(customer);
    // Pequeno delay para dar feedback visual da seleção
    setTimeout(onNext, 200);
  };

  const handleNewCustomer = () => {
    openCustomerForm({
      onSuccess: (newCustomer) => {
        onSelect(newCustomer);
        setTimeout(onNext, 200);
      }
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Selecionar Cliente</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNewCustomer}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <Card
                    key={customer.id}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      selectedCustomer?.id === customer.id ? "border-primary" : ""
                    }`}
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{customer.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{customer.phone}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Nenhum cliente encontrado com os critérios de busca.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
