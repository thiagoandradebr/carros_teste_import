import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const vehicleSchema = z.object({
  brand: z.string().min(1, "Marca é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatório"),
  year: z.number().min(1900, "Ano inválido"),
  plate: z.string().min(1, "Placa é obrigatória")
    .regex(/^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/, "Placa inválida. Use o formato: ABC1234 ou ABC1D23"),
  color: z.string().min(1, "Cor é obrigatória"),
  mileage: z.number().min(0, "Quilometragem inválida").optional().nullable(),
  photo: z.string().optional(),
  status: z.enum(["available", "rented", "maintenance", "reserved"]),
  category: z.string().min(1, "Categoria é obrigatória"),
  dailyRate: z.number().min(0, "Valor da diária inválido"),
  supplier: z.string().min(1, "Fornecedor é obrigatório"),
  isArmored: z.boolean().default(false),
  documents: z.array(z.string()).optional(),
  notes: z.string().optional(),
  maintenanceHistory: z.array(z.object({
    id: z.string(),
    date: z.string(),
    type: z.string(),
    description: z.string(),
    cost: z.number()
  })).optional()
});

type VehicleFormData = Omit<Vehicle, 'id' | 'updatedAt'>;

interface VehicleFormProps {
  onSubmit: (data: VehicleFormData) => void;
  vehicle?: Vehicle | null;
  onCancel?: () => void;
}

export function VehicleForm({ onSubmit, vehicle, onCancel }: VehicleFormProps) {
  const { toast } = useToast();
  
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle ? {
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      plate: vehicle.plate,
      color: vehicle.color,
      mileage: vehicle.mileage,
      status: vehicle.status,
      category: vehicle.category,
      dailyRate: vehicle.dailyRate,
      supplier: vehicle.supplier,
      photo: vehicle.photo,
      documents: vehicle.documents,
      notes: vehicle.notes,
      maintenanceHistory: vehicle.maintenanceHistory,
      isArmored: vehicle.isArmored ?? false
    } : {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      plate: '',
      color: '',
      mileage: 0,
      status: 'available' as const,
      category: '',
      dailyRate: 0,
      supplier: '',
      photo: undefined,
      documents: [],
      notes: '',
      maintenanceHistory: [],
      isArmored: false
    }
  });

  const handleSubmit = async (data: VehicleFormData) => {
    try {
      await onSubmit(data);
      form.reset();
      toast({
        title: "Sucesso",
        description: "Veículo salvo com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o veículo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placa</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fornecedor</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nome do fornecedor" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quilometragem</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ''}
                    onChange={e => {
                      const value = e.target.value;
                      field.onChange(value === '' ? null : Number(value));
                    }}
                    placeholder="Quilometragem do veículo"
                  />
                </FormControl>
                <FormDescription>
                  Quilometragem atual do veículo (opcional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dailyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da Diária</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="rented">Alugado</SelectItem>
                    <SelectItem value="maintenance">Em Manutenção</SelectItem>
                    <SelectItem value="reserved">Reservado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isArmored"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Blindado</FormLabel>
                  <FormDescription>
                    Marque esta opção se o veículo possui blindagem
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {vehicle ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}