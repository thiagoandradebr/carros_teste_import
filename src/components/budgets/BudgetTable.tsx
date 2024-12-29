import { Budget, BudgetStatus } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Plus, Trash, Copy, Car, ChevronDown, ChevronUp, Calendar, DollarSign } from "lucide-react";
import { generateBudgetPDF } from "@/lib/pdf-generator";
import { useSettings } from "@/contexts/SettingsContext";
import { useCustomers } from "@/contexts/CustomersContext";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

// Status colors
const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", label: "Pendente" },
  approved: { color: "bg-green-100 text-green-800", label: "Aprovado" },
  rejected: { color: "bg-red-100 text-red-800", label: "Rejeitado" },
  draft: { color: "bg-gray-100 text-gray-800", label: "Rascunho" },
};

interface BudgetTableProps {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: BudgetStatus) => void;
  onDuplicate: (budget: Budget) => void;
  onNew: () => void;
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, 
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export function BudgetTable({ budgets, onEdit, onDelete, onUpdateStatus, onNew, onDuplicate }: BudgetTableProps) {
  const { settings } = useSettings();
  const { customers } = useCustomers();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Calcular totais para os cards de resumo
  const summary = budgets.reduce((acc, budget) => {
    acc.total += budget.totalAmount;
    acc.byStatus[budget.status] = (acc.byStatus[budget.status] || 0) + 1;
    return acc;
  }, { 
    total: 0, 
    byStatus: {} as Record<BudgetStatus, number>
  });

  const toggleRow = (budgetId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(budgetId)) {
      newExpandedRows.delete(budgetId);
    } else {
      newExpandedRows.add(budgetId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleGeneratePDF = async (budget: Budget) => {
    try {
      const customer = customers.find(c => c.id === budget.customerId);
      if (!customer) {
        throw new Error("Cliente não encontrado");
      }

      const pdfUrl = await generateBudgetPDF({ ...budget, customer }, settings.company);
      
      // Abrir o PDF em uma nova aba
      window.open(pdfUrl, '_blank');
      
      toast({
        description: "O PDF foi gerado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Orçamentos</h2>
        <Button onClick={onNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Orçamento
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.map((budget) => {
              const customer = customers.find(c => c.id === budget.customerId);
              const isExpanded = expandedRows.has(budget.id);
              
              return (
                <>
                  <TableRow key={budget.id}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRow(budget.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {budget.id.slice(0, 8)}
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Car className="h-3 w-3" />
                          {budget.vehicles.length}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer?.name || "Cliente não encontrado"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[budget.status].color}`}>
                            {statusConfig[budget.status].label}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white">
                          <DropdownMenuItem className="hover:bg-gray-50 focus:bg-gray-50" onClick={() => onUpdateStatus(budget.id, "pending")}>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.pending.color}`}>
                              {statusConfig.pending.label}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-gray-50 focus:bg-gray-50" onClick={() => onUpdateStatus(budget.id, "approved")}>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.approved.color}`}>
                              {statusConfig.approved.label}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-gray-50 focus:bg-gray-50" onClick={() => onUpdateStatus(budget.id, "rejected")}>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.rejected.color}`}>
                              {statusConfig.rejected.label}
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      {new Date(budget.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(budget.totalAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(budget)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onDuplicate(budget)}
                          title="Duplicar"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleGeneratePDF(budget)}
                          title="Gerar PDF"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onDelete(budget.id)}
                          title="Excluir"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-gray-50">
                        <div className="p-4">
                          <h4 className="font-medium mb-2">Detalhes dos Veículos</h4>
                          <div className="grid gap-4">
                            {budget.vehicles.map((vehicle) => (
                              <div key={`${budget.id}-${vehicle.id}`} className="flex justify-between items-center p-2 bg-white rounded-lg border">
                                <div>
                                  <p className="font-medium">{vehicle.vehicleName}</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(vehicle.startDate).toLocaleDateString()} até {new Date(vehicle.endDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{formatCurrency(vehicle.totalAmount)}</p>
                                  <p className="text-sm text-gray-500">{vehicle.totalDays} dias</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}