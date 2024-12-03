import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Budget, BudgetStatus, BudgetVehicle, Customer } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FileText, Filter, Plus, Search } from "lucide-react";
import { BudgetTable } from "@/components/budgets/BudgetTable";
import { mockVehicles } from "@/mocks/vehicles";
import { useState } from "react";
import { useServices } from "@/contexts/ServicesContext";
import { useBudgets } from "@/contexts/BudgetsContext";
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

export default function Budgets() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { budgets, addBudget, updateBudget, deleteBudget } = useBudgets();
  const { convertBudgetToService } = useServices();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
  const [currentVehicles, setCurrentVehicles] = useState<BudgetVehicle[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BudgetStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "all">("all");

  const { data: customers = mockCustomers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => mockCustomers,
  });

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Filtragem de orçamentos
  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customers.find(c => c.id === budget.customerId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || budget.status === statusFilter;
    
    const budgetDate = new Date(budget.createdAt);
    const today = new Date();
    const isToday = budgetDate.toDateString() === today.toDateString();
    const isThisWeek = budgetDate >= new Date(today.setDate(today.getDate() - 7));
    const isThisMonth = budgetDate.getMonth() === today.getMonth() && budgetDate.getFullYear() === today.getFullYear();
    
    const matchesDate = dateFilter === "all" ||
      (dateFilter === "today" && isToday) ||
      (dateFilter === "week" && isThisWeek) ||
      (dateFilter === "month" && isThisMonth);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Estatísticas
  const stats = {
    total: filteredBudgets.length,
    approved: filteredBudgets.filter(b => b.status === "approved").length,
    pending: filteredBudgets.filter(b => b.status === "pending").length,
    rejected: filteredBudgets.filter(b => b.status === "rejected").length,
    totalValue: filteredBudgets.reduce((sum, b) => sum + b.totalAmount, 0),
  };

  const getVehicleCategory = (vehicleId: string) => {
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    return vehicle?.category || "N/A";
  };

  const handleCreateBudget = () => {
    setEditingBudget(null);
    setCurrentVehicles([]);
    setSelectedCustomerId("");
    setIsDialogOpen(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setCurrentVehicles(budget.vehicles?.filter(v => v && v.id && v.vehicleName) || []);
    setSelectedCustomerId(budget.customerId || "");
    setIsDialogOpen(true);
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      const deletedBudget = budgets.find(b => b.id === id);
      if (!deletedBudget) return;

      deleteBudget(id);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Orçamento excluído com sucesso",
        description: `Orçamento #${deletedBudget.id} foi removido`,
      });
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error);
      toast({
        title: "Erro ao excluir orçamento",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  const handleSubmitVehicle = async (data: BudgetVehicle) => {
    try {
      // Valida se o veículo é válido antes de adicionar
      if (!data || !data.id || !data.vehicleName) {
        throw new Error("Dados do veículo inválidos");
      }

      const updatedVehicles = [...currentVehicles, data].filter(v => v && v.id && v.vehicleName);
      setCurrentVehicles(updatedVehicles);

      const totalAmount = updatedVehicles.reduce(
        (sum, vehicle) => sum + vehicle.totalAmount,
        0
      );

      const now = new Date().toISOString();
      const updatedBudget: Budget = editingBudget
        ? {
            ...editingBudget,
            vehicles: updatedVehicles,
            totalAmount,
            customerId: selectedCustomerId,
            updatedAt: now,
            history: [
              ...editingBudget.history,
              {
                id: generateId(),
                date: now,
                action: "vehicle_added",
                description: `Veículo ${getVehicleCategory(data.vehicleId)} adicionado ao orçamento`,
                userId: "u1"
              }
            ]
          }
        : {
            id: generateId(),
            vehicles: updatedVehicles,
            totalAmount,
            customerId: selectedCustomerId,
            status: "draft",
            notes: "",
            history: [
              {
                id: generateId(),
                date: now,
                action: "created",
                description: "Orçamento criado",
                userId: "u1"
              }
            ],
            createdAt: now,
            updatedAt: now,
          };

      if (editingBudget) {
        updateBudget(updatedBudget);
      } else {
        addBudget(updatedBudget);
      }

      setEditingBudget(updatedBudget);
      
      toast({
        title: "Veículo adicionado com sucesso",
        description: `Veículo ${getVehicleCategory(data.vehicleId)} foi adicionado ao orçamento`,
      });
    } catch (error) {
      console.error('Erro ao adicionar veículo:', error);
      toast({
        title: "Erro ao adicionar veículo",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  const handleRemoveVehicle = (index: number) => {
    try {
      if (index < 0 || index >= currentVehicles.length) return;

      // Remove o veículo do array e filtra novamente para garantir
      const updatedVehicles = currentVehicles.filter((_, i) => i !== index);
      
      const totalAmount = updatedVehicles.reduce(
        (sum, vehicle) => sum + vehicle.totalAmount,
        0
      );

      const now = new Date().toISOString();
      const updatedBudget: Budget = editingBudget ? {
        ...editingBudget,
        vehicles: updatedVehicles,
        totalAmount,
        updatedAt: now,
        history: [
          ...editingBudget.history,
          {
            id: generateId(),
            date: now,
            action: "vehicle_removed",
            description: "Veículo removido do orçamento",
            userId: "u1"
          }
        ]
      } : {
        id: generateId(),
        vehicles: updatedVehicles,
        totalAmount,
        status: "draft",
        customerId: selectedCustomerId,
        history: [{
          id: generateId(),
          date: now,
          action: "vehicle_removed",
          description: "Veículo removido do orçamento",
          userId: "u1"
        }],
        createdAt: now,
        updatedAt: now,
      };

      if (editingBudget) {
        updateBudget(updatedBudget);
      }
      
      setCurrentVehicles(updatedVehicles);
      setEditingBudget(updatedBudget);

      toast({
        title: "Veículo removido com sucesso",
        description: "O veículo foi removido do orçamento",
      });
    } catch (error) {
      console.error('Erro ao remover veículo:', error);
      toast({
        title: "Erro ao remover veículo",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBudgetStatus = async (budgetId: string, newStatus: BudgetStatus) => {
    try {
      // Se o orçamento foi aprovado, converte para serviço
      if (newStatus === 'approved') {
        const budget = budgets.find(b => b.id === budgetId);
        if (budget) {
          convertBudgetToService(budget);
        }
      }
      
      updateBudget({ ...budgets.find(b => b.id === budgetId), status: newStatus });
      
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
        description: "Ocorreu um erro ao atualizar o status do orçamento.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingCustomers) {
    return (
      <div>Carregando...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Orçamentos</h1>
          <p className="text-muted-foreground">Gerencie seus orçamentos e acompanhe o status</p>
        </div>
        <Button onClick={handleCreateBudget}>
          <Plus className="mr-2 h-4 w-4" />
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

      {/* Filtros e Pesquisa */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar orçamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Pendentes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("approved")}>
                Aprovados
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                Rejeitados
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Período
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setDateFilter("all")}>
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("today")}>
                Hoje
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("week")}>
                Última Semana
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("month")}>
                Este Mês
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={() => {
            setSearchTerm("");
            setStatusFilter("all");
            setDateFilter("all");
          }}>
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Tabela de Orçamentos */}
      <BudgetTable
        budgets={filteredBudgets}
        onEdit={handleEditBudget}
        onDelete={(id) => {
          const budget = budgets.find(b => b.id === id);
          if (budget) {
            setBudgetToDelete(budget);
            setIsDeleteDialogOpen(true);
          }
        }}
        onUpdateStatus={handleUpdateBudgetStatus}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95%] max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBudget ? "Editar Orçamento" : "Novo Orçamento"}
            </DialogTitle>
          </DialogHeader>

          {/* Seleção de Cliente */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="customer">Cliente</Label>
              <Select
                value={selectedCustomerId}
                onValueChange={setSelectedCustomerId}
              >
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Layout em Duas Colunas */}
            <div className="space-y-4">
              {/* Lista de Veículos */}
              {currentVehicles.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Veículos no Orçamento</Label>
                    <span className="text-sm text-muted-foreground">
                      Total: {currentVehicles.length} veículo(s)
                    </span>
                  </div>
                  <Card>
                    <CardContent className="p-4">
                      <BudgetVehiclesTable
                        vehicles={currentVehicles}
                        onDelete={handleRemoveVehicle}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Formulário de Adição */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Adicionar Veículo</Label>
                </div>
                <Card>
                  <CardContent className="p-4">
                    <BudgetVehicleForm
                      onSubmit={handleSubmitVehicle}
                      onCancel={() => setIsDialogOpen(false)}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (!selectedCustomerId) {
                    toast({
                      title: "Erro ao salvar orçamento",
                      description: "Selecione um cliente para continuar",
                      variant: "destructive",
                    });
                    return;
                  }

                  if (currentVehicles.length === 0) {
                    toast({
                      title: "Erro ao salvar orçamento",
                      description: "Adicione pelo menos um veículo ao orçamento",
                      variant: "destructive",
                    });
                    return;
                  }

                  const totalAmount = currentVehicles.reduce(
                    (sum, vehicle) => sum + vehicle.totalAmount,
                    0
                  );

                  const now = new Date().toISOString();
                  const budget: Budget = {
                    id: editingBudget?.id || generateId(),
                    customerId: selectedCustomerId,
                    vehicles: currentVehicles,
                    totalAmount,
                    status: "draft",
                    createdAt: editingBudget?.createdAt || now,
                    updatedAt: now,
                    history: [
                      ...(editingBudget?.history || []),
                      {
                        id: generateId(),
                        date: now,
                        action: editingBudget ? "updated" : "created",
                        description: editingBudget
                          ? "Orçamento atualizado"
                          : "Orçamento criado",
                        userId: "u1",
                      },
                    ],
                  };

                  if (editingBudget) {
                    updateBudget(budget);
                  } else {
                    addBudget(budget);
                  }

                  toast({
                    title: editingBudget ? "Orçamento atualizado" : "Orçamento criado",
                    description: `O orçamento #${budget.id} foi ${
                      editingBudget ? "atualizado" : "criado"
                    } com sucesso`,
                  });

                  setIsDialogOpen(false);
                  setEditingBudget(null);
                  setCurrentVehicles([]);
                  setSelectedCustomerId("");
                }}
                disabled={!selectedCustomerId || currentVehicles.length === 0}
              >
                {editingBudget ? "Salvar Alterações" : "Criar Orçamento"}
              </Button>
            </div>
          </div>

        </DialogContent>
      </Dialog>

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