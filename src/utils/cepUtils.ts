interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export async function fetchAddressByCep(cep: string): Promise<CepResponse> {
  const cleanCep = cep.replace(/\D/g, '');
  const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
  if (!response.ok) {
    throw new Error('CEP não encontrado');
  }
  const data = await response.json();
  if (data.erro) {
    throw new Error('CEP não encontrado');
  }
  return data;
}
