# ⚡ Bürküt Node.js & TypeScript SDK

[![npm version](https://img.shields.io/npm/v/burkut.svg?style=flat-square&color=red)](https://www.npmjs.com/package/burkut)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Borsa İstanbul (BIST), TEFAS Yatırım Fonları, Döviz, Altın ve VİOP Piyasaları için Resmi Node.js ve TypeScript İstemcisi.**

Bürküt Finansal Veri API'sinin resmi Node.js kütüphanesidir. **Sıfır dış bağımlılık (Zero-Dependency)** prensibiyle tasarlanmış olup, Node.js 18+ yerel `fetch` motoru üzerinde çalışır. `node_modules` klasörünü şişirmez, anında yüklenir ve tam tip güvenliği (`.d.ts`) sunar.

---

## 🚀 Neden `burkut`?

* ⚡ **Sıfır Dış Bağımlılık (Zero Dependencies):** `axios`, `node-fetch` veya `got` gerektirmez. Yerel `fetch` üzerinde çalışır.
* 🛡️ **%100 TypeScript Desteği:** Tüm modeller (`StockItem`, `ForexItem`, `GoldItem`, `FundItem`) eksiksiz tip tanımlarıyla gelir.
* 📦 **Dual Module Desteği:** Hem modern ESM (`import`) hem de klasik CommonJS (`require`) projelerinde sorunsuz çalışır.
* ⏱️ **Ultra Düşük Gecikme (<100ms):** Bürküt'ün Go + Redis önbellek altyapısı sayesinde yüksek hızlı veri akışı.

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
// (Veya BURKUT_API_KEY ortam değişkenini ayarlayın)
const client = new BurkutClient({ apiKey: 'bk_live_...' });

async function main() {
  // 1. BIST Hisse Senedi Verisi
  const thyao = await client.stocks.get('THYAO');
  console.log(`${thyao.name}: ${thyao.price} TL (Değişim: %${thyao.changePercent})`);

  // Toplu hisse sorgulama
  const portfoy = await client.stocks.list(['THYAO', 'GARAN', 'ASELS']);
  for (const hisse of portfoy) {
    console.log(`${hisse.symbol} -> ${hisse.price} TL`);
  }

  // 2. Canlı Döviz Kurları (USD, EUR vb.)
  const usd = await client.forex.get('USD');
  console.log(`Dolar/TL Alış: ${usd.buyRate} - Satış: ${usd.sellRate}`);

  // 3. Altın Piyasası
  const gramAltin = await client.gold.get('ALTIN');
  console.log(`Gram Altın: ${gramAltin.price} TL`);

  // 4. TEFAS Yatırım Fonları
  const fon = await client.funds.get('TCD');
  console.log(`Fon: ${fon.name} - Birim Fiyat: ${fon.price} TL`);
}

main();
```

### CommonJS (JavaScript)
```javascript
const { BurkutClient } = require('burkut');

const client = new BurkutClient({ apiKey: 'bk_live_...' });

client.stocks.get('GARAN').then(stock => {
  console.log('GARAN Fiyat:', stock.price, 'TL');
});
```

---

## 🌐 Next.js & Express.js Entegrasyon Örneği

Modern web uygulamalarınızda veya API route'larınızda doğrudan kullanabilirsiniz:

```typescript
// pages/api/market.ts veya app/api/market/route.ts
import { NextResponse } from 'next/server';
import { BurkutClient } from 'burkut';

const burkut = new BurkutClient({
  apiKey: process.env.BURKUT_API_KEY!,
});

export async function GET() {
  try {
    const [stocks, usd, gold] = await Promise.all([
      burkut.stocks.list(['THYAO', 'GARAN', 'EREGL']),
      burkut.forex.get('USD'),
      burkut.gold.get('ALTIN'),
    ]);

    return NextResponse.json({
      success: true,
      data: { stocks, usd, gold },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
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

const client = new BurkutClient();

try {
  const stock = await client.stocks.get('THYAO');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Geçersiz veya eksik API anahtarı!');
  } else if (error instanceof RateLimitError) {
    console.error(`Hız sınırı aşıldı! Lütfen ${error.retryAfter} saniye bekleyin.`);
  } else if (error instanceof QuotaExceededError) {
    console.error('Aylık istek kotanız tükendi. PRO plana geçebilirsiniz.');
  } else if (error instanceof NotFoundError) {
    console.error('Sembol bulunamadı.');
  } else {
    console.error('Beklenmeyen hata:', error);
  }
}
```

---

## 🔑 Ücretsiz API Anahtarı Alma
Ücretsiz API anahtarınızı oluşturmak için [Bürküt Geliştirici Portalı](https://burkutportfoy.com/developer)'nı ziyaret edebilirsiniz.

## 📄 Lisans
Bu proje [MIT Lisansı](https://github.com/sametakan29/burkut-sdks/blob/main/LICENSE) ile lisanslanmıştır.
