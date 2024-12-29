import React, { createContext, useContext, useState, useEffect } from "react";
import { CompanySettings } from "@/types";

interface Settings {
  company: CompanySettings;
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  error: string | null;
  updateSettings: (newSettings: Settings) => Promise<void>;
}

const SETTINGS_STORAGE_KEY = 'app_settings';

const defaultSettings: Settings = {
  company: {
    id: "",
    name: "",
    document: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    logo: "",
    website: "",
    socialMedia: {
      instagram: "",
      facebook: "",
      linkedin: "",
    },
    bankInfo: {
      bank: "",
      agency: "",
      account: "",
      pixKey: "",
    },
    updatedAt: new Date().toISOString(),
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar configurações do localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      console.log('Configurações salvas:', savedSettings);
      
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        console.log('Configurações carregadas:', parsedSettings);
        setSettings(parsedSettings);
      } else {
        console.log('Nenhuma configuração encontrada, usando padrão:', defaultSettings);
      }
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
      setError("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar configurações
  const updateSettings = async (newSettings: Settings) => {
    try {
      const settingsWithTimestamp = {
        ...newSettings,
        company: {
          ...newSettings.company,
          updatedAt: new Date().toISOString(),
        },
      };
      
      console.log('Salvando novas configurações:', settingsWithTimestamp);
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsWithTimestamp));
      setSettings(settingsWithTimestamp);
    } catch (err) {
      console.error("Erro ao atualizar configurações:", err);
      throw new Error("Erro ao atualizar configurações");
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings deve ser usado dentro de um SettingsProvider");
  }
  return context;
}
