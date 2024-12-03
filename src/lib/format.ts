import { cpf, cnpj } from 'cpf-cnpj-validator';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

export function unformatPhone(value: string): string {
  return value.replace(/\D/g, '');
}

export function validateCPFCNPJ(value: string): boolean {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length === 11) {
    return cpf.isValid(numbers);
  }
  if (numbers.length === 14) {
    return cnpj.isValid(numbers);
  }
  return false;
}

export function formatCPFCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  if (numbers.length === 14) {
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return numbers;
}

export function unformatDocument(value: string): string {
  return value.replace(/\D/g, '');
}

export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');
    return contentType?.startsWith('image/') ?? false;
  } catch {
    return false;
  }
}
