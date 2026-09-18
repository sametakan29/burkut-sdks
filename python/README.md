# Bürküt Python SDK 🐍

[![PyPI version](https://img.shields.io/pypi/v/burkut.svg)](https://pypi.org/project/burkut/)
[![Python versions](https://img.shields.io/pypi/pyversions/burkut.svg)](https://pypi.org/project/burkut/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Bürküt Finansal Veri API'sinin resmi Python kütüphanesidir. **Sıfır dış bağımlılık** ile çalışır; ekstra kütüphane (`requests`, `urllib3` vb.) yüklemesi gerektirmez, Python'un yerel standart kütüphanesi üzerinde ultra hızlı ve hafif bir şekilde çalışır.

---

## 📦 Kurulum

```bash
pip install burkut
```

Veya bu repodan doğrudan yüklemek için:
```bash
git clone https://github.com/sametakan29/burkut-sdks.git
cd burkut-sdks/python
pip install .
```

---

## ⚡ Hızlı Başlangıç

```python
from burkut import BurkutClient

# API anahtarınız ile istemciyi başlatın
# (Veya BURKUT_API_KEY ortam değişkenini ayarlayabilirsiniz)
client = BurkutClient(api_key="bk_live_...")

# 1. BIST Hisse Senedi Verileri
thyao = client.stocks.get("THYAO")
print(f"Hisse: {thyao['symbol']}, Son Fiyat: {thyao['last_price']} TL, Değişim: %{thyao['change_rate']}")

# Birden fazla hisseyi tek seferde getirme
stocks = client.stocks.list(symbols=["THYAO", "GARAN", "ASELS", "EREGL"])
for s in stocks:
    print(s["symbol"], s["last_price"])

# 2. Canlı Döviz Kurları (Forex)
usd = client.forex.get("USDTRY")
print(f"Dolar/TL: {usd['buying']} / {usd['selling']}")

# Tüm kurları listeleme
all_forex = client.forex.list()

# 3. Altın ve Kıymetli Madenler
gram_altin = client.gold.get("ALTIN_GRAM")
ceyrek = client.gold.get("ALTIN_CEYREK")
print(f"Gram Altın: {gram_altin['buying']} TL")

# 4. TEFAS Yatırım Fonları
fon = client.funds.get("TCD")
print(f"Fon Adı: {fon['name']}, Fiyat: {fon['price']}")

# 5. Tahvil ve Bono
bonds = client.bonds.list()

# 6. VİOP Sözleşmeleri
viop = client.viop.list()
```

---

## 🛡️ Hata Yönetimi (Exception Handling)

SDK, HTTP durum kodlarına ve API hata yanıtlarına göre özel istisnalar fırlatır:

```python
from burkut import (
    BurkutClient,
    AuthenticationError,
    ForbiddenError,
    NotFoundError,
    RateLimitError,
    QuotaExceededError,
)

client = BurkutClient("bk_live_...")

try:
    data = client.stocks.get("THYAO")
except AuthenticationError:
    print("Geçersiz veya eksik API anahtarı!")
except QuotaExceededError:
    print("Aylık istek kotanız tükendi. PRO plana yükseltin!")
except RateLimitError as e:
    print(f"Hız limiti aşıldı. Lütfen {e.retry_after} saniye sonra tekrar deneyin.")
except NotFoundError:
    print("Aranan sembol bulunamadı.")
```

---

## ⚙️ Yapılandırma Seçenekleri

```python
client = BurkutClient(
    api_key="bk_live_...",
    timeout=10.0,  # Zaman aşımı süresi (saniye, varsayılan: 15.0)
    base_url="https://burkutportfoy.com/api/public/v1",  # Özel endpoint
)
```

---

## 📄 Lisans
MIT License - [Detaylar](../../LICENSE)
