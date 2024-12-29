import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useRef } from "react";
import { Driver } from "@/types/driver";
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
  FileText, 
  ClockIcon, 
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Upload,
  X
} from "lucide-react";

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
    icon: <User className="w-4 h-4" />,
    fields: [
      {
        name: "name",
        label: "Nome Completo",
        type: "input"
      },
      {
        name: "cpf",
        label: "CPF",
        type: "masked-input",
        mask: "999.999.999-99"
      },
      {
        name: "cnh",
        label: "CNH",
        type: "masked-input",
        mask: "999999999999" // Máscara para CNH com 12 dígitos
      }
    ]
  },

  contact: {
    title: "Contato",
    icon: <Phone className="w-4 h-4" />,
    fields: [
      {
        name: "email",
        label: "Email",
        type: "input"
      },
      {
        name: "phone",
        label: "Telefone",
        type: "masked-input",
        mask: "(99) 99999-9999"
      }
    ]
  },

  documents: {
    title: "Documentos",
    icon: <FileText className="w-4 h-4" />,
    fields: [
      {
        name: "driverPhoto",
        label: "Foto do Motorista",
        type: "file-upload",
        accept: "image/*",
        maxSize: 5242880, // 5MB
        helperText: "Arraste uma foto ou clique para fazer upload. JPG ou PNG até 5MB"
      },
      {
        name: "cnhPhoto",
        label: "Foto da CNH",
        type: "file-upload",
        accept: "image/*",
        maxSize: 5242880, // 5MB
        helperText: "Arraste uma foto ou clique para fazer upload. JPG ou PNG até 5MB"
      }
    ]
  },

  history: {
    title: "Histórico",
    icon: <ClockIcon className="w-4 h-4" />,
    fields: [
      {
        name: "trips",
        label: "Viagens",
        type: "table"
      }
    ]
  },

  notes: {
    title: "Observações",
    icon: <MessageSquare className="w-4 h-4" />,
    fields: [
      {
        name: "notes",
        label: "Observações",
        type: "textarea"
      }
    ]
  }
};

// 2. Componente de Seção
const FormSection = ({ 
  title, 
  icon, 
  children,
  isOpen,
  onToggle 
}: FormSectionProps) => {
  return (
    <Card className="mb-4">
      <div 
        className="p-4 flex items-center cursor-pointer" 
        onClick={onToggle}
      >
        <div className="flex items-center flex-1">
          {icon}
          <h2 className="text-lg font-semibold ml-2">{title}</h2>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </div>
      {isOpen && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
};

interface DriverFormProps {
  driver?: Driver;
  onSuccess?: (data: Driver) => void;
  onCancel?: () => void;
}

interface FileUploadFieldProps {
  onChange: (file: File | null) => void;
  value: File | null;
  accept: string;
  maxSize: number;
  label: string;
  helperText?: string;
}

const FileUploadField = ({ onChange, value, accept, maxSize, label, helperText }: FileUploadFieldProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > maxSize) {
        alert(`Arquivo muito grande. Tamanho máximo: ${maxSize / 1024 / 1024}MB`);
        e.target.value = '';
        return;
      }

      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
             onClick={() => inputRef.current?.click()}>
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-2">
            <p className="text-sm font-semibold">{label}</p>
            {helperText && <p className="text-sm text-muted-foreground mt-1">{helperText}</p>}
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

// Função auxiliar para renderizar campos
const renderField = (fieldConfig: any, field: any) => {
  switch (fieldConfig.type) {
    case "input":
      return <Input {...field} />;
    case "masked-input":
      return <MaskedInput {...field} mask={fieldConfig.mask} />;
    case "textarea":
      return <Textarea {...field} />;
    case "file-upload":
      return (
        <FileUploadField
          onChange={field.onChange}
          value={field.value}
          accept={fieldConfig.accept}
          maxSize={fieldConfig.maxSize}
          label={fieldConfig.label}
          helperText={fieldConfig.helperText}
        />
      );
    case "select":
      return (
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
        >
          <SelectTrigger>
            <SelectValue placeholder={fieldConfig.placeholder} />
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
    default:
      return null;
  }
};

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, 
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export function DriverForm({ driver, onSuccess, onCancel }: DriverFormProps) {
  const [openSections, setOpenSections] = useState({
    basicInfo: true,
    contact: true,
    documents: false,
    history: false,
    notes: false
  });

  const form = useForm({
    defaultValues: {
      name: driver?.name || "",
      cpf: driver?.cpf || "",
      cnh: driver?.cnh || "",
      email: driver?.email || "",
      phone: driver?.phone || "",
      notes: driver?.notes || "",
    }
  });

  const onSubmit = (data: any) => {
    if (onSuccess) {
      const formattedData: Driver = {
        ...data,
        id: driver?.id || generateUUID(),
        status: driver?.status || "active",
        updatedAt: new Date().toISOString(),
      };
      onSuccess(formattedData);
    }
  };

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
            {key === 'basicInfo' ? (
              <div className="flex items-start space-x-4">
                <div className="w-[40%]">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input {...field} className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-[30%]">
                  <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <MaskedInput {...field} mask="999.999.999-99" className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-[30%]">
                  <FormField
                    control={form.control}
                    name="cnh"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNH</FormLabel>
                        <FormControl>
                          <MaskedInput {...field} mask="999999999999" className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.fields.map(field => (
                  !field.showIf || field.showIf(form.getValues()) ? (
                    <FormField
                      key={field.name}
                      control={form.control}
                      name={field.name}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>{field.label}</FormLabel>
                          <FormControl>
                            {renderField(field, formField)}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : null
                ))}
              </div>
            )}
          </FormSection>
        ))}

        <div className="flex justify-end gap-4 mt-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit">
            {driver ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
