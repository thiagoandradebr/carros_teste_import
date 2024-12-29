import { useState, useCallback } from "react";
import { CustomerFormModal } from "@/components/customers/CustomerFormModal";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { CustomerDetails } from "@/components/customers/CustomerDetails";
import { CustomerDashboard } from "@/components/customers/CustomerDashboard";
import { useCustomers } from "@/contexts/CustomersContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Customer, CustomerStatus } from "@/types/customer";
import { customerStatusConfig } from "@/utils/statusUtils";
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

export default function Customers() {
  const { toast } = useToast();
  const { customers, addCustomer, updateCustomer, removeCustomer, updateCustomerStatus } = useCustomers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [customerToView, setCustomerToView] = useState<Customer | null>(null);

  const handleSubmit = async (customer: Customer) => {
    console.log("Iniciando handleSubmit", { customer, selectedCustomer });
    try {
      if (selectedCustomer) {
        updateCustomer(selectedCustomer.id, customer);
        toast({
          title: "Cliente atualizado",
          description: "As informações do cliente foram atualizadas com sucesso.",
        });
      } else {
        console.log("Adicionando novo cliente", customer);
        addCustomer(customer);
        toast({
          title: "Cliente adicionado",
          description: "O cliente foi adicionado com sucesso.",
        });
      }
      setIsFormOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados do cliente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDelete = (customerId: string) => {
    setCustomerToDelete(customerId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      removeCustomer(customerToDelete);
      toast({
        title: "Cliente removido",
        description: "O cliente foi removido com sucesso.",
      });
      setIsDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  const handleView = (customer: Customer) => {
    setCustomerToView(customer);
    setIsDetailsOpen(true);
  };

  const handleStatusChange = (customerId: string, status: CustomerStatus) => {
    updateCustomerStatus(customerId, status);
    toast({
      title: "Status atualizado",
      description: `O status do cliente foi alterado para ${customerStatusConfig[status].label}.`,
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <CustomerDashboard customers={customers} />

      <CustomerTable
        customers={customers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onStatusChange={handleStatusChange}
      />

      <CustomerFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        customer={selectedCustomer}
        mode={selectedCustomer ? "edit" : "create"}
      />

      <CustomerDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        customer={customerToView}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}