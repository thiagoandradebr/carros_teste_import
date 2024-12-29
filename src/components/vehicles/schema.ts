import * as z from "zod";
import { VehicleColor } from "@/types/vehicle";

export const formSchema = z.object({
  brand: z.enum(["JEEP", "CITROEN", "BYD", "TOYOTA", "MERCEDES"] as const),
  model: z.enum(["COMMANDER", "JUMPY", "SONG PLUS", "COROLLA", "VITO"] as const),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  plate: z.string().min(7, "A placa deve ter 7 caracteres"),
  color: z.enum(["PRETO", "CINZA", "PRATA", "AZUL", "BRANCO"] as const) satisfies z.ZodType<VehicleColor>,
  category: z.enum(["SUV", "SEDAN", "MINIVAN", "VAN", "LUXO"] as const),
  supplier: z.string().optional(),
  isArmored: z.boolean().default(false),
  isOwned: z.boolean().default(false),
  mileage: z.coerce.number().min(0).optional(),
  status: z.enum(["active", "maintenance", "inactive"] as const).default("active"),
  notes: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;
