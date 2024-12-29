import { useState } from "react";
import { v4 as uuid } from "uuid";
import { BudgetVehicle, ServiceType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Car, DollarSign } from "lucide-react";
import { useVehicles } from "@/contexts/VehiclesContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";

const VEHICLE_CATEGORIES = {
  HATCH: "HATCH",
  SEDAN: "SEDAN",
  SUV: "SUV",
  LUXURY: "LUXURY",
  TRUCK: "TRUCK",
  MOTORCYCLE: "MOTORCYCLE",
} as const;

const SERVICE_TYPES = {
  DAILY_10H: "Diária 10 horas",
  DAILY_12H: "Diária 12 horas",
  TRANSFER: "Transfer",
} as const;

const budgetVehicleSchema = z.object({
  vehicleName: z.string().min(1, "Nome do veículo é obrigatório"),
  startDate: z.string()
    .min(1, "Data inicial é obrigatória")
    .refine(date => {
      const start = new Date(date);
      return start >= new Date(new Date().setHours(0, 0, 0, 0));
    }, "Data inicial deve ser maior ou igual a hoje"),
  endDate: z.string()
    .min(1, "Data final é obrigatória"),
  dailyRate: z.number()
    .min(0, "Valor da diária deve ser maior que zero")
    .transform(value => Number(value)),
  notes: z.string().optional(),
  category: z.enum(Object.values(VEHICLE_CATEGORIES) as [string, ...string[]], {
    errorMap: () => ({ message: "Categoria inválida" })
  }),
  serviceType: z.enum(["DAILY_10H", "DAILY_12H", "TRANSFER"] as [ServiceType, ...ServiceType[]], {
    errorMap: () => ({ message: "Tipo de serviço inválido" })
  })
}).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
  },
  {
    message: "Data final deve ser maior que a data inicial",
    path: ["endDate"],
  }
);

type BudgetVehicleFormData = z.infer<typeof budgetVehicleSchema>;

interface BudgetVehicleFormProps {
  onSubmit: (vehicle: BudgetVehicle) => void;
  onCancel: () => void;
  initialData?: Partial<BudgetVehicle>;
}

export function BudgetVehicleForm({ onSubmit, onCancel, initialData }: BudgetVehicleFormProps) {
  const { toast } = useToast();
  const form = useForm<BudgetVehicleFormData>({
    resolver: zodResolver(budgetVehicleSchema),
    defaultValues: {
      vehicleName: initialData?.vehicleName || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      dailyRate: initialData?.dailyRate || 0,
      notes: initialData?.notes || "",
      category: initialData?.category || VEHICLE_CATEGORIES.HATCH,
      serviceType: initialData?.serviceType || "DAILY_10H",
    },
  });

  const { control, register, handleSubmit, watch, formState: { errors, isSubmitting } } = form;

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const onSubmitForm = async (data: BudgetVehicleFormData) => {
    try {
      const totalDays = calculateTotalDays();
      if (totalDays === 0) {
        toast({
          title: "Erro",
          description: "Período inválido",
          variant: "destructive",
        });
        return;
      }

      const vehicleId = initialData?.vehicleId || uuid();
      const budgetVehicle: BudgetVehicle = {
        id: initialData?.id || uuid(),
        vehicleId,
        vehicleName: data.vehicleName,
        startDate: data.startDate,
        endDate: data.endDate,
        dailyRate: data.dailyRate,
        category: data.category,
        serviceType: data.serviceType,
        totalDays,
        totalAmount: totalDays * data.dailyRate,
        notes: data.notes || undefined,
      };

      await onSubmit(budgetVehicle);
      form.reset();
    } catch (error) {
      console.error("Erro ao processar formulário:", error);
      toast({
        title: "Erro ao adicionar veículo",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <Label>Veículo</Label>
          <div className="relative">
            <Car className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              {...register("vehicleName")}
              placeholder="Nome do veículo"
              className="pl-8"
            />
          </div>
          {errors.vehicleName && (
            <span className="text-sm text-red-500">{errors.vehicleName.message}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Categoria</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(VEHICLE_CATEGORIES).map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <span className="text-sm text-red-500">{errors.category.message}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Valor Diária</Label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                step="0.01"
                className="pl-8"
                {...register("dailyRate", { valueAsNumber: true })}
              />
            </div>
            {errors.dailyRate && (
              <span className="text-sm text-red-500">{errors.dailyRate.message}</span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Tipo de Serviço</Label>
          <Controller
            name="serviceType"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY_10H">{SERVICE_TYPES.DAILY_10H}</SelectItem>
                  <SelectItem value="DAILY_12H">{SERVICE_TYPES.DAILY_12H}</SelectItem>
                  <SelectItem value="TRANSFER">{SERVICE_TYPES.TRANSFER}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.serviceType && (
            <span className="text-sm text-red-500">{errors.serviceType.message}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Data Inicial</Label>
            <Input
              type="date"
              {...register("startDate")}
            />
            {errors.startDate && (
              <span className="text-sm text-red-500">{errors.startDate.message}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Data Final</Label>
            <Input
              type="date"
              {...register("endDate")}
            />
            {errors.endDate && (
              <span className="text-sm text-red-500">{errors.endDate.message}</span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Total de Diárias</Label>
          <Input
            type="text"
            value={calculateTotalDays()}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Observações</Label>
          <Textarea
            {...register("notes")}
            placeholder="Observações adicionais sobre o veículo..."
            className="resize-none"
            rows={4}
          />
          {errors.notes && (
            <span className="text-sm text-red-500">{errors.notes.message}</span>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adicionando..." : "Adicionar Veículo"}
        </Button>
      </div>
    </div>
  );
}