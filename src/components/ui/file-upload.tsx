import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";

interface FileUploadProps {
  accept?: string;
  onChange: (file: File) => void;
  value?: string;
  className?: string;
  previewEnabled?: boolean;
}

export function FileUpload({ accept, onChange, value, className, previewEnabled = true }: FileUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  // Simula o upload do arquivo e retorna uma URL temporária
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const isPDF = value?.toLowerCase().endsWith('.pdf');

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none relative",
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      {value && previewEnabled ? (
        isPDF ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <UploadCloud className="w-8 h-8 text-gray-500" />
            <span className="mt-2 text-sm text-gray-600">
              Documento PDF selecionado
            </span>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={value}
              alt="Preview"
              className="object-contain w-full h-full"
            />
          </div>
        )
      ) : (
        <div className="flex flex-col items-center">
          <UploadCloud className="w-8 h-8 text-gray-500" />
          <span className="mt-2 text-base text-gray-600">
            Arraste ou clique para fazer upload
          </span>
        </div>
      )}
    </div>
  );
}
