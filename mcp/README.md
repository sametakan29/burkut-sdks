<p align="center">
  <img src="../assets/logo.png" alt="Bürküt Logo" width="100" />
</p>

<h1 align="center">Bürküt MCP Server</h1>

<p align="center">
  <b>Claude Desktop, Cursor ve LLM tabanlı yapay zeka ajanları için Türkiye finans piyasası veri köprüsü.</b><br />
  Borsa İstanbul (BIST), TEFAS Yatırım Fonları, KAP Bildirimleri, Halka Arzlar, Temettüler ve Makro Veriler.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/burkut-mcp"><img src="https://img.shields.io/npm/v/burkut-mcp?color=purple&style=flat-square&logo=npm&logoColor=white" alt="npm version" /></a>
  <a href="https://modelcontextprotocol.io/"><img src="https://img.shields.io/badge/Protokol-MCP%20Standard%C4%B1-blueviolet?style=flat-square&logo=anthropic&logoColor=white" alt="MCP Protocol" /></a>
  <a href="../LICENSE"><img src="https://img.shields.io/badge/Lisans-MIT-gray.svg?style=flat-square" alt="Lisans" /></a>
</p>

---

## Hızlı Başlangıç

Herhangi bir kurulum veya indirme gerektirmez. `npx` ile doğrudan çalıştırılır:

```bash
npx -y burkut-mcp
```

### 1. Claude Desktop ile Kullanım

Claude Desktop yapılandırma dosyanızı açın:
* **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
* **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

Aşağıdaki tanımı ekleyin:

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

> **Önemli:** `BURKUT_API_KEY` zorunludur. Kotanızı takip etmek ve servisi kullanabilmek için [burkutportfoy.com/developer](https://burkutportfoy.com/developer) adresinden saniyeler içinde **ücretsiz API anahtarınızı** oluşturup buraya ekleyin.

---

### 2. Cursor IDE ile Kullanım

1. **Cursor Settings** &rarr; **Features** &rarr; **MCP Servers** yolunu izleyin.
2. **Add New MCP Server** butonuna tıklayın:
   * **Name:** `burkut`
   * **Type:** `command`
   * **Command:** `npx -y burkut-mcp`
   * **Env:** `BURKUT_API_KEY=BURKUT_API_ANAHTARINIZ`

---

## Desteklenen MCP Araçları (Tools)

| Araç Adı | Parametreler | Açıklama |
| :--- | :--- | :--- |
| `burkut_search_funds` | `query`, `fundType`, `sortBy`, `limit` | TEFAS fonlarını filtreler; 1 ay, 3 ay, 6 ay ve 1 yıllık getirilerine göre sıralar. |
| `burkut_get_fund_detail` | `symbol` (örn: `MAC`, `TI2`) | Belirli bir fonun tüm periyot getirilerini, risk seviyesini ve detaylı künyesini döner. |
| `burkut_get_stock_quote` | `symbol` (örn: `THYAO`, `ASELS`) | BIST hissesinin 15 dk gecikmeli resmi fiyatını, günlük değişim oranını ve hacmini getirir. |
| `burkut_get_kap_announcements` | `symbol`, `limit` | Kamuyu Aydınlatma Platformu'na (KAP) düşen şirket bildirimlerini ve haberleri çeker. |
| `burkut_get_ipo_calendar` | `activeOnly` | Aktif ve yaklaşan Halka Arz takvimini, dağıtım yöntemlerini ve lot fiyatlarını listeler. |
| `burkut_get_dividends` | `symbol` | Şirketlerin temettü geçmişini, hisse başı net nakit ödemelerini ve temettü verimlerini döner. |
| `burkut_get_macro_indicators` | `category` (`inflation`, `forex`, `gold`, `all`) | Resmi TÜFE/ÜFE enflasyon oranlarını, serbest piyasa döviz kurlarını ve altın fiyatlarını getirir. |

---

## Örnek Türkçe İstekler (Promptlar)

Claude Desktop veya Cursor'a doğrudan şu soruları sorabilirsiniz:

* *"Bana TEFAS'taki hisse senedi yoğun fonlar arasında son 1 yılda en çok kazandıran 5 fonu listele ve yıllık getirilerini göster."*
* *"MAC ve TI2 fonlarının risk puanlarını ve son 6 aylık performanslarını karşılaştır."*
* *"Bugün KAP'a düşen önemli şirket bildirimlerini ve yeni iş ilişkilerini özetle."*
* *"Bu hafta talep toplayacak veya aktif olan halka arzlar hangileri? Dağıtım yöntemleri nedir?"*
* *"FROTO ve TUPRS şirketlerinin son temettü dağıtım oranlarını karşılaştır."*
* *"TÜİK tarafından açıklanan son yıllık TÜFE enflasyon oranı ile güncel dolar kurunu getir."*

---

## Ortam Değişkenleri (Environment Variables)

* `BURKUT_API_KEY`: Geliştirici API Anahtarınız (opsiyonel).
* `BURKUT_API_BASE_URL`: Hedef API adresi (Varsayılan: `https://api.burkutportfoy.com`).
* `BURKUT_TIMEOUT_MS`: İstek zaman aşımı süresi milisaniye cinsinden (Varsayılan: `15000`).

---

## Yerel Geliştirme (Local Development)

```bash
git clone https://github.com/sametakan29/burkut-sdks.git
cd burkut-sdks/mcp
npm install
npm run build
```

Yerel test:
```bash
node dist/index.js
```

---

## Destek ve İletişim

* **E-posta:** [destek@burkutportfoy.com](mailto:destek@burkutportfoy.com)
* **GitHub Issues:** [github.com/sametakan29/burkut-sdks/issues](https://github.com/sametakan29/burkut-sdks/issues)

---

## Lisans

Bu proje [MIT Lisansı](../LICENSE) ile korunmaktadır. Telif Hakkı &copy; 2026 Bürküt Finansal Teknolojiler.
