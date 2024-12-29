import { Customer } from "@/types/customer";

const STORAGE_KEY = "customers";

export function loadCustomers(): Customer[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCustomer(customers: Customer[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

export function removeCustomer(id: string) {
  const customers = loadCustomers();
  const filtered = customers.filter(customer => customer.id !== id);
  saveCustomer(filtered);
}
