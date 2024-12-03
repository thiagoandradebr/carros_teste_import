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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Driver } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { mockDrivers } from "@/mocks/drivers";
import { MaskedInput } from "@/components/ui/masked-input";
import { formatCPFCNPJ, unformatDocument, validateCPFCNPJ } from "@/lib/format";
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";

interface DriverFormProps {
  driver?: Driver;
  onSuccess?: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  cpf: z.string()
    .min(14, "CPF inválido")
    .refine((val) => validateCPFCNPJ(val), "CPF inválido"),
  cnh: z.string()
    .min(11, "CNH inválida")
    .regex(/^\d+$/, "CNH deve conter apenas números"),
  cnhValidity: z.string()
    .min(1, "Data de validade é obrigatória")
    .refine((date) => {
      const validityDate = new Date(date);
      const today = new Date();
      return validityDate > today;
    }, "CNH vencida"),
  phone: z.string()
    .min(14, "Telefone inválido")
    .max(15, "Telefone inválido"),
});

export function DriverForm({ driver, onSuccess }: DriverFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [photo, setPhoto] = useState<string | undefined>(driver?.photo);
  const [cnhDocument, setCnhDocument] = useState<string | undefined>(driver?.cnhDocument);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: driver?.name || "",
      cpf: driver?.cpf ? formatCPFCNPJ(driver.cpf) : "",
      cnh: driver?.cnh || "",
      cnhValidity: driver?.cnhValidity || "",
      phone: driver?.phone || "",
    },
  });

  const handlePhotoUpload = (file: File) => {
    // Simula o upload do arquivo e retorna uma URL temporária
    const url = URL.createObjectURL(file);
    setPhoto(url);
  };

  const handleCnhDocumentUpload = (file: File) => {
    // Simula o upload do arquivo e retorna uma URL temporária
    const url = URL.createObjectURL(file);
    setCnhDocument(url);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formattedValues: Driver = {
        id: driver?.id || Math.random().toString(36).substr(2, 9),
        name: values.name,
        cpf: unformatDocument(values.cpf),
        cnh: values.cnh,
        cnhValidity: values.cnhValidity,
        phone: values.phone,
        photo,
        cnhDocument,
        status: "active",
        address: {
          cep: "",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: ""
        },
        cnhPoints: 0,
        updatedAt: ""
      };

      if (driver) {
        // Simulando uma chamada de API com setTimeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Atualizando motorista:', formattedValues);
        
        // Atualiza os dados mockados
        const index = mockDrivers.findIndex(d => d.id === driver.id);
        if (index !== -1) {
          mockDrivers[index] = formattedValues;
        }
        
        toast({
          title: "Motorista atualizado com sucesso",
          description: `${values.name} foi atualizado(a)`,
        });
      } else {
        // Simulando uma chamada de API com setTimeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Criando novo motorista:', formattedValues);
        
        // Adiciona aos dados mockados
        mockDrivers.push(formattedValues);
        
        toast({
          title: "Motorista criado com sucesso",
          description: `${values.name} foi cadastrado(a)`,
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar motorista:', error);
      toast({
        title: "Erro ao salvar motorista",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
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
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="cnh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNH</FormLabel>
                  <FormControl>
                    <Input placeholder="Número da CNH" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnhValidity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validade da CNH</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Foto do Motorista</FormLabel>
              <FileUpload
                accept="image/*"
                value={photo}
                onChange={handlePhotoUpload}
              />
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Documento da CNH</FormLabel>
              <FileUpload
                accept=".pdf,image/*"
                value={cnhDocument}
                onChange={handleCnhDocumentUpload}
              />
              <FormMessage />
            </FormItem>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            {driver ? "Atualizar" : "Cadastrar"} Motorista
          </Button>
        </div>
      </form>
    </Form>
  );
}
