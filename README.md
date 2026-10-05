<p align="center">
  <img src="./assets/logo.png" alt="Bürküt Logo" width="120" />
</p>

<h1 align="center">Bürküt Finansal Veri Ekosistemi</h1>

<p align="center">
  <b>Türkiye finansal piyasaları için geliştirici odaklı veri altyapısı ve yapay zeka araçları.</b><br />
  Borsa İstanbul (BIST), TEFAS Fonları, KAP Bildirimleri, Döviz Kurları ve Makroekonomik Göstergeler.
</p>

<p align="center">
  <a href="https://pypi.org/project/burkut/"><img src="https://img.shields.io/pypi/v/burkut?color=blue&style=flat-square&logo=pypi&logoColor=white" alt="PyPI" /></a>
  <a href="https://www.npmjs.com/package/burkut"><img src="https://img.shields.io/npm/v/burkut?color=red&style=flat-square&logo=npm&logoColor=white" alt="npm" /></a>
  <a href="https://www.npmjs.com/package/burkut-mcp"><img src="https://img.shields.io/badge/MCP-burkut--mcp-purple?style=flat-square&logo=anthropic&logoColor=white" alt="MCP" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/Lisans-MIT-gray.svg?style=flat-square" alt="Lisans" /></a>
  <a href="https://api.burkutportfoy.com"><img src="https://img.shields.io/badge/API-Aktif-emerald?style=flat-square" alt="API Durumu" /></a>
</p>

<p align="center">
  <a href="https://burkutportfoy.com/developers"><b>Dokümantasyon</b></a> •
  <a href="https://burkutportfoy.com/developer"><b>Geliştirici Portalı</b></a> •
  <a href="./mcp/README.md"><b>MCP Rehberi</b></a> •
  <a href="https://burkutportfoy.com/burkut-api.postman_collection.json"><b>Postman Koleksiyonu</b></a>
</p>

---

## Genel Bakış

Bürküt Finans Ekosistemi; Türkiye sermaye piyasalarında veri çekmek için yıllardır süregelen dengesiz web kazıma (HTML scraping) araçlarına, sürekli IP ban yiyen botlara ve bozuk kütüphanelere modern bir alternatif olarak geliştirilmiştir.

Tüm finansal verileri; yüksek hızlı, önbellek destekli ve tip güvenli (type-safe) bir mimari üzerinden **üç ana kanaldan** sunar:

| Hedef Ortam | Paket | Kurulum / Çalıştırma | Temel Kullanım Amacı |
| :--- | :--- | :--- | :--- |
| **Yapay Zeka (AI / LLM)** | `burkut-mcp` | `npx -y burkut-mcp` | Claude Desktop, Cursor ve Windsurf ajanlarına canlı borsa bağlama |
| **Python (3.8+)** | `burkut` | `pip install burkut` | Algoritmik işlemler, kantitatif finans, Pandas ile veri analizi |
| **TypeScript / Node.js (18+)** | `burkut` | `npm install burkut` | Web servisleri, Discord/Telegram botları, kurumsal entegrasyonlar |

---

## 1. Model Context Protocol (MCP Server)

Türkiye piyasalarını **Claude Desktop**, **Cursor IDE** veya **Windsurf** yapay zeka ajanlarınıza sıfır kurulum zahmetiyle, tek satırda bağlayın.

### Claude Desktop Entegrasyonu

Ayar dosyanızı açın:
* **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
* **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

Aşağıdaki yapılandırmayı ekleyin:

```json
{
  "mcpServers": {
    "burkut": {
      "command": "npx",
      "args": ["-y", "burkut-mcp"],
      "env": {
        "BURKUT_API_KEY": "BURKUT_API_ANAHTARINIZ"
      }
    }
  }
}
```

