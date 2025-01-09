if (typeof window !== 'undefined' && !window.crypto) {
  const nodeCrypto = require('crypto');
  window.crypto = {
    getRandomValues: function(buffer: any) {
      return nodeCrypto.randomFillSync(buffer);
    },
    subtle: {} as SubtleCrypto
  } as Crypto;
} 