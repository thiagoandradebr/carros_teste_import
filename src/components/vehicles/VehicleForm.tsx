import { useState, useRef, useEffect } from "react";
import { 
  Vehicle, 
  VehicleCategory, 
  VehicleBrand,
  VehicleModel,
  VehicleStatus,
  VehicleDocument,
  VehicleDocumentType,
  VehiclePhoto,
  VehicleRentalHistory,
} from "@/types/vehicle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormData } from "./schema";
import { generateUUID } from "@/utils/uuid";
import { 
  Button 
} from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CarFront, 
  Calendar, 
  Palette, 
  Tag, 
  FileText, 
  Upload, 
  Trash2, 
  Eye, 
  Camera, 
  History, 
  StickyNote, 
  ImagePlus, 
  Star,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";

import { 
  vehicleBrands,
  vehicleModelsByBrand,
  coresVeiculo,
  categoriasVeiculo,
  documentTypes
} from "./constants";

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSuccess: (data: Partial<Vehicle>) => void;
  onCancel: () => void;
  isDuplicating?: boolean;
}

export function VehicleForm({ vehicle, onSuccess, onCancel, isDuplicating }: VehicleFormProps) {
  const [selectedBrand, setSelectedBrand] = useState<VehicleBrand | undefined>(vehicle?.brand as VehicleBrand | undefined);
  const [documents, setDocuments] = useState<VehicleDocument[]>(vehicle?.documents || []);
  const [photos, setPhotos] = useState<VehiclePhoto[]>(vehicle?.photos || []);
  const [photosPreviews, setPhotosPreviews] = useState<{ file: File; preview: string }[]>([]);
  const [rentalHistory] = useState<VehicleRentalHistory[]>(vehicle?.rentalHistory || []);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<VehicleDocumentType>("outro");
  const [openSections, setOpenSections] = useState({
    photos: false,
    documents: false,
    history: false,
    notes: false
  });
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      photosPreviews.forEach(item => URL.revokeObjectURL(item.preview));
    };
  }, [photosPreviews]);

  useEffect(() => {
    if (vehicle) {
      setSelectedBrand(vehicle.brand as VehicleBrand);
    }
  }, [vehicle]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: vehicle?.brand || undefined,
      model: vehicle?.model || undefined,
      year: vehicle?.year || new Date().getFullYear(),
      plate: vehicle?.plate || "",
      color: (vehicle?.color as "PRETO" | "CINZA" | "PRATA" | "AZUL" | "BRANCO") || "PRETO",
      category: vehicle?.category || undefined,
      supplier: vehicle?.supplier || "",
      isArmored: vehicle?.isArmored || false,
      isOwned: vehicle?.ownership === "own" || false,
      mileage: vehicle?.mileage || 0,
      status: vehicle?.status || "active",
      notes: vehicle?.notes || "",
    },
  });

  useEffect(() => {
    const isOwned = form.watch("isOwned");
    if (isOwned) {
      form.setValue("supplier", "Greco Blindados");
    } else {
      form.setValue("supplier", "");
    }
  }, [form.watch("isOwned")]);

  const onSubmit = (data: FormData) => {
    const finalData: Partial<Vehicle> = {
      id: vehicle?.id || generateUUID(),
      brand: data.brand,
      model: data.model,
      year: data.year,
      plate: data.plate.toUpperCase(),
      color: data.color,
      category: data.category,
      supplier: data.supplier,
      isArmored: data.isArmored,
      ownership: data.isOwned ? "own" as const : "third-party" as const,
      mileage: data.mileage,
      status: data.status,
      notes: data.notes,
      photos: photos,
      documents: documents,
      rentalHistory: vehicle?.rentalHistory || [],
      rentals: vehicle?.rentals || [],
      maintenanceHistory: vehicle?.maintenanceHistory || [],
      updatedAt: new Date().toISOString(),
    };

    onSuccess(finalData);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const newPreviews = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      setPhotosPreviews(prev => [...prev, ...newPreviews]);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const newPhotos = newPreviews.map((preview, index) => ({
        id: generateUUID(),
        url: preview.preview,
        description: `Foto ${photos.length + index + 1}`,
        uploadedAt: new Date().toISOString(),
        isPrimary: photos.length === 0 && index === 0
      }));

      setPhotos(prev => [...prev, ...newPhotos]);
    } catch (error) {
      console.error('Erro ao fazer upload das fotos:', error);
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer.files);
    if (files.length === 0) return;

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setIsUploading(true);

    try {
      const newPreviews = imageFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      setPhotosPreviews(prev => [...prev, ...newPreviews]);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const newPhotos = newPreviews.map((preview, index) => ({
        id: generateUUID(),
        url: preview.preview,
        description: `Foto ${photos.length + index + 1}`,
        uploadedAt: new Date().toISOString(),
        isPrimary: photos.length === 0 && index === 0
      }));

      setPhotos(prev => [...prev, ...newPhotos]);
    } catch (error) {
      console.error('Erro ao fazer upload das fotos:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    try {
      const newDocuments: VehicleDocument[] = Array.from(files).map((file) => ({
        id: generateUUID(),
        name: file.name,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
        type: selectedDocumentType,
      }));

      setDocuments((prev) => [...prev, ...newDocuments]);
    } catch (error) {
      console.error('Erro ao fazer upload dos documentos:', error);
    } finally {
      setIsUploading(false);
      if (documentInputRef.current) {
        documentInputRef.current.value = '';
      }
    }
  };

  const handleSetPrimaryPhoto = (event: React.MouseEvent, photoId: string) => {
    event.preventDefault();
    setPhotos((prev) =>
      prev.map((photo) => ({
        ...photo,
        isPrimary: photo.id === photoId,
      }))
    );
  };

  const handleDeletePhoto = (event: React.MouseEvent, photoId: string) => {
    event.preventDefault();
    setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  };

  const handleDeleteDocument = (event: React.MouseEvent, documentId: string) => {
    event.preventDefault();
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
  };

  const handleViewDocument = (event: React.MouseEvent, url: string) => {
    event.preventDefault();
    window.open(url, '_blank');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center space-x-2 mb-5">
              <CarFront className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Informações do Veículo</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedBrand(value as VehicleBrand);
                        form.setValue("model", undefined);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a marca" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleBrands.map((brand) => (
                          <SelectItem key={brand.value} value={brand.value}>
                            {brand.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!selectedBrand}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o modelo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedBrand &&
                          vehicleModelsByBrand[selectedBrand].map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
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
                      <Input type="number" {...field} />
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
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={form.watch("isOwned")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="isOwned"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Próprio</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isArmored"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Blindado</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center space-x-2 mb-5">
              <Tag className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Detalhes</h3>
            </div>

            <div className="grid grid-cols-4 gap-5">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriasVeiculo.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma cor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {coresVeiculo.map((cor) => (
                          <SelectItem key={cor.value} value={cor.value}>
                            {cor.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KM</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer"
          onClick={() => setOpenSections(prev => ({ ...prev, photos: !prev.photos }))}
        >
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Fotos</h3>
              </div>
              {openSections.photos ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>

            {openSections.photos && (
              <div 
                className="space-y-4"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Fotos do Veículo</h4>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={photoInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        photoInputRef.current?.click();
                      }}
                      disabled={isUploading}
                    >
                      <ImagePlus className="h-4 w-4" />
                      {isUploading ? 'Enviando...' : 'Adicionar Fotos'}
                    </Button>
                  </div>
                </div>

                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Arraste e solte suas fotos aqui ou clique no botão acima para selecionar
                  </p>
                </div>

                {photos.length === 0 && photosPreviews.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    Nenhuma foto adicionada
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    {photosPreviews.map((preview, index) => (
                      <div key={preview.preview} className="relative group animate-pulse">
                        <img
                          src={preview.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg opacity-50"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm text-muted-foreground">Enviando...</span>
                        </div>
                      </div>
                    ))}
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.url}
                          alt={photo.description || "Foto do veículo"}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        {photo.isPrimary && (
                          <Badge variant="secondary" className="absolute top-2 left-2 gap-1">
                            <Star className="h-3 w-3" />
                            Principal
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDocument(e, photo.url);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetPrimaryPhoto(e, photo.id);
                            }}
                            disabled={photo.isPrimary}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePhoto(e, photo.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer"
          onClick={() => setOpenSections(prev => ({ ...prev, documents: !prev.documents }))}
        >
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Documentos</h3>
              </div>
              {openSections.documents ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>

            {openSections.documents && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Documentos Anexados</h4>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={selectedDocumentType} 
                      onValueChange={(value: VehicleDocumentType) => setSelectedDocumentType(value)}
                      onOpenChange={(open) => {
                        if (open) {
                          event?.stopPropagation();
                        }
                      }}
                    >
                      <SelectTrigger 
                        className="w-[180px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <SelectValue placeholder="Tipo do documento" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((type) => (
                          <SelectItem 
                            key={type.value} 
                            value={type.value}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="file"
                      ref={documentInputRef}
                      onChange={handleDocumentUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      multiple
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        documentInputRef.current?.click();
                      }}
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4" />
                      {isUploading ? 'Enviando...' : 'Anexar Documento'}
                    </Button>
                  </div>
                </div>

                {documents.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                    Nenhum documento anexado
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-primary" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{doc.name}</p>
                              <Badge variant="outline" className="text-xs">
                                {documentTypes.find(t => t.value === doc.type)?.label || doc.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {doc.expirationDate
                                ? `Vence em ${format(new Date(doc.expirationDate), "dd/MM/yyyy", {
                                    locale: ptBR,
                                  })}`
                                : `Enviado em ${format(new Date(doc.uploadedAt), "dd/MM/yyyy", {
                                    locale: ptBR,
                                  })}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDocument(e, doc.url);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDocument(e, doc.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer"
          onClick={() => setOpenSections(prev => ({ ...prev, history: !prev.history }))}
        >
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2">
                <History className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Histórico de Locações</h3>
              </div>
              {openSections.history ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>

            {openSections.history && (
              <>
                {rentalHistory.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                    Nenhuma locação registrada
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rentalHistory.map((rental) => (
                      <div
                        key={rental.id}
                        className="flex items-center justify-between p-4 bg-muted rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{rental.customerName}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(rental.startDate), "dd/MM/yyyy", { locale: ptBR })} -{" "}
                            {format(new Date(rental.endDate), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                          {rental.notes && (
                            <p className="text-xs text-muted-foreground">{rental.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(rental.totalAmount)}
                            </p>
                            <Badge
                              variant={
                                rental.status === "active"
                                  ? "default"
                                  : rental.status === "completed"
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="mt-1"
                            >
                              {rental.status === "active"
                                ? "Em Andamento"
                                : rental.status === "completed"
                                ? "Concluída"
                                : "Cancelada"}
                            </Badge>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Implementar visualização detalhada da locação
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer"
          onClick={() => setOpenSections(prev => ({ ...prev, notes: !prev.notes }))}
        >
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-2">
                <StickyNote className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Observações</h3>
              </div>
              {openSections.notes ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>

            {openSections.notes && (
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem onClick={(e) => e.stopPropagation()}>
                    <FormControl>
                      <Textarea
                        placeholder="Adicione observações sobre o veículo..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-32"
          >
            Cancelar
          </Button>
          <Button type="submit" className="w-32">
            {vehicle ? "Salvar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}