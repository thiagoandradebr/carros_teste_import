export * from './budget';
export * from './customer';
export * from './vehicle';
export * from './service';
export * from './driver';

export type { BudgetStatus } from './budget';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export type CompanySettings = {
  id?: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  logo?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  bankInfo?: {
    bank: string;
    agency: string;
    account: string;
    pixKey?: string;
  };
  updatedAt?: string;
};
