import { cn } from '@/lib/utils';

// Verifica se estamos no ambiente do navegador
const isBrowser = typeof window !== 'undefined';

// Cria um objeto crypto se não existir
const cryptoObj = isBrowser ? (window.crypto || (window as any).msCrypto) : global.crypto;

// Garante que o crypto está disponível globalmente
if (isBrowser && !window.crypto) {
  (window as any).crypto = cryptoObj;
}

if (typeof cryptoObj !== 'undefined' && !cryptoObj.randomUUID) {
  cryptoObj.randomUUID = (): `${string}-${string}-${string}-${string}-${string}` => {
    const uuid = (String([1e7]) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (Number(c) ^ (cryptoObj.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16)
    );
    return `${uuid.slice(0,8)}-${uuid.slice(8,12)}-${uuid.slice(12,16)}-${uuid.slice(16,20)}-${uuid.slice(20)}` as const;
  };
}

export default cryptoObj;