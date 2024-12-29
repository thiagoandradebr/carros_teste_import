import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { Building2, Mail, Phone, Globe, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function CompanySettings() {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(settings.company.logo);

  // Estado local para os dados da empresa
  const [companyData, setCompanyData] = useState(settings.company);

  // Atualizar dados da empresa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateSettings({
        ...settings,
        company: companyData,
      });

      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Configurações da Empresa</h1>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Preview Card */}
        <Card className="col-span-12 lg:col-span-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <ImageUpload
                value={companyData.logo}
                onChange={(value) =>
                  setCompanyData({ ...companyData, logo: value })
                }
                onClear={() => setCompanyData({ ...companyData, logo: "" })}
              />
              <div className="w-full space-y-2 mt-4">
                <h2 className="text-2xl font-bold text-center">
                  {companyData.name || "Nome da Empresa"}
                </h2>
                <p className="text-gray-500 text-center">
                  {companyData.address || "Endereço"}
                </p>
                <p className="text-gray-500 text-center">
                  {companyData.city || "Cidade"}
                </p>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{companyData.phone || "Telefone"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{companyData.email || "Email"}</span>
                  </div>
                  {companyData.website && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span>{companyData.website}</span>
                    </div>
                  )}
                  {companyData.document && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>{companyData.document}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Form */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="general" className="flex-1">
                Informações Gerais
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex-1">
                Contato
              </TabsTrigger>
              <TabsTrigger value="social" className="flex-1">
                Redes Sociais
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome da Empresa</Label>
                      <Input
                        id="name"
                        value={companyData.name}
                        onChange={(e) =>
                          setCompanyData({ ...companyData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="document">Documento (CNPJ)</Label>
                      <Input
                        id="document"
                        value={companyData.document}
                        onChange={(e) =>
                          setCompanyData({ ...companyData, document: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        value={companyData.address}
                        onChange={(e) =>
                          setCompanyData({
                            ...companyData,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={companyData.city}
                        onChange={(e) =>
                          setCompanyData({ ...companyData, city: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={companyData.phone}
                        onChange={(e) =>
                          setCompanyData({ ...companyData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={companyData.whatsapp}
                        onChange={(e) =>
                          setCompanyData({
                            ...companyData,
                            whatsapp: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={companyData.email}
                        onChange={(e) =>
                          setCompanyData({ ...companyData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={companyData.website}
                        onChange={(e) =>
                          setCompanyData({
                            ...companyData,
                            website: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={companyData.socialMedia?.instagram || ''}
                        onChange={(e) =>
                          setCompanyData({
                            ...companyData,
                            socialMedia: {
                              ...companyData.socialMedia,
                              instagram: e.target.value,
                            }
                          })
                        }
                        placeholder="@seuinstagram"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={companyData.socialMedia?.facebook || ''}
                        onChange={(e) =>
                          setCompanyData({
                            ...companyData,
                            socialMedia: {
                              ...companyData.socialMedia,
                              facebook: e.target.value,
                            }
                          })
                        }
                        placeholder="facebook.com/suapagina"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={companyData.socialMedia?.linkedin || ''}
                        onChange={(e) =>
                          setCompanyData({
                            ...companyData,
                            socialMedia: {
                              ...companyData.socialMedia,
                              linkedin: e.target.value,
                            }
                          })
                        }
                        placeholder="linkedin.com/company/suaempresa"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
