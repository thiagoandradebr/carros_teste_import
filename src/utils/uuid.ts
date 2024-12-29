export const generateUUID = () => {
  // Verifica se crypto.randomUUID está disponível
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback para browsers que não suportam crypto.randomUUID
  const getRandomValues = (typeof crypto !== 'undefined' && crypto.getRandomValues)
    ? (array: Uint8Array) => crypto.getRandomValues(array)
    : (array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
        return array;
      };

  const randomBytes = new Uint8Array(16);
  getRandomValues(randomBytes);
  
  // Ajusta os bits conforme especificação UUID v4
  randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40; // Versão 4
  randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80; // Variante RFC4122
  
  // Converte para string hexadecimal
  const hex = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32)
  ].join('-');
};
