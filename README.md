# Bürküt Official SDKs 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Website](https://img.shields.io/badge/Website-burkutportfoy.com-blue)](https://burkutportfoy.com)
[![Documentation](https://img.shields.io/badge/Docs-Developer%20Portal-green)](https://burkutportfoy.com/developers)

Bürküt Finansal Veri Platformu için resmi **Python** ve **Node.js / TypeScript** istemci kütüphaneleri (SDK).

Borsa İstanbul (BIST), Canlı Döviz Kurları (Forex), Altın ve Kıymetli Madenler, TEFAS Yatırım Fonları, Tahvil/Bono ve VİOP vadeli sözleşmelerine saniyeler içinde erişin.

---

## 📦 Mevcut SDK'lar

| Dil | Dizin | Kurulum | Durum |
|---|---|---|---|
| **Python** (3.8+) | [`/python`](./python) | `pip install burkut` | ✅ Stabil (v1.0.0) |
| **Node.js / TS** (18+) | [`/nodejs`](./nodejs) | `npm install burkut` | ✅ Stabil (v1.0.0) |

---

## ⚡ Hızlı Başlangıç

### Python Örneği
```bash
pip install burkut
```
```python
from burkut import BurkutClient

client = BurkutClient(api_key="bk_live_...")

# BIST Hisse Senedi
thyao = client.stocks.get("THYAO")
print(f"Fiyat: {thyao['last_price']} TL, Değişim: %{thyao['change_rate']}")

# Canlı Döviz & Altın
usd = client.forex.get("USDTRY")
altin = client.gold.get("ALTIN_GRAM")
```

### Node.js / TypeScript Örneği
```bash
npm install burkut
```
```typescript
import { BurkutClient } from 'burkut';

const client = new BurkutClient({ apiKey: 'bk_live_...' });

// BIST Hisse Senedi
const garan = await client.stocks.get('GARAN');
console.log(`Fiyat: ${garan.last_price} TL, Hacim: ${garan.volume}`);

// TEFAS Yatırım Fonu
const fon = await client.funds.get('TCD');
```

---

## 🔑 API Anahtarı Alma
Bürküt API anahtarınızı ücretsiz almak için [Bürküt Geliştirici Portalı](https://burkutportfoy.com/developer)'nı ziyaret edebilirsiniz.

---

## 📄 Lisans
Bu proje [MIT Lisansı](./LICENSE) ile lisanslanmıştır.
