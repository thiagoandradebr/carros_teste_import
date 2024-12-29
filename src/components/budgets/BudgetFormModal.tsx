import { useState, useEffect, useLayoutEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Clock10, Clock12, Car, Trash2, ChevronDown, ChevronUp, CarFront, Plus, X, Copy, CopyCheck, User, FileText, CheckCircle, GripVertical } from "lucide-react";
import { useVehicles } from "@/contexts/VehiclesContext";
import { useCustomers } from "@/contexts/CustomersContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

// Utility function to check if a field is required
const isFieldRequired = (field: string, value: any): boolean => {
  if (value === undefined || value === null || value === '') {
    return true;
  }
  return false;
};

type VehicleEntryMode = "pre-registered" | "manual";

interface VehicleEntry {
  id: string;
  mode: VehicleEntryMode;
  preRegisteredVehicleId?: string;
  manualVehicle?: {
    brand: string;
    model: string;
    plate: string;
  };
  serviceType: "DAILY_10H" | "DAILY_12H" | "TRANSFER";
  value: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
}

const manualVehicleSchema = z.object({
  brand: z.string().min(1, "Marca é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatório"),
  plate: z.string().min(1, "Placa é obrigatória"),
});

const budgetFormSchema = z.object({
  customerId: z.string().min(1, "Cliente é obrigatório"),
});

type BudgetFormData = z.infer<typeof budgetFormSchema>;

interface BudgetFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  defaultValues?: any;
  mode?: "create" | "edit";
}

