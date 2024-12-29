import React, { useMemo, useCallback, useState } from "react";
import { Customer, CustomerStatus } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { MessageCircle, Edit, Eye, Trash, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { customerStatusConfig } from "@/utils/statusUtils";
import { getWhatsAppLink } from "@/lib/format";
import { useVirtualizer } from '@tanstack/react-virtual';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onView: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: CustomerStatus) => void;
}

interface FilterState {
  search: string;
  type: string;
  status: string;
}

const INITIAL_FILTERS: FilterState = {
  search: '',
  type: '',
  status: ''
};

export function CustomerTable({ 
  customers, 
  onEdit, 
  onView, 
  onDelete, 
  onStatusChange 
}: CustomerTableProps) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const parentRef = React.useRef<HTMLDivElement>(null);

  // Memoize filter handlers
  const handleSearchChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  }, []);

  const handleTypeChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, type: value }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, status: value }));
  }, []);

  // Memoize filtered customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      if (!customer || !customer.id || !customer.name || !customer.phone || !customer.email || !customer.status) {
        return false;
      }

      const matchesSearch = !filters.search || 
        customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        customer.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        customer.phone.includes(filters.search);

      const matchesType = !filters.type || filters.type === "all" || customer.type === filters.type;
      const matchesStatus = !filters.status || filters.status === "all" || customer.status === filters.status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [customers, filters]);

  // Setup virtualization
  const rowVirtualizer = useVirtualizer({
    count: filteredCustomers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // estimated row height
    overscan: 10
  });

  // Memoize action handlers
  const handleEdit = useCallback((customer: Customer) => {
    onEdit(customer);
  }, [onEdit]);

  const handleView = useCallback((customer: Customer) => {
    onView(customer);
  }, [onView]);

  const handleDelete = useCallback((id: string) => {
    onDelete(id);
  }, [onDelete]);

  const handleUpdateStatus = useCallback((id: string, status: CustomerStatus) => {
    onStatusChange(id, status);
  }, [onStatusChange]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou telefone"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-8"
          />
        </div>
        <Select value={filters.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de pessoa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pf">Pessoa Física</SelectItem>
            <SelectItem value="pj">Pessoa Jurídica</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(customerStatusConfig).map(([value, config]) => (
              <SelectItem key={value} value={value}>
                <StatusBadge status={value as CustomerStatus} config={customerStatusConfig} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border" ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const customer = filteredCustomers[virtualRow.index];
              return (
                <TableRow
                  key={customer.id}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                >
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.type === 'pj' ? 'Pessoa Jurídica' : 'Pessoa Física'}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    <Select
                      value={customer.status}
                      onValueChange={(value: CustomerStatus) => handleUpdateStatus(customer.id, value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue>
                          <StatusBadge status={customer.status} config={customerStatusConfig} />
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(customerStatusConfig).map(([value, config]) => (
                          <SelectItem key={value} value={value}>
                            <StatusBadge status={value as CustomerStatus} config={customerStatusConfig} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(customer)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(customer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(customer.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(getWhatsAppLink(customer.phone), "_blank")}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-gray-500">
        Mostrando {filteredCustomers.length} de {customers.length} clientes
      </div>
    </div>
  );
}
