import { cpf, cnpj } from 'cpf-cnpj-validator';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatPhone(phone: string): string {
  // Se estiver vazio, retorna vazio
  if (!phone) return '';
  
  // Remove espaços extras
  phone = phone.trim();
  
  // Se começar com +, mantém o formato internacional
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  // Se tiver 11 dígitos (formato brasileiro), formata como (XX) XXXXX-XXXX
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  // Se não se encaixar em nenhum formato específico, retorna apenas os dígitos
  return cleanPhone;
}

export function unformatPhone(phone: string): string {
  // Se estiver vazio, retorna vazio
  if (!phone) return '';
  
  // Remove espaços extras
  phone = phone.trim();
  
  // Se começar com +, mantém o + e remove outros caracteres não numéricos
  if (phone.startsWith('+')) {
    return '+' + phone.slice(1).replace(/\D/g, '');
  }
  
  // Se não começar com +, apenas remove caracteres não numéricos
  return phone.replace(/\D/g, '');
}

export function getWhatsAppLink(phone: string): string {
  // Remove todos os caracteres não numéricos, exceto o +
  const unformattedPhone = unformatPhone(phone);
  
  // Se não tiver código do país, assume Brasil (+55)
  if (!unformattedPhone.startsWith('+')) {
    const numberWithoutCountry = unformattedPhone.startsWith('55') 
      ? unformattedPhone.slice(2) 
      : unformattedPhone;
    return `https://wa.me/55${numberWithoutCountry}`;
  }
  
  // Remove o + para o link do WhatsApp
  return `https://wa.me/${unformattedPhone.slice(1)}`;
}

export function isValidInternationalPhone(phone: string): boolean {
  // Se estiver vazio, não é válido
  if (!phone) return false;
  
  // Remove formatação mantendo o +
  const cleaned = unformatPhone(phone);
  
  // Deve começar com + e ter pelo menos mais 5 dígitos
  return cleaned.startsWith('+') && cleaned.length >= 6;
}

// Função para validar CPF
export function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]/g, '');

  if (cpf.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
}

// Função para validar CNPJ
export function validateCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]/g, '');

  if (cnpj.length !== 14) return false;

  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  const digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

// Função para validar CPF ou CNPJ
export function validateCPFCNPJ(document: string): boolean {
  const cleanDocument = document.replace(/[^\d]/g, '');
  
  if (cleanDocument.length === 11) {
    return validateCPF(cleanDocument);
  } else if (cleanDocument.length === 14) {
    return validateCNPJ(cleanDocument);
  }
  
  return false;
}

// Função para formatar CPF ou CNPJ
export function formatCPFCNPJ(document: string): string {
  const cleanDocument = document.replace(/[^\d]/g, '');
  
  if (cleanDocument.length === 11) {
    return cleanDocument.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (cleanDocument.length === 14) {
    return cleanDocument.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return document;
}

// Função para remover formatação de documento
export function unformatDocument(document: string): string {
  return document.replace(/[^\d]/g, '');
}

// Função para formatar CPF
export function formatCPF(cpf: string) {
  // Remove caracteres não numéricos
  const numbers = cpf.replace(/\D/g, '');

  // Aplica a máscara do CPF: XXX.XXX.XXX-XX
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Mapa de códigos de telefone para códigos de país
const phoneToCountry: { [key: string]: string } = {
  '1': 'US',   // Estados Unidos/Canadá
  '55': 'BR',  // Brasil
  '351': 'PT', // Portugal
  '44': 'GB',  // Reino Unido
  '34': 'ES',  // Espanha
  '33': 'FR',  // França
  '49': 'DE',  // Alemanha
  '39': 'IT',  // Itália
  '81': 'JP',  // Japão
  '86': 'CN',  // China
  // Adicione mais países conforme necessário
};

export function getCountryFromPhone(phone: string): string {
  if (!phone || !phone.startsWith('+')) return 'BR';
  
  // Remove o + e quaisquer caracteres não numéricos
  const numbers = phone.slice(1).replace(/\D/g, '');
  
  // Tenta encontrar o código do país testando diferentes comprimentos
  for (let i = 3; i > 0; i--) {
    const code = numbers.slice(0, i);
    if (phoneToCountry[code]) {
      return phoneToCountry[code];
    }
  }
  
  // Se não encontrar, retorna Brasil como padrão
  return 'BR';
}

export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) return false;

    const contentType = response.headers.get('content-type');
    return contentType ? contentType.startsWith('image/') : false;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Erro ao validar imagem: ${error.message}`);
    }
    return false;
  }
}
