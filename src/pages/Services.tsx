import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExtraCost, Service, ServiceStatus, ServiceWithDetails } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useServices } from "@/contexts/ServicesContext";
import { ServiceForm } from "@/components/services/ServiceForm";
import { useToast } from "@/components/ui/use-toast";
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
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  PencilLine,
  Plus,
  Trash2,
} from "lucide-react";

const serviceStatusMap = {
  pending: { label: "Pendente", variant: "warning" },
  in_progress: { label: "Em Andamento", variant: "default" },
  completed: { label: "Concluído", variant: "success" },
  cancelled: { label: "Cancelado", variant: "destructive" },
} as const;

export default function Services() {
  const { toast } = useToast();
  const { services, updateService, getServiceWithDetails, addService, deleteService, updateServiceStatus } = useServices();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceDetails, setServiceDetails] = useState<ServiceWithDetails | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (selectedService) {
      const details = getServiceWithDetails(selectedService.id);
      setServiceDetails(details);
    } else {
      setServiceDetails(null);
    }
  }, [selectedService, getServiceWithDetails]);

  const handleAddService = (service: Partial<Service>) => {
    addService(service as Service);
    setIsFormOpen(false);
    toast({
      title: "Serviço criado",
      description: "O serviço foi criado com sucesso.",
    });
  };

  const handleEditService = (service: Partial<Service>) => {
    if (!selectedService) return;
    
    const updatedService = {
      ...selectedService,
      ...service,
      updatedAt: new Date().toISOString(),
    };
    
    updateService(updatedService);
    setIsFormOpen(false);
    setSelectedService(null);
    toast({
      title: "Serviço atualizado",
      description: "O serviço foi atualizado com sucesso.",
    });
  };

  const handleDeleteService = () => {
    if (serviceToDelete) {
      deleteService(serviceToDelete.id);
      setServiceToDelete(null);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Serviço excluído",
        description: "O serviço foi excluído com sucesso.",
      });
    }
  };

  const handleViewService = (service: Service) => {
    setSelectedService(service);
    setShowDetails(true);
  };

  const handleStatusChange = (serviceId: string, status: ServiceStatus) => {
    updateServiceStatus(serviceId, status);
    toast({
      title: "Status atualizado",
      description: `O status do serviço foi atualizado para ${serviceStatusMap[status].label}`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="container mx-auto py-6">
        <div className="grid gap-4">
          {!showDetails ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Serviços</CardTitle>
                <Button onClick={() => {
                  setIsEditMode(false);
                  setIsFormOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Serviço
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => {
                      const details = getServiceWithDetails(service.id);
                      const status = serviceStatusMap[service.status as keyof typeof serviceStatusMap];
                      return (
                        <TableRow key={service.id}>
                          <TableCell>{service.id}</TableCell>
                          <TableCell>
                            {details?.customer.name || service.customerId}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={service.status}
                              onValueChange={(value: ServiceStatus) => handleStatusChange(service.id, value)}
                            >
                              <SelectTrigger>
                                <Badge variant={serviceStatusMap[service.status].variant as any}>
                                  {serviceStatusMap[service.status].label}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(serviceStatusMap).map(([value, { label }]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{formatCurrency(service.totalAmount)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleViewService(service)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setIsEditMode(true);
                                  setSelectedService(service);
                                  setIsFormOpen(true);
                                }}
                              >
                                <PencilLine className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => {
                                  setServiceToDelete(service);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : serviceDetails ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Detalhes do Serviço #{selectedService?.id}</CardTitle>
                <Button variant="outline" onClick={() => {
                  setShowDetails(false);
                  setSelectedService(null);
                }}>
                  Voltar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <h3 className="text-lg font-semibold">Informações do Cliente</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Nome:</span>
                        <span className="ml-2">{serviceDetails.customer.name}</span>
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>
                        <span className="ml-2">{serviceDetails.customer.email}</span>
                      </div>
                      <div>
                        <span className="font-medium">Telefone:</span>
                        <span className="ml-2">{serviceDetails.customer.phone}</span>
                      </div>
                      <div>
                        <span className="font-medium">CPF:</span>
                        <span className="ml-2">{serviceDetails.customer.document}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <h3 className="text-lg font-semibold">Veículos</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Veículo</TableHead>
                          <TableHead>Placa</TableHead>
                          <TableHead>Período</TableHead>
                          <TableHead>Diária</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {serviceDetails.vehicles.map((v) => (
                          <TableRow key={v.id}>
                            <TableCell>
                              {v.vehicle?.model || "Veículo não encontrado"}
                            </TableCell>
                            <TableCell>{v.vehicle?.plate}</TableCell>
                            <TableCell>
                              {new Date(v.startDate).toLocaleDateString()} até{" "}
                              {new Date(v.endDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{formatCurrency(v.dailyRate)}</TableCell>
                            <TableCell>{formatCurrency(v.totalAmount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="grid gap-2">
                    <h3 className="text-lg font-semibold">Custos Extras</h3>
                    {serviceDetails.extraCosts.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Valor Unitário</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {serviceDetails.extraCosts.map((cost) => (
                            <TableRow key={cost.id}>
                              <TableCell>{cost.description}</TableCell>
                              <TableCell>
                                {cost.type === "extra_hours"
                                  ? "Horas Extras"
                                  : "Outros"}
                              </TableCell>
                              <TableCell>{cost.quantity}</TableCell>
                              <TableCell>
                                {formatCurrency(cost.unitValue)}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(cost.totalValue)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Nenhum custo extra registrado
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <h3 className="text-lg font-semibold">Resumo Financeiro</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Subtotal:</span>
                        <span className="ml-2">
                          {formatCurrency(serviceDetails.subtotalAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Custos Extras:</span>
                        <span className="ml-2">
                          {formatCurrency(serviceDetails.extraCostsAmount)}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Total:</span>
                        <span className="ml-2">
                          {formatCurrency(serviceDetails.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <h3 className="text-lg font-semibold">Histórico</h3>
                    <div className="space-y-2">
                      {serviceDetails.history.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{event.description}</span>
                          <span className="text-muted-foreground">
                            {new Date(event.date).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div>Carregando detalhes do serviço...</div>
          )}
        </div>
      </div>

      <ServiceForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedService(null);
          setIsEditMode(false);
        }}
        onSubmit={isEditMode ? handleEditService : handleAddService}
        initialData={isEditMode ? selectedService : undefined}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Serviço</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteService}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
