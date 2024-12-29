import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Customer } from "@/types/customer";
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
import { Textarea } from "@/components/ui/textarea";
import { MaskedInput } from "@/components/ui/masked-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  ClockIcon, 
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Building2
} from "lucide-react";
import { validateCPFCNPJ, formatCPFCNPJ, unformatDocument, formatPhone, unformatPhone } from "@/lib/format";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface FormSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

// 1. Definição das seções
const formSections = {
  basicInfo: {
    title: "Informações Básicas",
    icon: <User className="h-4 w-4" />,
    fields: [
      {
        name: "type",
        label: "Tipo de Cliente",
        type: "select",
        options: [
          { value: "pf", label: "Pessoa Física" },
          { value: "pj", label: "Pessoa Jurídica" }
        ]
      },
      {
        name: "nationality",
        label: "Nacionalidade",
        type: "select",
        options: [
          { value: "national", label: "Nacional" },
          { value: "international", label: "Internacional" }
        ]
      },
      {
        name: "name",
        label: "Nome",
        type: "input"
      },
      {
        name: "document",
        label: (formValues: any) => formValues.type === 'pf' ? 'CPF' : 'CNPJ',
        type: "input",
        mask: (formValues: any) => formValues.type === 'pf' ? '999.999.999-99' : '99.999.999/9999-99'
      },
      {
        name: "representative",
        label: "Representante Legal",
        type: "input",
        showIf: (formValues: any) => formValues.type === 'pj'
      }
    ]
  },

  contact: {
    title: "Contato",
    icon: <Phone className="h-4 w-4" />,
    fields: [
      {
        name: "email",
        label: "Email",
        type: "input"
      },
      {
        name: "phone",
        label: "Telefone",
        type: "input",
        mask: "(99) 99999-9999"
      }
    ]
  },

  address: {
    title: "Endereço",
    icon: <MapPin className="h-4 w-4" />,
    fields: [
      {
        name: "address.zipCode",
        label: "CEP",
        type: "input",
        mask: "99999-999",
        showIf: (formValues: any) => formValues.nationality === 'national'
      },
      {
        name: "address.zipCode",
        label: "Código Postal",
        type: "input",
        showIf: (formValues: any) => formValues.nationality === 'international'
      },
      {
        name: "address.street",
        label: "Logradouro",
        type: "input"
      },
      {
        name: "address.number",
        label: "Número",
        type: "input"
      },
      {
        name: "address.complement",
        label: "Complemento",
        type: "input"
      },
      {
        name: "address.neighborhood",
        label: "Bairro",
        type: "input"
      },
      {
        name: "address.city",
        label: "Cidade",
        type: "input"
      },
      {
        name: "address.state",
        label: "Estado",
        type: "input",
        showIf: (formValues: any) => formValues.nationality === 'national'
      },
      {
        name: "address.state",
        label: "Estado/Província",
        type: "input",
        showIf: (formValues: any) => formValues.nationality === 'international'
      },
      {
        name: "address.country",
        label: "País",
        type: "input",
        showIf: (formValues: any) => formValues.nationality === 'international'
      }
    ]
  },

  notes: {
    title: "Observações",
    icon: <MessageSquare className="h-4 w-4" />,
    fields: [
      {
        name: "notes",
        label: "Observações",
        type: "textarea"
      }
    ]
  }
};

function FormSection({ 
  title, 
  icon, 
  children,
  isOpen,
  onToggle 
}: FormSectionProps) {
  return (
    <Card>
      <button
        type="button"
        className="w-full flex items-center justify-between p-6"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      {isOpen && <CardContent>{children}</CardContent>}
    </Card>
  );
}

interface CustomerFormProps {
  customer?: Customer;
  onSuccess?: (data: Customer) => void | Promise<void>;
}