export function BudgetFormModal({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  mode = "create"
}: BudgetFormModalProps) {
  const { toast } = useToast();
  const { vehicles } = useVehicles();
  const { customers } = useCustomers();
  const [vehicleEntries, setVehicleEntries] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overtimeRule, setOvertimeRule] = useState(false);

  const form = useForm({
    defaultValues: {
      customerId: defaultValues?.customerId || "",
      vehicles: defaultValues?.vehicles || []
    },
  });

  useEffect(() => {
    if (defaultValues) {
      setVehicleEntries(defaultValues.vehicles.map(vehicle => ({
        id: vehicle.id,
        mode: "pre-registered",
        preRegisteredVehicleId: vehicle.vehicleId,
        value: vehicle.dailyRate,
        totalDays: vehicle.totalDays,
        totalAmount: vehicle.totalAmount,
        startDate: vehicle.startDate,
        endDate: vehicle.endDate,
        serviceType: vehicle.serviceType,
      })));
      form.reset({
        customerId: defaultValues.customerId,
      });
    }
  }, [defaultValues, form]);

  useEffect(() => {
    if (open) {
      if (!defaultValues) {
        form.reset({
          customerId: "",
          vehicles: [],
        });
        setVehicleEntries([]);
      }
    }
  }, [open, defaultValues, form]);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = form;

  const addVehicleEntry = (mode: VehicleEntryMode) => {
    const today = new Date().toISOString().split('T')[0];
    setVehicleEntries([...vehicleEntries, {
      id: crypto.randomUUID(),
      mode,
      serviceType: "DAILY_10H",
      value: 0,
      startDate: today,
      endDate: today,
      totalDays: 1,
      totalAmount: 0,
    }]);
  };

  const calculateDaysAndTotal = (startDate: string, endDate: string, value: number) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir o dia inicial
    return {
      totalDays,
      totalAmount: totalDays * value
    };
  };

  const removeVehicleEntry = (id: string) => {
    setVehicleEntries(entries => entries.filter(entry => entry.id !== id));
  };

  const updateVehicleEntry = (id: string, updates: Partial<VehicleEntry>) => {
    setVehicleEntries(entries =>
      entries.map(entry => {
        if (entry.id === id) {
          const updatedEntry = { ...entry, ...updates };
          
          // Se alguma das datas ou valor foi atualizado, recalcular totais
          if (updates.startDate || updates.endDate || updates.value) {
            const { totalDays, totalAmount } = calculateDaysAndTotal(
              updates.startDate || entry.startDate,
              updates.endDate || entry.endDate,
              updates.value || entry.value
            );
            return {
              ...updatedEntry,
              totalDays,
              totalAmount
            };
          }
          
          return updatedEntry;
        }
        return entry;
      })
    );
  };

  const duplicateVehicleEntry = (id: string) => {
    const originalEntry = vehicleEntries.find(entry => entry.id === id);
    if (originalEntry) {
      const newEntry = {
        ...originalEntry,
        id: crypto.randomUUID(),
      };
      setVehicleEntries([...vehicleEntries, newEntry]);
    }
  };

  const copyVehicleToClipboard = (id: string) => {
    const entry = vehicleEntries.find(entry => entry.id === id);
    if (entry) {
      localStorage.setItem('copiedVehicle', JSON.stringify(entry));
      toast({
        title: "Veículo copiado",
        description: "Os dados do veículo foram copiados para a área de transferência",
      });
    }
  };

  const pasteVehicleFromClipboard = () => {
    const copiedVehicle = localStorage.getItem('copiedVehicle');
    if (copiedVehicle) {
      const entry = JSON.parse(copiedVehicle);
      const newEntry = {
        ...entry,
        id: crypto.randomUUID(),
      };
      setVehicleEntries([...vehicleEntries, newEntry]);
      toast({
        title: "Veículo colado",
        description: "Os dados do veículo foram colados com sucesso",
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setVehicleEntries((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const onSubmitForm = async (data: any) => {
    try {
      // Validar veículos
      const hasInvalidEntries = vehicleEntries.some(entry => {
        if (entry.mode === "pre-registered" && !entry.preRegisteredVehicleId) {
          return true;
        }
        if (entry.mode === "manual" && (!entry.manualVehicle?.brand || !entry.manualVehicle?.model || !entry.manualVehicle?.plate)) {
          return true;
        }
        return false;
      });

      if (hasInvalidEntries) {
        toast({
          title: "Erro",
          description: "Preencha todas as informações dos veículos",
          variant: "destructive",
        });
        return;
      }

      if (vehicleEntries.length === 0) {
        toast({
          title: "Erro",
          description: "Adicione pelo menos um veículo ao orçamento",
          variant: "destructive",
        });
        return;
      }

      await onSubmit({ ...data, vehicles: vehicleEntries, overtimeRule });
      form.reset();
      setVehicleEntries([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao processar formulário:", error);
      toast({
        title: "Erro ao criar orçamento",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    form.reset();
    setVehicleEntries([]);
    setOvertimeRule(false);
  };

  // Reseta o formulário quando o modal é fechado
  const handleCloseModal = () => {
    resetForm();
    onOpenChange(false);
  };

  const steps = [
    { id: 'client', label: 'Cliente', icon: <User className="h-4 w-4" /> },
    { id: 'vehicles', label: 'Veículos', icon: <Car className="h-4 w-4" /> },
    { id: 'details', label: 'Detalhes', icon: <FileText className="h-4 w-4" /> },
    { id: 'review', label: 'Revisão', icon: <CheckCircle className="h-4 w-4" /> }
  ];

  const validateField = (field: string, value: any) => {
    if (!value && field !== 'value') {
      return false;
    }
    if (field === 'value' && (value === undefined || value <= 0)) {
      return false;
    }
    return true;
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetForm();
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="max-w-[calc(56rem*1.2)] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Novo Orçamento" : "Editar Orçamento"}</DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Preencha os dados para criar um novo orçamento." 
              : "Edite os dados do orçamento."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
          {/* Indicador de Progresso */}
          <div className="mb-6">
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white">
                    {step.icon}
                  </div>
                  <div className="ml-2">
                    <span className="text-sm font-medium">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="h-0.5 w-16 mx-4 bg-blue-500" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card de Total */}
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total do Orçamento</p>
                  <p className="text-2xl font-semibold">
                    R$ {vehicleEntries.reduce((total, entry) => total + entry.totalAmount, 0).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-8 text-sm text-muted-foreground">
                  <div className="text-center">
                    <p>Veículos</p>
                    <p className="text-lg font-medium text-foreground">{vehicleEntries.length}</p>
                  </div>
                  <div className="text-center">
                    <p>Diárias</p>
                    <p className="text-lg font-medium text-foreground">
                      {vehicleEntries.reduce((total, entry) => total + entry.totalDays, 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p>Média/Dia</p>
                    <p className="text-lg font-medium text-foreground">
                      R$ {(vehicleEntries.reduce((total, entry) => total + entry.value, 0) / vehicleEntries.length || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seleção de Cliente */}
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Controller
              name="customerId"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    validateField('customerId', value);
                  }}
                >
                  <SelectTrigger className="w-full">
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
              )}
            />
          </div>

          {/* Botões de Ação para Veículos */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12"
              onClick={() => addVehicleEntry("pre-registered")}
            >
              <CarFront className="mr-2 h-5 w-5" />
              Adicionar Veículo Cadastrado
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12"
              onClick={() => addVehicleEntry("manual")}
            >
              <Car className="mr-2 h-5 w-5" />
              Adicionar Veículo Manual
            </Button>
            {localStorage.getItem('copiedVehicle') && (
              <Button
                type="button"
                variant="outline"
                onClick={pasteVehicleFromClipboard}
                className="h-12 px-4"
              >
                <CopyCheck className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Lista de Veículos */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={vehicleEntries.map(entry => entry.id)}
              strategy={verticalListSortingStrategy}
            >
              <Accordion type="multiple" className="space-y-4">
                {vehicleEntries.map((entry) => (
                  <SortableVehicleItem
                    key={entry.id}
                    entry={entry}
                    vehicles={vehicles}
                    updateVehicleEntry={updateVehicleEntry}
                    removeVehicleEntry={removeVehicleEntry}
                    duplicateVehicleEntry={duplicateVehicleEntry}
                    copyVehicleToClipboard={copyVehicleToClipboard}
                    validateField={validateField}
                  />
                ))}
              </Accordion>
            </SortableContext>
          </DndContext>

          {/* Regras Adicionais */}
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label>Regras Adicionais</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="overtime"
                  checked={overtimeRule}
                  onCheckedChange={(checked) => setOvertimeRule(checked as boolean)}
                />
                <label
                  htmlFor="overtime"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Horas extras ou frações equivalem a 10% da tarifa diária
                </label>
              </div>
            </div>
          </div>

        </form>

        {/* Botões de ação */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit(onSubmitForm)}
          >
            {mode === "create" ? "Criar Orçamento" : "Editar Orçamento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const SortableVehicleItem = ({
  entry,
  vehicles,
  updateVehicleEntry,
  removeVehicleEntry,
  duplicateVehicleEntry,
  copyVehicleToClipboard,
  validateField
}: {
  entry: VehicleEntry;
  vehicles: any[];
  updateVehicleEntry: (id: string, data: any) => void;
  removeVehicleEntry: (id: string) => void;
  duplicateVehicleEntry: (id: string) => void;
  copyVehicleToClipboard: (id: string) => void;
  validateField: (field: string, value: any) => boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <AccordionItem
        value={entry.id}
        className={cn(
          "border rounded-lg",
          entry.mode === "pre-registered" ? "bg-blue-50" : "bg-orange-50"
        )}
      >
        <AccordionTrigger
          className={cn(
            "px-4 hover:no-underline",
            isDragging && "cursor-grabbing",
            !isDragging && "cursor-grab"
          )}
        >
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-4">
              <div {...attributes} {...listeners} className="p-2 hover:bg-accent rounded-md">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex items-center gap-2">
                <CarFront className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">
                  {entry.mode === "pre-registered" 
                    ? entry.preRegisteredVehicleId 
                      ? vehicles.find(v => v.id === entry.preRegisteredVehicleId)?.brand + " " + 
                        vehicles.find(v => v.id === entry.preRegisteredVehicleId)?.model + 
                        " (" + vehicles.find(v => v.id === entry.preRegisteredVehicleId)?.plate + ")"
                      : "Selecione um veículo"
                    : entry.manualVehicle?.brand 
                      ? `${entry.manualVehicle.brand} ${entry.manualVehicle.model} (${entry.manualVehicle.plate})`
                      : "Preencha os dados do veículo"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock10 className="h-4 w-4" />
                <span>{entry.totalDays} dia{entry.totalDays !== 1 ? 's' : ''}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">R$</span>
                <span className="font-medium">{entry.totalAmount.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateVehicleEntry(entry.id);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyVehicleToClipboard(entry.id);
                  }}
                >
                  <CopyCheck className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeVehicleEntry(entry.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          {entry.mode === "pre-registered" ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <Label>Veículo</Label>
                </div>
                <Select
                  value={entry.preRegisteredVehicleId}
                  onValueChange={(value) => {
                    updateVehicleEntry(entry.id, { preRegisteredVehicleId: value });
                    validateField('vehicle', value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id} className="flex items-center">
                        <span>{vehicle.brand} {vehicle.model}</span>
                        <span className="ml-2 text-muted-foreground">({vehicle.plate.toUpperCase()})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-6 gap-6">
                <div className="space-y-1.5">
                  <Label>Data de Início</Label>
                  <Input
                    type="date"
                    value={entry.startDate}
                    onChange={(e) => {
                      updateVehicleEntry(entry.id, { startDate: e.target.value });
                      validateField('startDate', e.target.value);
                    }}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Data de Término</Label>
                  <Input
                    type="date"
                    value={entry.endDate}
                    min={entry.startDate}
                    onChange={(e) => {
                      updateVehicleEntry(entry.id, { endDate: e.target.value });
                      validateField('endDate', e.target.value);
                    }}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Tipo de Serviço</Label>
                  <Select
                    value={entry.serviceType}
                    onValueChange={(value: "DAILY_10H" | "DAILY_12H" | "TRANSFER") => {
                      updateVehicleEntry(entry.id, { serviceType: value });
                      validateField('serviceType', value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo de serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY_10H">Diária 10 horas</SelectItem>
                      <SelectItem value="DAILY_12H">Diária 12 horas</SelectItem>
                      <SelectItem value="TRANSFER">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1">
                    <Label>Diária (R$)</Label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-2 top-2.5 text-muted-foreground">R$</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full pl-8"
                      value={entry.value || ""}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        updateVehicleEntry(entry.id, { value });
                        validateField('value', value);
                      }}
                      placeholder="0,00"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Número de Diárias</Label>
                  <Input
                    type="text"
                    value={entry.totalDays || 0}
                    disabled
                    className="w-full bg-gray-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Valor Total</Label>
                  <div className="relative">
                    <span className="absolute left-2 top-2.5 text-muted-foreground">R$</span>
                    <Input
                      type="text"
                      value={entry.totalAmount?.toFixed(2) || "0.00"}
                      disabled
                      className="w-full bg-gray-50 pl-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Marca</Label>
                  <div className="relative">
                    <Car className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={entry.manualVehicle?.brand || ""}
                      onChange={(e) => updateVehicleEntry(entry.id, {
                        manualVehicle: { ...entry.manualVehicle, brand: e.target.value }
                      })}
                      className="w-full pl-8"
                      placeholder="Ex: Toyota"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Modelo</Label>
                  <Input
                    value={entry.manualVehicle?.model || ""}
                    onChange={(e) => updateVehicleEntry(entry.id, {
                      manualVehicle: { ...entry.manualVehicle, model: e.target.value }
                    })}
                    className="w-full"
                    placeholder="Ex: Corolla"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Placa</Label>
                  <Input
                    value={entry.manualVehicle?.plate || ""}
                    onChange={(e) => updateVehicleEntry(entry.id, {
                      manualVehicle: { ...entry.manualVehicle, plate: e.target.value }
                    })}
                    className="w-full uppercase"
                    placeholder="Ex: ABC-1234"
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-6">
                <div className="space-y-1.5">
                  <Label>Data de Início</Label>
                  <Input
                    type="date"
                    value={entry.startDate}
                    onChange={(e) => {
                      updateVehicleEntry(entry.id, { startDate: e.target.value });
                      validateField('startDate', e.target.value);
                    }}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Data de Término</Label>
                  <Input
                    type="date"
                    value={entry.endDate}
                    min={entry.startDate}
                    onChange={(e) => {
                      updateVehicleEntry(entry.id, { endDate: e.target.value });
                      validateField('endDate', e.target.value);
                    }}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Tipo de Serviço</Label>
                  <Select
                    value={entry.serviceType}
                    onValueChange={(value: "DAILY_10H" | "DAILY_12H" | "TRANSFER") => {
                      updateVehicleEntry(entry.id, { serviceType: value });
                      validateField('serviceType', value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo de serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DAILY_10H">Diária 10 horas</SelectItem>
                      <SelectItem value="DAILY_12H">Diária 12 horas</SelectItem>
                      <SelectItem value="TRANSFER">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3 grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1">
                      <Label>Diária (R$)</Label>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2 top-2.5 text-muted-foreground">R$</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full pl-8"
                        value={entry.value || ""}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0;
                          updateVehicleEntry(entry.id, { value });
                          validateField('value', value);
                        }}
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Número de Diárias</Label>
                    <Input
                      type="text"
                      value={entry.totalDays || 0}
                      disabled
                      className="w-full bg-gray-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Valor Total</Label>
                    <div className="relative">
                      <span className="absolute left-2 top-2.5 text-muted-foreground">R$</span>
                      <Input
                        type="text"
                        value={entry.totalAmount?.toFixed(2) || "0.00"}
                        disabled
                        className="w-full bg-gray-50 pl-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </div>
  );
};
