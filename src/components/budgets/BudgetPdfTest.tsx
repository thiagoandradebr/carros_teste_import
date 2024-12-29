import { useState } from "react";
import { Budget } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface BudgetPdfTestProps {
  budget: Budget;
}

export function BudgetPdfTest({ budget }: BudgetPdfTestProps) {
  const [selectedGenerator, setSelectedGenerator] = useState<string>("");
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedGenerator) return;

    setIsGenerating(true);
    setStatus({ type: null, message: "" });

    try {
      const generator = await import(`./pdf-generators/${selectedGenerator}`);
      await generator.default.generate({
        budget,
        onGenerated: (url) => {
          setStatus({
            type: "success",
            message: `PDF gerado com sucesso usando ${generator.default.name}!`,
          });
          // Abrir o PDF em uma nova aba
          window.open(url, "_blank");
        },
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: `Erro ao gerar PDF: ${error.message}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teste de Geradores PDF</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Select
            value={selectedGenerator}
            onValueChange={setSelectedGenerator}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione o gerador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="react-pdf">React PDF</SelectItem>
              <SelectItem value="jspdf">jsPDF</SelectItem>
              <SelectItem value="pdfmake">PDFMake</SelectItem>
              <SelectItem value="html2pdf">HTML2PDF</SelectItem>
              <SelectItem value="renderer">@react-pdf/renderer</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={handleGenerate}
            disabled={!selectedGenerator || isGenerating}
          >
            {isGenerating ? "Gerando..." : "Gerar PDF"}
          </Button>
        </div>

        {status.type && (
          <Alert variant={status.type === "error" ? "destructive" : "default"}>
            {status.type === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <AlertTitle>
              {status.type === "error" ? "Erro" : "Sucesso"}
            </AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
