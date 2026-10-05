# burkut-mcp 🦅

> **Model Context Protocol (MCP) Server for Turkish Financial Markets (BIST, TEFAS, KAP, IPOs, Macro) powered by Bürküt API.**

`burkut-mcp`, Türkiye finans piyasası verilerini (Borsa İstanbul hisseleri, TEFAS yatırım fonları, KAP bildirimleri, halka arzlar, temettüler ve makroekonomik veriler) doğrudan **Claude Desktop**, **Cursor**, **Windsurf** ve diğer LLM tabanlı yapay zeka ajanlarına bağlayan resmi olmayan/açık kaynak bir MCP sunucusudur.

---

## ⚡ Hızlı Başlangıç (Quickstart)

Kurulum yapmanıza gerek yoktur, `npx` ile anında çalıştırılabilir:

```bash
npx -y burkut-mcp
```

### 1. Claude Desktop ile Kullanım

Claude Desktop yapılandırma dosyanızı açın:
* **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
* **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Aşağıdaki yapılandırmayı ekleyin:

```json
{
  "mcpServers": {
    "burkut": {
      "command": "npx",
      "args": ["-y", "burkut-mcp"],
      "env": {
        "BURKUT_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

> **Not:** `BURKUT_API_KEY` opsiyoneldir. Anahtar girmeden de temel halka açık modda çalışır. Ancak daha yüksek kota ve kesintisiz erişim için [burkut.com/developers](https://burkut.com/developers) adresinden ücretsiz API Key alabilirsiniz.

---

### 2. Cursor IDE ile Kullanım

Cursor Ayarları (`Settings`) -> `Features` -> `MCP Servers` -> `Add New MCP Server`:
* **Name:** `burkut`
* **Type:** `command`
* **Command:** `npx -y burkut-mcp`

---

## 🛠️ Desteklenen Araçlar (MCP Tools)

| Tool | Açıklama |
| :--- | :--- |
| `burkut_search_funds` | TEFAS fonlarını koda, isme veya kategoriye göre filtreler; 1 ay, 3 ay, 6 ay ve 1 yıllık getirilerine göre sıralar. |
| `burkut_get_fund_detail` | Belirli bir fonun (örn: `MAC`, `TI2`, `TCD`) tüm getiri periyotları, risk seviyesi ve güncel fiyat detaylarını çeker. |
| `burkut_get_stock_quote` | BIST hisselerinin (örn: `THYAO`, `ASELS`, `KCHOL`) anlık/güncel fiyat, değişim % ve hacim verilerini getirir. |
| `burkut_get_kap_announcements` | Kamuyu Aydınlatma Platformu'na (KAP) düşen şirket bildirimlerini veya genel piyasa bültenini çeker. |
| `burkut_get_ipo_calendar` | Aktif ve yaklaşan Halka Arz (IPO) takvimini, lot fiyatlarını ve talep toplama tarihlerini listeler. |
| `burkut_get_dividends` | BIST şirketlerinin temettü geçmişi, hisse başı net ödeme ve temettü verimi oranlarını getirir. |
| `burkut_get_macro_indicators` | Türkiye resmi enflasyon oranları (TÜFE/ÜFE), serbest piyasa döviz kurları (USD/TRY, EUR/TRY) ve altın fiyatlarını getirir. |

---

## 💬 Örnek İstemler (Prompt Örnekleri)

Claude Desktop veya Cursor Composer'da doğrudan şunları sorabilirsiniz:

* *"Bana TEFAS'taki hisse senedi fonları arasında son 1 yılda en yüksek getiri sağlayan ilk 5 fonu listele ve yıllık getirilerini göster."*
* *"MAC ve TI2 fonlarının risk seviyelerini ve son 6 aylık performanslarını karşılaştır."*
* *"Bugün KAP'a düşen önemli şirket bildirimlerini özetle."*
* *"Bu hafta talep toplayacak veya aktif olan halka arzlar hangileri? Fiyatları ve tarihleri nedir?"*
* *"FROTO ve TUPRS'ın son temettü dağıtım oranlarını karşılaştır."*
* *"Türkiye'deki son açıklanan yıllık TÜFE enflasyon oranı ile güncel dolar kurunu getir."*

---

## 🔧 Geliştirme (Local Development)

```bash
git clone https://github.com/sametakan29/burkut-sdks.git
cd burkut-sdks/mcp
npm install
npm run build
```

Yerel test için:
```bash
node dist/index.js
```

Ortam Değişkenleri:
* `BURKUT_API_KEY`: Bürküt Developer API anahtarınız (opsiyonel).
* `BURKUT_API_BASE_URL`: Hedef API adresi (Varsayılan: `https://api.burkutportfoy.com`).
* `BURKUT_TIMEOUT_MS`: İstek zaman aşımı süresi (Varsayılan: `15000` ms).

---

## 💬 Destek ve İletişim

Her türlü geri bildirim, özel veri seti talepleri veya hata bildirimleri için:
* **E-posta:** [destek@burkutportfoy.com](mailto:destek@burkutportfoy.com)
* **GitHub Issues:** [burkut-sdks/issues](https://github.com/sametakan29/burkut-sdks/issues)

---

## 📄 Lisans

MIT © [Bürküt](https://burkutportfoy.com)