function renderField(fieldConfig: any, field: any, formValues: any) {
  switch (fieldConfig.type) {
    case "input":
      if (fieldConfig.mask) {
        const mask = typeof fieldConfig.mask === 'function' 
          ? fieldConfig.mask(formValues) 
          : fieldConfig.mask;
        return (
          <MaskedInput
            {...field}
            mask={mask}
            className="w-full"
          />
        );
      }
      return (
        <Input
          {...field}
          className="w-full"
        />
      );
    case "select":
      return (
        <Select
          value={field.value}
          onValueChange={field.onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            {fieldConfig.options.map((option: any) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "textarea":
      return (
        <Textarea
          {...field}
          className="w-full"
        />
      );
    default:
      return null;
  }
}

const formSchema = z.object({
  type: z.enum(['pf', 'pj']),
  nationality: z.enum(['national', 'international']),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  document: z.string()
    .min(1, "Documento é obrigatório")
    .superRefine((val, ctx) => {
      if (!validateCPFCNPJ(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Documento inválido",
        });
      }
    }),
  representative: z.string().optional(),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  notes: z.string().optional(),
  status: z.enum(["active", "inactive", "blocked"]).optional(),
  address: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional()
  }).optional()
}).superRefine((data, ctx) => {
  if (data.type === 'pj' && !data.representative) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Representante Legal é obrigatório para Pessoa Jurídica",
      path: ["representative"]
    });
  }

  // Validação condicional do endereço
  if (data.address) {
    const requiredFields = ['street', 'number', 'neighborhood', 'city', 'state'] as const;
    
    if (data.nationality === 'international' && !data.address.country) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "País é obrigatório para endereços internacionais",
        path: ["address", "country"]
      });
    }

    // Se algum campo do endereço foi preenchido, valida os campos obrigatórios
    const hasAnyAddressField = requiredFields.some(field => data.address?.[field]);
    if (hasAnyAddressField) {
      requiredFields.forEach(field => {
        if (!data.address?.[field]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${field} é obrigatório quando o endereço é preenchido`,
            path: ["address", field]
          });
        }
      });
    }
  }
});

export function CustomerForm({ customer, onSuccess }: CustomerFormProps) {
  const { toast } = useToast();
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [openSections, setOpenSections] = useState({
    basicInfo: true,
    contact: true,
    address: true,
    notes: true
  });

  const form = useForm<Customer>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: customer?.type || 'pf',
      nationality: customer?.nationality || 'national',
      name: customer?.name || "",
      document: customer?.document ? formatCPFCNPJ(customer.document) : "",
      representative: customer?.representative || "",
      email: customer?.email || "",
      phone: customer?.phone ? formatPhone(customer.phone) : "",
      address: customer?.address ? {
        zipCode: customer.address.zipCode || "",
        street: customer.address.street || "",
        number: customer.address.number || "",
        complement: customer.address.complement || "",
        neighborhood: customer.address.neighborhood || "",
        city: customer.address.city || "",
        state: customer.address.state || "",
        country: customer.address.country || ""
      } : undefined,
      notes: customer?.notes || "",
    },
  });

  const searchCEP = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, "");
    if (cleanCEP.length !== 8) return;

    try {
      setIsLoadingCep(true);
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();

      if (!data.erro) {
        form.setValue("address.street", data.logradouro);
        form.setValue("address.neighborhood", data.bairro);
        form.setValue("address.city", data.localidade);
        form.setValue("address.state", data.uf);

        toast({
          title: "Endereço encontrado",
          description: "Os dados do endereço foram preenchidos automaticamente.",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast({
        title: "Erro ao buscar CEP",
        description: "Não foi possível encontrar o endereço. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCep(false);
    }
  };

  async function onSubmit(values: Customer) {
    console.log("Iniciando submissão do formulário", values);
    try {
      const formattedValues: Customer = {
        id: customer?.id || crypto.randomUUID(),
        type: values.type,
        nationality: values.nationality,
        name: values.name,
        document: unformatDocument(values.document),
        representative: values.type === 'pj' ? values.representative : undefined,
        email: values.email,
        phone: unformatPhone(values.phone),
        address: values.address ? {
          street: values.address.street,
          number: values.address.number,
          complement: values.address.complement,
          neighborhood: values.address.neighborhood,
          city: values.address.city,
          state: values.address.state,
          zipCode: values.address.zipCode.replace(/\D/g, ''),
          country: values.address.country
        } : undefined,
        notes: values.notes,
        status: customer?.status || "active",
        updatedAt: new Date().toISOString()
      };

      console.log("Dados formatados", formattedValues);

      if (onSuccess) {
        console.log("Chamando onSuccess");
        await onSuccess(formattedValues);
        console.log("onSuccess executado com sucesso");
        toast({
          title: customer ? "Cliente atualizado!" : "Cliente cadastrado!",
          description: "Os dados foram salvos com sucesso."
        });
      } else {
        console.error("onSuccess não está definido");
      }
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados do cliente.",
        variant: "destructive"
      });
      throw error;
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {Object.entries(formSections).map(([key, section]) => (
          <FormSection
            key={key}
            title={section.title}
            icon={section.icon}
            isOpen={openSections[key as keyof typeof openSections]}
            onToggle={() => setOpenSections(prev => ({
              ...prev,
              [key]: !prev[key as keyof typeof openSections]
            }))}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map(field => (
                !field.showIf || field.showIf(form.getValues()) ? (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{field.label instanceof Function ? field.label(form.getValues()) : field.label}</FormLabel>
                        <FormControl>
                          {renderField(field, formField, form.getValues())}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null
              ))}
            </div>
          </FormSection>
        ))}

        <div className="flex justify-end gap-2">
          <Button type="submit">
            {customer ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
