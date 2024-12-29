import { VehicleBrand, VehicleModel } from "@/types/vehicle";

interface Option {
  value: string;
  label: string;
}

export const vehicleBrands: Option[] = [
  { value: "JEEP", label: "Jeep" },
  { value: "CITROEN", label: "Citroën" },
  { value: "BYD", label: "BYD" },
  { value: "TOYOTA", label: "Toyota" },
  { value: "MERCEDES", label: "Mercedes" }
];

export const vehicleModelsByBrand: Record<VehicleBrand, Option[]> = {
  JEEP: [
    { value: "COMMANDER", label: "Commander" }
  ],
  CITROEN: [
    { value: "JUMPY", label: "Jumpy" }
  ],
  BYD: [
    { value: "SONG PLUS", label: "Song Plus" }
  ],
  TOYOTA: [
    { value: "COROLLA", label: "Corolla" }
  ],
  MERCEDES: [
    { value: "VITO", label: "Vito" }
  ]
};

export const coresVeiculo: Option[] = [
  { value: "PRETO", label: "Preto" },
  { value: "CINZA", label: "Cinza" },
  { value: "PRATA", label: "Prata" },
  { value: "AZUL", label: "Azul" },
  { value: "BRANCO", label: "Branco" }
];

export const categoriasVeiculo: Option[] = [
  { value: "SUV", label: "SUV" },
  { value: "SEDAN", label: "Sedan" },
  { value: "MINIVAN", label: "Minivan" },
  { value: "VAN", label: "Van" },
  { value: "LUXO", label: "Luxo" }
];

export const documentTypes: Option[] = [
  { value: "crlv", label: "CRLV" },
  { value: "ipva", label: "IPVA" },
  { value: "seguro", label: "Seguro" },
  { value: "manutencao", label: "Manutenção" },
  { value: "outro", label: "Outro" }
];
