# 🦅 Bürküt Python SDK

[![Release](https://img.shields.io/badge/release-v1.0.0-blue.svg?style=flat-square)](https://github.com/sametakan29/burkut-sdks/releases)
[![PyPI](https://img.shields.io/badge/PyPI-burkut-blue?style=flat-square&logo=pypi&logoColor=white)](https://pypi.org/project/burkut/)
[![Python](https://img.shields.io/badge/Python-3.8%2B-3776AB.svg?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Borsa İstanbul (15 Dk Gecikmeli), TEFAS Yatırım Fonları, Döviz ve Altın Piyasaları için Açık Kaynak ve Sıfır Bağımlılıklı Python İstemcisi.**

Bürküt Finansal Veri API'sinin açık kaynak Python kütüphanesidir. `requests` veya `urllib3` gibi hiçbir harici paket kurmanıza gerek kalmadan, Python'un yerel standart kütüphanesi üzerinde **ultra hafif, stabil ve yüksek hızlı** çalışır.

---

## 🚀 Neden `burkut`?

* ⚡ **Sıfır Dış Bağımlılık (Zero-Dependency):** Sadece Python standart kütüphanesini kullanır. Projenizin bağımlılık ağacını şişirmez.
* 📈 **Hepsi Bir Arada:** 15 dk gecikmeli BIST hisseleri, TEFAS fonları, serbest piyasa altın & döviz, tahvil ve VİOP verileri tek çatı altında.
* 🐼 **Pandas & Data Science Uyumlu:** Tek satırda DataFrame'e dönüştürün, araştırma modellerinizi besleyin.
* 🛡️ **Web Scraping Değil, Güvenilir REST API:** Kaynak sitelerin HTML yapısı değişince bozulan kırılgan scraper'lara veda edin.
* 🧠 **Tam Tip Desteği (Type Hints):** PyCharm ve VS Code üzerinde kusursuz otomatik tamamlama (IntelliSense).

---

## 📦 Kurulum

```bash
pip install burkut
```

---

## ⚡ Hızlı Başlangıç

### 1. İstemciyi Başlatma
```python
from burkut import BurkutClient

# API anahtarınızı girin (Veya BURKUT_API_KEY ortam değişkenini ayarlayın)
client = BurkutClient(api_key="bk_live_...")
```

#### 2. Borsa İstanbul (BIST) Hisse Senetleri (15 Dk Gecikmeli)
```python
# Tek bir hisse sorgulama
thyao = client.stocks.get("THYAO")
print(f"Hisse: {thyao['name']} ({thyao['symbol']})")
print(f"Fiyat: {thyao['price']} TL | Günlük Değişim: %{thyao['changePercent']}")
print(f"İşlem Hacmi: {thyao['volume']:,} TL")

# Belirli hisseleri topluca çekme
portfoy = client.stocks.list(symbols=["THYAO", "GARAN", "ASELS", "EREGL", "TUPRS"])
for hisse in portfoy:
    print(f"{hisse['symbol']}: {hisse['price']} TL")
```

### 3. TEFAS Yatırım Fonları
```python
# Fon detayları ve fiyatı
tcd = client.funds.get("TCD")
print(f"Fon Adı: {tcd['name']}")
print(f"Birim Pay Fiyatı: {tcd['price']} TL")

# Tüm fonları listeleme
tum_fonlar = client.funds.list()
print(f"Toplam listelenen fon adedi: {len(tum_fonlar)}")
```

### 4. Serbest Piyasa & TCMB Döviz Kurları
```python
# Dolar ve Euro
usd = client.forex.get("USD")
eur = client.forex.get("EUR")

print(f"Dolar/TL: {usd['buyRate']} (Alış) - {usd['sellRate']} (Satış)")
print(f"Euro/TL:  {eur['buyRate']} (Alış) - {eur['sellRate']} (Satış)")

# Tüm kurları listeleme (20+ para birimi)
all_currencies = client.forex.list()
```

### 5. Altın ve Kıymetli Madenler
```python
# Gram Altın, Çeyrek Altın, Ata Altın vb.
gram = client.gold.get("ALTIN")
ceyrek = client.gold.get("CEYREK_YENI")

print(f"Gram Altın Fiyatı:   {gram['price']} TL (%{gram['changePercent']})")
print(f"Çeyrek Altın Fiyatı: {ceyrek['price']} TL")
```

### 6. VİOP ve Tahvil/Bono Verileri
```python
# Vadeli İşlem ve Opsiyon Piyasası sözleşmeleri
viop_sozlesmeleri = client.viop.list()

# Devlet tahvilleri ve faiz oranları
tahviller = client.bonds.list()
```

---

## 📊 Pandas ile Finansal Analiz & Veri Modelleme

```python
import pandas as pd
from burkut import BurkutClient

client = BurkutClient()

# BIST verilerini tek satırda DataFrame'e aktarın
df = pd.DataFrame(client.stocks.list())

# Günlük bazda en çok prim yapan hisseleri filtreleyin
en_cok_artanlar = df.sort_values(by="changePercent", ascending=False).head(10)
print(en_cok_artanlar[["symbol", "name", "price", "changePercent", "volume"]])

# CSV veya Excel'e aktarın
df.to_csv("bist_fiyatlar.csv", index=False)
```

---

## 🛡️ Hata Yönetimi

```python
from burkut import (
    BurkutClient,
    AuthenticationError,
    RateLimitError,
    QuotaExceededError,
    NotFoundError,
    BurkutError
)

client = BurkutClient()

try:
    veri = client.stocks.get("THYAO")
except AuthenticationError:
    print("API anahtarınız geçersiz veya eksik.")
except RateLimitError as e:
    print(f"Hız limitine ulaşıldı. {e.retry_after} saniye sonra tekrar deneyin.")
except QuotaExceededError:
    print("Aylık istek kotanız tükendi. https://burkutportfoy.com adresinden PRO plana geçebilirsiniz.")
except NotFoundError:
    print("Sembol bulunamadı.")
except BurkutError as e:
    print(f"API Hatası [{e.status_code}]: {e.message}")
```

---

## ⚙️ Özel Yapılandırma

```python
client = BurkutClient(
    api_key="bk_live_...",
    timeout=10.0,  # Zaman aşımı süresi (saniye, varsayılan: 15.0)
    base_url="https://api.burkutportfoy.com/api/public/v1",  # Özel endpoint
)
```

---

## 🔑 Ücretsiz API Anahtarı Alma
Ücretsiz API anahtarınızı 1 dakikada oluşturmak için [Bürküt Geliştirici Portalı](https://burkutportfoy.com/developer)'nı ziyaret edin.

---

## ⚖️ Yasal Uyarı & Feragatname (Disclaimer)

> **Önemli Yasal Bilgilendirme:** Bu kütüphane ve sağlanan API, tamamen **eğitim, kişisel araştırma ve hobi amaçlı** geliştirilmiştir.
> - **Resmi Veri Sağlayıcısı Değildir:** Bürküt bir borsa aracı kurumu, yatırım kuruluşu veya lisanslı borsa veri dağıtıcısı değildir.
> - **15 Dakika Gecikmeli Veri:** Borsa İstanbul (BIST) pay piyasası verileri yasal düzenlemeler gereği en az 15 dakika gecikmelidir.
> - **Yatırım Tavsiyesi Değildir:** Burada veya kütüphane aracılığıyla sunulan veriler hiçbir şekilde yatırım danışmanlığı, al-sat tavsiyesi veya finansal yönlendirme içermez.
> - **Garanti Taahhüt Edilmez:** Veriler üçüncü taraf halka açık kaynaklardan derlenmektedir ve doğruluğu, eksiksizliği veya kesintisizliği taahhüt edilmez.

---

## 📄 Lisans
Bu kütüphane [MIT Lisansı](https://github.com/sametakan29/burkut-sdks/blob/main/LICENSE) ile lisanslanmıştır.
