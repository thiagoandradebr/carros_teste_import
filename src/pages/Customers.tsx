import { useState } from "react";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { CustomerDetails } from "@/components/customers/CustomerDetails";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Customer } from "@/types";
import { Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCustomers } from "@/contexts/CustomersContext";

export default function Customers() {
  const { toast } = useToast();
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [customerToView, setCustomerToView] = useState<Customer | null>(null);

  const handleSubmit = (customer: Customer) => {
    if (selectedCustomer) {
      updateCustomer(customer);
      toast({
        title: "Cliente atualizado",
        description: "As informações do cliente foram atualizadas com sucesso.",
      });
    } else {
      addCustomer(customer);
      toast({
        title: "Cliente adicionado",
        description: "O cliente foi adicionado com sucesso.",
      });
    }
    setIsFormOpen(false);
    setSelectedCustomer(null);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleView = (customer: Customer) => {
    setCustomerToView(customer);
    setIsDetailsOpen(true);
  };

  const handleDelete = (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      setCustomerToDelete(customer);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete.id);
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso.",
      });
      setCustomerToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Clientes</h1>
          <Button onClick={() => {
            setSelectedCustomer(null);
            setIsFormOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        <CustomerTable
          customers={customers}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedCustomer ? "Editar Cliente" : "Novo Cliente"}
              </DialogTitle>
            </DialogHeader>
            <CustomerForm
              customer={selectedCustomer}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedCustomer(null);
              }}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Cliente</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o cliente {customerToDelete?.name}? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setCustomerToDelete(null);
                setIsDeleteDialogOpen(false);
              }}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <CustomerDetails
          customer={customerToView}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      </div>
    </div>
  );
}