> **İpucu:** `BURKUT_API_KEY` alanı opsiyoneldir. Anahtar girmeden de temel halka açık modda çalışır. Kesintisiz erişim ve yüksek kotalar için [burkutportfoy.com/developer](https://burkutportfoy.com/developer) adresinden ücretsiz anahtar oluşturabilirsiniz.

### Cursor IDE Entegrasyonu

1. **Cursor Settings** &rarr; **Features** &rarr; **MCP Servers** yolunu izleyin.
2. **Add New MCP Server** butonuna tıklayın:
   * **Name:** `burkut`
   * **Type:** `command`
   * **Command:** `npx -y burkut-mcp`

### Yapay Zekanıza Sorabileceğiniz Örnek Sorular

Entegrasyon tamamlandığında Claude veya Cursor doğrudan canlı piyasa verilerini çekip yorumlayabilir:

```text
"TEFAS'taki hisse senedi fonları arasında son 1 yılda en çok kazandıran 5 fonu ve yıllık getirilerini listele."
"MAC ve TI2 fonlarının risk puanlarını ve son 6 aylık performanslarını karşılaştır."
"Bugün KAP'a düşen önemli şirket bildirimlerini ve yeni iş ilişkilerini özetle."
"Bu ay talep toplayacak halka arzlar hangileri? Dağıtım yöntemleri ve lot fiyatları nedir?"
"FROTO ve TUPRS şirketlerinin temettü verimlerini ve geçmiş ödeme tarihlerini karşılaştırmalı tablo yap."
"TÜİK tarafından açıklanan son yıllık TÜFE enflasyon oranı ile güncel dolar kurunu getir."
```

Detaylı MCP araç listesi ve parametreleri için [`mcp/README.md`](./mcp/README.md) dosyasına göz atın.

---

## 2. Python SDK

### Kurulum

```bash
pip install burkut
```

### Hızlı Başlangıç

```python
from burkut import BurkutClient

# API anahtarınız ile istemciyi başlatın (veya BURKUT_API_KEY ortam değişkenini kullanın)
client = BurkutClient(api_key="bk_live_...")

# 1. BIST Hisse Senedi Verisi (15 Dk Gecikmeli Resmi Akış)
thyao = client.stocks.get("THYAO")
print(f"{thyao.symbol} - {thyao.name}: {thyao.current_price} TL (Günlük Değişim: %{thyao.daily_change_pct})")

# 2. TEFAS Yatırım Fonu Analizi
mac = client.funds.get("MAC")
print(f"{mac.name} - 1 Yıllık Getiri: %{mac.yield_1y} | Risk Seviyesi: {mac.risk_level}")

# 3. Döviz ve Altın Kurları
usd = client.forex.get("USD")
altin = client.gold.get("ALTIN")
print(f"USD/TRY: {usd.buy_rate} | Gram Altın: {altin.current_price} TL")
```

### Pandas ile Kantitatif Analiz ve Tarama (Screening)

Piyasa verilerini tek satırda Pandas DataFrame'ine dönüştürerek analiz yapın:

```python
import pandas as pd
from burkut import BurkutClient

client = BurkutClient()

# Tüm TEFAS fonlarını tek seferde al
funds = pd.DataFrame(client.funds.list())

# 1 yıllık getirisi %60 üzerinde olan hisse senedi fonlarını filtrele
screened = funds[
    (funds["fund_type"].str.contains("Hisse", na=False)) & 
    (funds["yield_1y"] > 60.0)
].sort_values(by="yield_1y", ascending=False)

print(screened[["symbol", "name", "current_price", "yield_1y", "risk_level"]].head(10))
```

---

## 3. TypeScript / Node.js SDK

### Kurulum

```bash
npm install burkut
# veya
pnpm add burkut
```

### Hızlı Başlangıç

```typescript
import { BurkutClient } from 'burkut';

const client = new BurkutClient({ 
  apiKey: process.env.BURKUT_API_KEY 
});

async function main() {
  // Hisse fiyatı sorgulama
  const stock = await client.stocks.get('ASELS');
  console.log(`${stock.name}: ${stock.currentPrice} TL`);

  // TEFAS fon listesi
  const funds = await client.funds.list();
  console.log(`Takip Edilen Fon Sayısı: ${funds.length}`);

  // Son KAP bildirimleri
  const news = await client.kap.list({ limit: 5 });
  news.forEach((n) => console.log(`[${n.symbol}] ${n.title}`));
}

main();
```

---

## Karşılaştırma Tablosu

| Kriter | Bürküt Ekosistemi | yfinance | Geleneksel Scraper'lar | Web Arayüz Kazıma |
| :--- | :---: | :---: | :---: | :---: |
| **Model Context Protocol (MCP)** | Yerleşik (`burkut-mcp`) | Yok | Yok | Yok |
| **TEFAS Fon Verileri** | Eksiksiz REST API | Desteklenmiyor | Kırılgan HTML | IP Ban Riski |
| **BIST Hisse Senetleri** | 15 Dk Gecikmeli | 15 Dk Gecikmeli | Sürekli Değişen Yapı | Oturum Zorunluluğu |
| **KAP Bildirimleri** | Yapılandırılmış JSON | Yok | Karmaşık Tablo/PDF | Yok |
| **Dış Bağımlılık (Dependencies)** | Sıfır Bağımlılık | 10+ Ağır Kütüphane | Selenium / Chromium | Puppeteer / Playwright |
| **Tip Güvenliği (Type Safety)** | Tam Type Hints / `.d.ts` | Zayıf | Yok | Yok |
| **Hizmet Sürekliliği** | Bellek Önbelleği & Fail-Safe | Yahoo UI Değişince Patlar | Kaynak Değişince Patlar | Yüksek Bakım Maliyeti |

---

## Hata Yönetimi

SDK istemcileri, ağ ve kota sınırlarını önceden yakalayan açık hata sınıfları içerir:

```python
from burkut import (
    BurkutClient,
    AuthenticationError,
    RateLimitError,
    QuotaExceededError,
    NotFoundError,
)

client = BurkutClient()

try:
    data = client.stocks.get("THYAO")
except AuthenticationError:
    print("Geçersiz API Anahtarı! burkutportfoy.com/developer adresinden yenisini alın.")
except RateLimitError as e:
    print(f"Dakikalık hız sınırı aşıldı. {e.retry_after} saniye sonra tekrar deneyin.")
except QuotaExceededError:
    print("Aylık kota tükendi. Geliştirici portalından planınızı yükseltin.")
except NotFoundError:
    print("Aranan enstrüman bulunamadı.")
```

---

## Depo Mimarisi

```text
burkut-sdks/
├── assets/               # Marka ve logo görselleri
│   └── logo.png          # Bürküt kartal vektörel logosu
│
├── mcp/                  # Model Context Protocol Server (npx -y burkut-mcp)
│   ├── src/              # TypeScript MCP araçları ve API istemcisi
│   ├── dist/             # Derlenmiş stdio JSON-RPC dağıtımı
│   └── README.md         # MCP kurulum ve ajan entegrasyon kılavuzu
│
├── python/               # Python SDK (pip install burkut)
│   ├── burkut/           # İstemci çekirdeği, modeller ve endpointler
│   ├── tests/            # Birim testleri
│   └── pyproject.toml    # Standart PyPI paket konfigürasyonu
│
├── nodejs/               # Node.js & TypeScript SDK (npm install burkut)
│   ├── src/              # TypeScript kaynak kodları
│   ├── dist/             # CJS & ESM derleme çıktıları (.d.ts)
│   └── package.json      # NPM paket konfigürasyonu
│
└── .github/workflows/    # CI/CD: Çoklu versiyon otomatik test akışı
```

---

## Ücretsiz API Anahtarı Nasıl Alınır?

1. [burkutportfoy.com/register](https://burkutportfoy.com/register) adresinden ücretsiz hesap açın.
2. E-posta adresinizi doğrulayın.
3. [Geliştirici Portalı](https://burkutportfoy.com/developer) üzerinden **Yeni Anahtar Oluştur** butonuna tıklayın.
4. `bk_live_...` formatındaki anahtarınızı kopyalayıp projelerinizde kullanın.

---

## Destek ve İletişim

* **Teknik Destek & Geri Bildirim:** [destek@burkutportfoy.com](mailto:destek@burkutportfoy.com)
* **Hata Bildirimi (Issues):** [github.com/sametakan29/burkut-sdks/issues](https://github.com/sametakan29/burkut-sdks/issues)

---

## Yasal Bilgilendirme ve Feragatname

Bu kütüphaneler ve veri servisleri araştırma, kişisel analiz ve yazılım geliştirme amaçlarıyla sunulmaktadır.
* **Gecikmeli Veri:** Borsa İstanbul (BIST) pay piyasası verileri yasal düzenlemeler uyarınca 15 dakika gecikmelidir.
* **Yatırım Tavsiyesi Değildir:** Sunulan veriler yatırım danışmanlığı, hisse önerisi veya alım-satım tavsiyesi niteliği taşımaz.
* **Hizmet Garantisi:** Veriler üçüncü taraf halka açık kaynaklardan derlenmekte olup, kaynak tarafındaki kesintilerde garanti taahhüt edilmez.

---

## Lisans

Bu proje [MIT Lisansı](./LICENSE) ile dağıtılmaktadır. Telif Hakkı &copy; 2026 Bürküt Finansal Teknolojiler.
