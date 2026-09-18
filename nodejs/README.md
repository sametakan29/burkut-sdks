# Bürküt Node.js / TypeScript SDK 🚀

[![npm version](https://img.shields.io/npm/v/burkut.svg)](https://www.npmjs.com/package/burkut)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Bürküt Finansal Veri API'sinin resmi Node.js ve TypeScript kütüphanesidir. **Sıfır dış bağımlılık (Zero-Dependency)** ile Node.js 18+ yerel `fetch` motorunu kullanır.

---

## 📦 Kurulum

```bash
npm install burkut
```

Yarn veya pnpm ile:
```bash
yarn add burkut
# veya
pnpm add burkut
```

---

## ⚡ Hızlı Başlangıç

### TypeScript / ESM
```typescript
import { BurkutClient } from 'burkut';

// API anahtarınız ile istemciyi başlatın
const client = new BurkutClient({ apiKey: 'bk_live_...' });

async function main() {
  // 1. BIST Hisse Senedi
  const thyao = await client.stocks.get('THYAO');
  console.log(`${thyao.symbol}: ${thyao.last_price} TL (%${thyao.change_rate})`);

  // Birden fazla hisseyi sorgulama
  const portfoy = await client.stocks.list(['THYAO', 'GARAN', 'ASELS']);
  console.log(portfoy);

  // 2. Canlı Döviz Kurları
  const usd = await client.forex.get('USDTRY');
  console.log(`Dolar Alış: ${usd.buying} - Satış: ${usd.selling}`);

  // 3. Altın ve Kıymetli Madenler
  const gramAltin = await client.gold.get('ALTIN_GRAM');
  console.log(`Gram Altın: ${gramAltin.buying} TL`);

  // 4. TEFAS Yatırım Fonları
  const fon = await client.funds.get('TCD');
  console.log(`Fon: ${fon.name}, Fiyat: ${fon.price}`);
}

main();
```

### CommonJS
```javascript
const { BurkutClient } = require('burkut');

const client = new BurkutClient({ apiKey: 'bk_live_...' });

client.stocks.get('GARAN').then(stock => {
  console.log(stock);
});
```

---

## 🛡️ Hata Yönetimi

```typescript
import {
  BurkutClient,
  AuthenticationError,
  RateLimitError,
  QuotaExceededError,
  NotFoundError,
} from 'burkut';

const client = new BurkutClient({ apiKey: 'bk_live_...' });

try {
  const stock = await client.stocks.get('THYAO');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('API anahtarı geçersiz!');
  } else if (error instanceof QuotaExceededError) {
    console.error('Aylık istek kotanız doldu.');
  } else if (error instanceof RateLimitError) {
    console.error(`Hız sınırı aşıldı. Tekrar deneme süresi: ${error.retryAfter} saniye`);
  } else if (error instanceof NotFoundError) {
    console.error('Sembol bulunamadı.');
  } else {
    console.error('Bilinmeyen hata:', error);
  }
}
```

---

## 📄 Lisans
MIT License - [Detaylar](../../LICENSE)
