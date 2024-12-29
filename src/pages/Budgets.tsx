import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Budget, BudgetStatus, BudgetVehicle, Customer } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FileText, Filter, Plus, Search } from "lucide-react";
import { BudgetTable } from "@/components/budgets/BudgetTable";
import { useState, useMemo, useCallback } from "react";
import { useServices } from "@/contexts/ServicesContext";
import { useBudgets } from "@/contexts/BudgetsContext";
import { useCustomers } from "@/contexts/CustomersContext";
import { useVehicles } from "@/contexts/VehiclesContext"; // Importando o contexto de veículos
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, generateId } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BudgetVehicleForm } from "@/components/budgets/BudgetVehicleForm";
import { BudgetVehiclesTable } from "@/components/budgets/BudgetVehiclesTable";
import { BudgetSummary } from "@/components/budgets/BudgetSummary";
import { mockBudgets } from "@/mocks/budgets";
import { mockCustomers } from "@/mocks/customers";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { BudgetFormModal } from "@/components/budgets/BudgetFormModal";

interface Filters {
  search: string;
  status: BudgetStatus | "all";
  dateRange: "all" | "today" | "week" | "month";
  valueRange: "all" | "low" | "medium" | "high";
}

export default function Budgets() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { budgets, addBudget, updateBudget, updateBudgetStatus, deleteBudget } = useBudgets();
  const { convertBudgetToService } = useServices();
  const { customers } = useCustomers();
  const { vehicles } = useVehicles(); // Usando o contexto de veículos
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BudgetStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "all">("all");
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    dateRange: "all",
    valueRange: "all",
  });

  const selectedCustomer = customers.find(c => c.id === "");

  // Memoizando os filtros
  const filteredBudgets = useMemo(() => {
    return budgets.filter(budget => {
      const matchesSearch = budget.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        customers.find(c => c.id === budget.customerId)?.name.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = filters.status === "all" || budget.status === filters.status;
      
      let dateMatch = true;
      if (filters.dateRange !== "all") {
        const budgetDate = new Date(budget.createdAt);
        const today = new Date();
        const diffDays = Math.floor((today.getTime() - budgetDate.getTime()) / (1000 * 60 * 60 * 24));

        switch (filters.dateRange) {
          case "today":
            dateMatch = diffDays === 0;
            break;
          case "week":
            dateMatch = diffDays <= 7;
            break;
          case "month":
            dateMatch = diffDays <= 30;
            break;
        }
      }

      let valueMatch = true;
      if (filters.valueRange !== "all") {
        switch (filters.valueRange) {
          case "low":
            valueMatch = budget.totalAmount <= 1000;
            break;
          case "medium":
            valueMatch = budget.totalAmount > 1000 && budget.totalAmount <= 5000;
            break;
          case "high":
            valueMatch = budget.totalAmount > 5000;
            break;
        }
      }

      return matchesSearch && matchesStatus && dateMatch && valueMatch;
    });
  }, [budgets, filters, customers]);

  // Memoizando as estatísticas
  const stats = useMemo(() => ({
    total: filteredBudgets.length,
    approved: filteredBudgets.filter(b => b.status === "approved").length,
    pending: filteredBudgets.filter(b => b.status === "pending").length,
    rejected: filteredBudgets.filter(b => b.status === "rejected").length,
    totalValue: filteredBudgets.reduce((sum, b) => sum + b.totalAmount, 0),
  }), [filteredBudgets]);

  // Funções de manipulação memoizadas
  const handleCreateBudget = async (data: any) => {
    try {
      const newBudget: Budget = {
        id: generateId(),
        customerId: data.customerId,
        vehicles: [],
        status: "pending",
        totalAmount: 0,
        overtimeRule: data.overtimeRule,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [{
          id: generateId(),
          date: new Date().toISOString(),
          action: 'created',
          description: 'Orçamento criado',
          userId: 'u1',
        }],
      };

      // Processar cada veículo do orçamento
      data.vehicles.forEach((entry: any) => {
        const vehicleEntry: BudgetVehicle = {
          id: generateId(),
          vehicleId: entry.preRegisteredVehicleId || generateId(),
          vehicleName: entry.mode === "pre-registered" 
            ? vehicles.find(v => v.id === entry.preRegisteredVehicleId)?.brand + " " + vehicles.find(v => v.id === entry.preRegisteredVehicleId)?.model
            : `${entry.manualVehicle.brand} ${entry.manualVehicle.model}`,
          category: entry.mode === "pre-registered"
            ? vehicles.find(v => v.id === entry.preRegisteredVehicleId)?.category || "HATCH"
            : "HATCH",
          startDate: entry.startDate,
          endDate: entry.endDate,
          dailyRate: entry.value,
          totalDays: entry.totalDays,
          totalAmount: entry.totalAmount,
          serviceType: entry.serviceType,
        };

        newBudget.vehicles.push(vehicleEntry);
      });

      // Calcular o valor total do orçamento
      newBudget.totalAmount = newBudget.vehicles.reduce(
        (total, vehicle) => total + (vehicle.totalAmount || 0),
        0
      );

      addBudget(newBudget);
      
      toast({
        title: "Orçamento criado com sucesso",
        description: `Orçamento #${newBudget.id} criado com ${newBudget.vehicles.length} veículo(s)`,
      });

      setIsFormModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar orçamento:", error);
      toast({
        title: "Erro ao criar orçamento",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBudget = useCallback(async (id: string) => {
    try {
      const deletedBudget = budgets.find(b => b.id === id);
      if (!deletedBudget) return;

      deleteBudget(id);
      
      toast({
        title: "Orçamento removido",
        description: `Orçamento #${deletedBudget.id} foi removido`,
      });
    } catch (error) {
      toast({
        title: "Erro ao remover orçamento",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  }, [budgets, deleteBudget, toast]);

  const getVehicleCategory = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId); // Usando o contexto de veículos
    return vehicle?.category || "N/A";
  };

  const handleUpdateBudgetStatus = useCallback(async (budgetId: string, newStatus: BudgetStatus) => {
    try {
      const budget = budgets.find(b => b.id === budgetId);
      if (!budget) return;

      // Primeiro atualiza o status do orçamento
      updateBudgetStatus(budgetId, newStatus);
      
      // Se foi aprovado, então converte para serviço
      if (newStatus === 'approved') {
        const updatedBudget = { ...budget, status: newStatus };
        convertBudgetToService(updatedBudget);
      }
      
      toast({
        title: "Status atualizado com sucesso",
        description: `O orçamento #${budgetId} foi ${
          newStatus === 'approved'
            ? 'aprovado e convertido em serviço'
            : newStatus === 'rejected'
            ? 'rejeitado'
            : 'atualizado'
        }`,
      });
    } catch (error) {
      console.error('Error updating budget status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o status do orçamento.",
        variant: "destructive",
      });
    }
  }, [budgets, updateBudgetStatus, convertBudgetToService]);

  const handleEditBudget = (budget: Budget) => {
    setBudgetToEdit(budget);
    setIsFormModalOpen(true);
  };

  const handleUpdateBudget = async (data: any) => {
    try {
      const updatedBudget: Budget = {
        ...budgetToEdit!,
        customerId: data.customerId,
        vehicles: data.vehicles.map((entry: any) => ({
          id: entry.id,
          vehicleId: entry.preRegisteredVehicleId || entry.vehicleId,
          vehicleName: entry.mode === "pre-registered" 
            ? vehicles.find(v => v.id === entry.preRegisteredVehicleId)?.brand + " " + vehicles.find(v => v.id === entry.preRegisteredVehicleId)?.model
            : `${entry.manualVehicle.brand} ${entry.manualVehicle.model}`,
          category: entry.mode === "pre-registered"
            ? vehicles.find(v => v.id === entry.preRegisteredVehicleId)?.category || "HATCH"
            : "HATCH",
          startDate: entry.startDate,
          endDate: entry.endDate,
          dailyRate: entry.value,
          totalDays: entry.totalDays,
          totalAmount: entry.totalAmount,
          serviceType: entry.serviceType,
        })),
        totalAmount: data.vehicles.reduce((total: number, vehicle: any) => total + vehicle.totalAmount, 0),
        updatedAt: new Date().toISOString(),
        history: [
          ...budgetToEdit!.history,
          {
            id: generateId(),
            date: new Date().toISOString(),
            action: 'updated',
            description: 'Orçamento atualizado',
            userId: 'u1',
          }
        ],
      };

      updateBudget(updatedBudget);
      
      toast({
        title: "Orçamento atualizado com sucesso",
        description: `Orçamento #${updatedBudget.id} foi atualizado`,
      });

      setBudgetToEdit(null);
      setIsFormModalOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar orçamento:", error);
      toast({
        title: "Erro ao atualizar orçamento",
        description: "Ocorreu um erro ao atualizar o orçamento. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateBudget = (originalBudget: Budget) => {
    try {
      const newBudget: Budget = {
        ...originalBudget,
        id: generateId(),
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [{
          id: generateId(),
          date: new Date().toISOString(),
          action: 'created',
          description: 'Orçamento duplicado',
          userId: 'u1',
        }],
      };

      addBudget(newBudget);
      
      toast({
        title: "Orçamento duplicado com sucesso",
        description: `Orçamento #${newBudget.id} criado como cópia de #${originalBudget.id}`,
      });
    } catch (error) {
      console.error("Erro ao duplicar orçamento:", error);
      toast({
        title: "Erro ao duplicar orçamento",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = (data: any) => {
    if (budgetToEdit) {
      handleUpdateBudget(data);
    } else {
      handleCreateBudget(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orçamentos</h1>
        <Button onClick={() => setIsFormModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total de Orçamentos</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Aprovados</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Rejeitados</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Orçamentos */}
      <BudgetTable
        budgets={filteredBudgets}
        onDelete={(id) => {
          const budget = budgets.find(b => b.id === id);
          if (budget) {
            setBudgetToDelete(budget);
            setIsDeleteDialogOpen(true);
          }
        }}
        onUpdateStatus={handleUpdateBudgetStatus}
        onEdit={handleEditBudget}
        onDuplicate={handleDuplicateBudget}
        onNew={() => setIsFormModalOpen(true)}
      />

      <BudgetFormModal
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        onSubmit={handleFormSubmit}
        defaultValues={budgetToEdit}
        mode={budgetToEdit ? "edit" : "create"}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Orçamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o orçamento #{budgetToDelete?.id}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setBudgetToDelete(null);
              setIsDeleteDialogOpen(false);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (budgetToDelete) {
                  handleDeleteBudget(budgetToDelete.id);
                  setBudgetToDelete(null);
                }
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}