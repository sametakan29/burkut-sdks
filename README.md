<div align="center">

# 🦅 Bürküt Finans SDK

### Borsa İstanbul (BIST), TEFAS Fonları, Döviz, Altın & VİOP İçin Resmi ve Ultra Hızlı Veri Kütüphanesi

[![Release](https://img.shields.io/badge/release-v1.0.0-blue.svg?style=flat-square)](https://github.com/sametakan29/burkut-sdks/releases)
[![PyPI](https://img.shields.io/badge/PyPI-burkut-blue?style=flat-square&logo=pypi&logoColor=white)](https://pypi.org/project/burkut/)
[![npm](https://img.shields.io/badge/npm-burkut-cb3837?style=flat-square&logo=npm&logoColor=white)](https://www.npmjs.com/package/burkut)
[![Python](https://img.shields.io/badge/Python-3.8%2B-3776AB.svg?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933.svg?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![API Status](https://img.shields.io/badge/API_Status-Online-success?style=flat-square)](https://api.burkutportfoy.com)

**[Dokümantasyon](https://burkutportfoy.com/developer)** • **[Web Sitesi](https://burkutportfoy.com/developers)** • **[API Anahtarı Al](https://burkutportfoy.com/developer)** • **[Postman Koleksiyonu](https://burkutportfoy.com/burkut-api.postman_collection.json)**

</div>

---

## 📌 Neden Bürküt SDK?

Türkiye finansal piyasalarında veri çekmek için geliştiriciler yıllarca dengesiz HTML scraping araçlarıyla, gecikmeli Yahoo Finance verileriyle ya da sürekli IP ban yiyen botlarla uğraşmak zorunda kaldı. 

**Bürküt SDK**, tüm Türkiye finans ekosistemini (BIST hisseleri, TEFAS yatırım fonları, serbest piyasa döviz, altın, tahvil ve VİOP) tek bir standart çatı altında, **sıfır dış bağımlılık (Zero-Dependency)** ve **<100ms ultra düşük gecikme** ile sunan kurumsal seviyede açık kaynak kütüphanedir.

### ⚔️ Karşılaştırma Tablosu

| Özellik | 🦅 Bürküt SDK | yfinance | borsapy / pytefas | Web Scrapers |
|:---|:---:|:---:|:---:|:---:|
| **BIST 100 / Tüm Hisseler** | ✅ Canlı & Anlık | ⚠️ 15 Dk Gecikmeli | ⚠️ Kırılgan Scraping | ❌ Çok Yavaş |
| **TEFAS Yatırım Fonları** | ✅ Resmi JSON API | ❌ Desteklenmiyor | ⚠️ Yalnızca Fonlar | ⚠️ IP Ban Riski |
| **Canlı Altın & Döviz** | ✅ Anlık Fiyatlar | ⚠️ Sınırlı Pariteler | ⚠️ Karışık Kaynaklar | ❌ Bakım Zor |
| **VİOP & Tahvil / Bono** | ✅ Eksiksiz | ❌ Yok | ❌ Yok | ❌ Yok |
| **Dış Bağımlılık (Dependencies)** | 🚀 **0 Bağımlılık** | ❌ 10+ Kütüphane | ❌ Pandas/BS4 Şart | ❌ Selenium/BS4 |
| **Tip Güvenliği (Type-Safe)** | ✅ Tam Type Hints / `.d.ts` | ❌ Zayıf | ⚠️ Kısmi | ❌ Yok |
| **TypeScript / Node.js** | ✅ Resmi SDK | ❌ Sadece Python | ❌ Sadece Python | ❌ Manuel |
| **Kesinti & Patlama Riski** | 🛡️ **%0 (Kurumsal REST API)** | ⚠️ Yahoo UI Değişince | ⚠️ Kaynak HTML Değişince | 🚨 Çok Yüksek |

---

## 📦 Kurulum

### Python (3.8+)
```bash
pip install burkut
```

### Node.js / TypeScript (18+)
```bash
npm install burkut
# veya
pnpm add burkut
```

---

## ⚡ 30 Saniyede Hızlı Başlangıç

### 🐍 Python İle Kullanım
```python
from burkut import BurkutClient

# API anahtarınız ile istemciyi başlatın
# (Veya BURKUT_API_KEY ortam değişkenine atayın)
client = BurkutClient(api_key="bk_live_...")

# 1. BIST Hisse Senedi Fiyatı & Hacmi
thyao = client.stocks.get("THYAO")
print(f"{thyao['name']}: {thyao['price']} TL (Değişim: %{thyao['changePercent']})")

# 2. TEFAS Yatırım Fonu Analizi
tcd = client.funds.get("TCD")
print(f"Fon: {tcd['name']} - Fiyat: {tcd['price']} TL")

# 3. Canlı Döviz & Altın Piyasası
usd = client.forex.get("USD")
altin = client.gold.get("ALTIN")
print(f"Dolar: {usd['buyRate']} TL | Gram Altın: {altin['price']} TL")
```

### ⚡ Node.js / TypeScript İle Kullanım
```typescript
import { BurkutClient } from 'burkut';

const client = new BurkutClient({ apiKey: 'bk_live_...' });

async function main() {
  // BIST Hisseleri
  const stock = await client.stocks.get('GARAN');
  console.log(`${stock.name}: ${stock.price} TL`);

  // TEFAS Yatırım Fonu
  const fon = await client.funds.get('AFT');
  console.log(`Fon Fiyatı: ${fon.price} TL`);

  // Tüm Döviz Kurlarını Listele
  const allForex = await client.forex.list();
  console.log(`Takip Edilen Kur Sayısı: ${allForex.length}`);
}

main();
```

---

## 📊 Algoritmik Ticaret & Pandas Entegrasyonu (Finans Analistleri İçin)

Veri bilimcileri ve algoritmik trade botu geliştirenler için Bürküt SDK, tek satırda **Pandas DataFrame**'e dönüştürülebilir:

```python
import pandas as pd
from burkut import BurkutClient

client = BurkutClient()

# Tüm BIST hisselerini DataFrame'e al
stocks_df = pd.DataFrame(client.stocks.list())

# En çok yükselen ilk 5 BIST hissesi
top_gainers = stocks_df.sort_values(by="changePercent", ascending=False).head(5)
print(top_gainers[["symbol", "name", "price", "changePercent"]])
```

---

## 🤖 Otomasyon & Bot Örneği (Telegram / Discord Fiyat Uyarı Botu)

Dakikalar içinde hisse ve altın fiyatı gönderen bir Telegram botu yazın:

```python
import time
from burkut import BurkutClient

client = BurkutClient()

def fiyat_kontrol():
    thyao = client.stocks.get("THYAO")
    altin = client.gold.get("ALTIN")
    
    mesaj = (
        f"🚨 PİYASA BİLGİLENDİRMESİ 🚨\n\n"
        f"✈️ THYAO: {thyao['price']} TL (%{thyao['changePercent']})\n"
        f"🟡 Gram Altın: {altin['price']} TL"
    )
    print(mesaj)

fiyat_kontrol()
```

---

## 🛡️ Hata Yönetimi & Dayanıklılık (Error Handling)

SDK, ağ kopmalarını ve limit aşımlarını otomatik yakalayan tip güvenli istisna sınıflarıyla gelir:

```python
from burkut import (
    BurkutClient,
    AuthenticationError,
    RateLimitError,
    QuotaExceededError,
    NotFoundError
)

client = BurkutClient()

try:
    data = client.stocks.get("THYAO")
except AuthenticationError:
    print("Geçersiz API Anahtarı! https://burkutportfoy.com/developer adresinden yenisini alın.")
except RateLimitError as e:
    print(f"Dakikalık hız sınırı aşıldı. Lütfen {e.retry_after} saniye sonra tekrar deneyin.")
except QuotaExceededError:
    print("Aylık kota bitti. PRO plana geçiş yapın!")
except NotFoundError:
    print("Sembol bulunamadı.")
```

---

## 📂 Dizin Yapısı

```text
burkut-sdks/
├── python/               # Resmi Python SDK (pip install burkut)
│   ├── burkut/           # Client, Exception sınıfları ve alt modüller
│   ├── tests/            # %100 kapsamlı birim testleri
│   └── pyproject.toml    # Standart PyPI paket konfigürasyonu
│
├── nodejs/               # Resmi Node.js & TypeScript SDK (npm install burkut)
│   ├── src/              # TypeScript kaynak kodları
│   ├── dist/             # Derlenmiş CJS & ESM modülleri (.d.ts tipleriyle)
│   ├── test/             # Yerleşik Node.js birim testleri
│   └── package.json      # Standart npm paket konfigürasyonu
│
└── .github/workflows/    # CI/CD: Çoklu versiyon otomatik test akışı
```

---

## 🔑 Ücretsiz API Anahtarı Nasıl Alınır?

1. [https://burkutportfoy.com/register](https://burkutportfoy.com/register) adresinden ücretsiz hesap oluşturun.
2. E-posta adresinizi doğrulayın.
3. [Geliştirici Portalı](https://burkutportfoy.com/developer) sayfasından **Yeni Anahtar Oluştur** butonuna tıklayın.
4. `bk_live_...` formatındaki anahtarınızı kopyalayıp SDK'da kullanın!

---

## 🤝 Katkıda Bulunma & Topluluk

1. Bu depoyu Fork'layın (`fork`).
2. Kendi özelliğinizi geliştirin (`git checkout -b feature/yeni-ozellik`).
3. Değişikliklerinizi commit'leyin (`git commit -m 'feat: Yeni özellik eklendi'`).
4. Dalınıza push'layın (`git push origin feature/yeni-ozellik`).
5. Bir **Pull Request** açın.

## ⚖️ Yasal Uyarı & Feragatname (Disclaimer)

> **Önemli:** Bu kütüphane tamamen eğitim ve kişisel araştırma amaçlı geliştirilmiştir. Resmi Borsa İstanbul verisi sağlamaz, yatırım tavsiyesi içermez. Veriler üçüncü taraf halka açık kaynaklardan derlenmektedir ve doğruluğu garanti edilmez.

---

## 📄 Lisans
Bu proje **MIT Lisansı** ile lisanslanmıştır. Detaylar için [LICENSE](./LICENSE) dosyasına bakabilirsiniz.

---

<div align="center">

**[Bürküt Finansal Veri Teknolojileri](https://burkutportfoy.com)** tarafından geliştiriciler için ❤️ ile üretilmiştir.

</div>
