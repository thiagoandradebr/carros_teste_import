import { Driver } from "@/types/driver";

const STORAGE_KEY = "drivers";

export function loadDrivers(): Driver[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveDriver(drivers: Driver[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drivers));
}

export function removeDriver(id: string) {
  const drivers = loadDrivers();
  const filtered = drivers.filter(driver => driver.id !== id);
  saveDriver(filtered);
}
