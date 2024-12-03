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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileText, Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { mockCustomers } from "@/mocks/customers";
import { Badge } from "@/components/ui/badge";
import html2pdf from "html2pdf.js";
import { BudgetPDFTemplate } from "./BudgetPDFTemplate";
import { createRoot } from "react-dom/client";

interface BudgetTableProps {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: BudgetStatus) => void;
}

const statusConfig = {
  draft: {
    label: "Rascunho",
    color: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
  },
  pending: {
    label: "Pendente",
    color: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  },
  approved: {
    label: "Aprovado",
    color: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  },
  rejected: {
    label: "Rejeitado",
    color: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  },
};

export function BudgetTable({ budgets, onEdit, onDelete, onUpdateStatus }: BudgetTableProps) {
  const getCustomerName = (customerId: string) => {
    return mockCustomers.find((c) => c.id === customerId)?.name || "Cliente não encontrado";
  };

  const handleExportPDF = async (budget: Budget) => {
    // Criar um container temporário para renderizar o template
    const container = document.createElement("div");
    const root = createRoot(container);
    
    // Renderizar o template no container
    root.render(<BudgetPDFTemplate budget={budget} />);
    
    // Aguardar a renderização
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Configurações do PDF
    const options = {
      margin: 10,
      filename: `orcamento-${budget.id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    try {
      // Gerar o PDF
      const pdf = await html2pdf().set(options).from(container).save();
      
      // Limpar o container
      root.unmount();
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70px]">Código</TableHead>
              <TableHead className="w-[200px]">Cliente</TableHead>
              <TableHead className="w-[100px]">Data</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[80px]">Veículos</TableHead>
              <TableHead className="w-[120px] text-right">Valor Total</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum orçamento encontrado.
                </TableCell>
              </TableRow>
            ) : (
              budgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell className="font-medium">#{budget.id}</TableCell>
                  <TableCell className="truncate">{getCustomerName(budget.customerId)}</TableCell>
                  <TableCell>{formatDate(budget.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 px-2 hover:bg-transparent"
                        >
                          <Badge
                            variant="secondary"
                            className={statusConfig[budget.status].color}
                          >
                            {statusConfig[budget.status].label}
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {Object.entries(statusConfig).map(([status, config]) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => onUpdateStatus(budget.id, status as BudgetStatus)}
                            disabled={budget.status === status}
                          >
                            <Badge
                              variant="secondary"
                              className={config.color + " mr-2"}
                            >
                              •
                            </Badge>
                            {config.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>{budget.vehicles?.length || 0} veículos</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(budget.totalAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleExportPDF(budget)}
                    >
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">Exportar PDF</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(budget)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600"
                      onClick={() => onDelete(budget.id)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}