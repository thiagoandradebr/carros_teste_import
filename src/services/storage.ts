import localforage from 'localforage';

// Configuração do LocalForage
localforage.config({
  name: 'CarRentalHarmony',
  storeName: 'harmony_store',
  description: 'Persistent storage for Car Rental Harmony'
});

// Cria stores separados para diferentes tipos de dados
const stores = {
  vehicles: localforage.createInstance({
    name: "CarRentalHarmony",
    storeName: "vehicles"
  }),
  services: localforage.createInstance({
    name: "CarRentalHarmony",
    storeName: "services"
  }),
  drivers: localforage.createInstance({
    name: "CarRentalHarmony",
    storeName: "drivers"
  }),
  customers: localforage.createInstance({
    name: "CarRentalHarmony",
    storeName: "customers"
  })
};

// Funções genéricas de CRUD
export async function saveItem<T>(storeName: keyof typeof stores, key: string, value: T): Promise<T> {
  try {
    await stores[storeName].setItem(key, value);
    return value;
  } catch (error) {
    console.error(`Error saving ${storeName}:`, error);
    throw error;
  }
}

export async function getItem<T>(storeName: keyof typeof stores, key: string): Promise<T | null> {
  try {
    return await stores[storeName].getItem<T>(key);
  } catch (error) {
    console.error(`Error getting ${storeName}:`, error);
    throw error;
  }
}

export async function removeItem(storeName: keyof typeof stores, key: string): Promise<void> {
  try {
    await stores[storeName].removeItem(key);
  } catch (error) {
    console.error(`Error removing ${storeName}:`, error);
    throw error;
  }
}

export async function getAllItems<T>(storeName: keyof typeof stores): Promise<T[]> {
  try {
    const items: T[] = [];
    await stores[storeName].iterate<T, void>((value) => {
      items.push(value);
    });
    return items;
  } catch (error) {
    console.error(`Error getting all ${storeName}:`, error);
    throw error;
  }
}

export async function clearStore(storeName: keyof typeof stores): Promise<void> {
  try {
    await stores[storeName].clear();
  } catch (error) {
    console.error(`Error clearing ${storeName}:`, error);
    throw error;
  }
}

// Função para backup
export async function exportData(): Promise<Record<string, any>> {
  const data: Record<string, any> = {};
  
  for (const storeName of Object.keys(stores)) {
    data[storeName] = await getAllItems(storeName as keyof typeof stores);
  }
  
  return data;
}

// Função para restaurar backup
export async function importData(data: Record<string, any[]>): Promise<void> {
  for (const [storeName, items] of Object.entries(data)) {
    if (storeName in stores) {
      await clearStore(storeName as keyof typeof stores);
      for (const item of items) {
        await saveItem(storeName as keyof typeof stores, item.id, item);
      }
    }
  }
}
