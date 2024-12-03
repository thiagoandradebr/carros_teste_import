import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { Customer, CustomerStatus } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { mockCustomers } from "@/mocks/customers";
import { MaskedInput } from "@/components/ui/masked-input";
import { formatCPFCNPJ, unformatDocument, validateCPFCNPJ } from "@/lib/format";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";

interface CustomerFormProps {
  customer?: Customer;
  onSuccess?: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  document: z.string()
    .min(11, "Documento inválido")
    .refine((val) => validateCPFCNPJ(val), "Documento inválido"),
  email: z.string().email("Email inválido"),
  phone: z.string()
    .min(14, "Telefone inválido")
    .max(15, "Telefone inválido"),
  cep: z.string()
    .min(8, "CEP inválido")
    .max(9, "CEP inválido"),
  street: z.string().min(3, "Rua inválida"),
  number: z.string().min(1, "Número inválido"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro inválido"),
  city: z.string().min(2, "Cidade inválida"),
  state: z.string().length(2, "Estado inválido"),
  notes: z.string().optional(),
  status: z.enum(["active", "inactive", "blocked"]),
});

const statusConfig = {
  active: {
    label: "Ativo",
    color: "bg-green-500",
  },
  inactive: {
    label: "Inativo",
    color: "bg-gray-500",
  },
  blocked: {
    label: "Bloqueado",
    color: "bg-red-500",
  },
} as const;

export function CustomerForm({ customer, onSuccess }: CustomerFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: customer?.name || "",
      document: customer?.document ? formatCPFCNPJ(customer.document) : "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      cep: customer?.address?.cep || "",
      street: customer?.address?.street || "",
      number: customer?.address?.number || "",
      complement: customer?.address?.complement || "",
      neighborhood: customer?.address?.neighborhood || "",
      city: customer?.address?.city || "",
      state: customer?.address?.state || "",
      notes: customer?.notes || "",
      status: customer?.status || "active",
    },
  });

  const searchCEP = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, "");
    if (cleanCEP.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();

      if (!data.erro) {
        form.setValue("street", data.logradouro);
        form.setValue("neighborhood", data.bairro);
        form.setValue("city", data.localidade);
        form.setValue("state", data.uf);
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setIsLoadingCep(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formattedValues: Customer = {
        id: customer?.id || Math.random().toString(36).substr(2, 9),
        name: values.name,
        document: unformatDocument(values.document),
        email: values.email,
        phone: values.phone,
        address: {
          cep: values.cep,
          street: values.street,
          number: values.number,
          complement: values.complement,
          neighborhood: values.neighborhood,
          city: values.city,
          state: values.state,
        },
        notes: values.notes,
        status: values.status,
        rentals: customer?.rentals || [],
        updatedAt: new Date().toISOString(),
      };

      if (customer) {
        // Simulando uma chamada de API com setTimeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Atualizando cliente:', formattedValues);
        
        // Atualiza os dados mockados
        const index = mockCustomers.findIndex(c => c.id === customer.id);
        if (index !== -1) {
          mockCustomers[index] = formattedValues;
        }
      } else {
        // Simulando uma chamada de API com setTimeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Criando cliente:', formattedValues);
        
        // Adiciona aos dados mockados
        mockCustomers.push(formattedValues);
      }

      // Invalida o cache do React Query
      queryClient.invalidateQueries({ queryKey: ['customers'] });

      toast({
        title: customer ? "Cliente atualizado!" : "Cliente criado!",
        description: `O cliente ${values.name} foi ${customer ? 'atualizado' : 'criado'} com sucesso.`,
      });

      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro!",
        description: "Ocorreu um erro ao salvar o cliente.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do cliente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Documento</FormLabel>
                <FormControl>
                  <MaskedInput
                    mask="999.999.999-99"
                    placeholder="000.000.000-00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <MaskedInput
                    mask="(99) 99999-9999"
                    placeholder="(00) 00000-0000"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cep"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <MaskedInput
                      mask="99999-999"
                      placeholder="00000-000"
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        searchCEP(e.target.value);
                      }}
                    />
                    {isLoadingCep && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rua</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da rua" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input placeholder="Número" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="complement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input placeholder="Complemento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input placeholder="Bairro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input placeholder="UF" maxLength={2} {...field} />
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
                    {Object.entries(statusConfig).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={config.color}
                          >
                            {config.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observações sobre o cliente"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {customer ? "Atualizar Cliente" : "Criar Cliente"}
        </Button>
      </form>
    </Form>
  );
}
