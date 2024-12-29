import { ChangeEvent, useRef, useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function ImageUpload({ value, onChange, onClear }: ImageUploadProps) {
  const [preview, setPreview] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Arquivo muito grande. O tamanho máximo é 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      onChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview(undefined);
    onClear();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Logo preview"
            className="w-48 h-48 object-contain rounded-lg border border-gray-200"
          />
          <button
            onClick={handleClear}
            className="absolute -top-2 -right-2 p-1 bg-white rounded-full border border-gray-200 hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-gray-400 transition-colors">
          <Upload className="w-8 h-8 text-gray-400" />
          <p className="text-sm text-gray-500">Clique para fazer upload</p>
          <p className="text-xs text-gray-400">PNG, JPG (max. 5MB)</p>
        </div>
      )}
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? "Trocar imagem" : "Selecionar imagem"}
      </Button>
    </div>
  );
}
