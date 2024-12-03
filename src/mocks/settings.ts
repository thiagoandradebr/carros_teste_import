import { CompanySettings } from "@/types";

export const mockSettings: CompanySettings = {
  id: "1",
  name: "Car Rental Harmony",
  document: "12.345.678/0001-90",
  email: "contato@carrentalharmony.com",
  phone: "(11) 99999-9999",
  address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100",
  logo: "https://carrentalharmony.com/logo.png",
  website: "www.carrentalharmony.com",
  socialMedia: {
    instagram: "@carrentalharmony",
    facebook: "carrentalharmony",
    linkedin: "car-rental-harmony"
  },
  bankInfo: {
    bank: "Banco do Brasil",
    agency: "1234-5",
    account: "12345-6",
    pixKey: "12.345.678/0001-90"
  },
  updatedAt: new Date().toISOString()
};
