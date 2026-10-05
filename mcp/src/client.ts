import { BurkutConfig, getConfig } from './config.js';

export function normalizeSymbol(sym: string): string {
  return sym
    .trim()
    .replace(/^BIST:\s*/i, '')
    .replace(/^TEFAS:\s*/i, '')
    .replace(/\.IS$/i, '')
    .replace(/\.tefas$/i, '')
    .toUpperCase();
}

export class BurkutApiClient {
  private config: BurkutConfig;

  constructor(config?: BurkutConfig) {
    this.config = config || getConfig();
  }

  private async request<T>(path: string, options: { query?: Record<string, string | number | boolean | undefined> } = {}): Promise<T> {
    const { query } = options;

    // BURKUT_API_KEY zorunludur: Geliştirici veri borusu (/api/public/v1) için şarttır.
    if (!this.config.apiKey || !this.config.apiKey.trim()) {
      throw new Error(
        "Bürküt API Anahtarı eksik! Bürküt MCP sunucusunu kullanabilmek için lütfen https://burkutportfoy.com/developer adresinden ücretsiz bir API anahtarı alın ve ayarlarınıza 'BURKUT_API_KEY' ortam değişkeni olarak ekleyin."
      );
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'burkut-mcp/1.0.2',
      'X-API-Key': this.config.apiKey.trim(),
    };

    const url = new URL(`${this.config.baseUrl}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorDetail = '';
        try {
          const errorJson = await response.json();
          errorDetail = typeof errorJson === 'object' ? JSON.stringify(errorJson) : String(errorJson);
        } catch {
          errorDetail = await response.text();
        }

        if (response.status === 404) {
          throw new Error(`Enstrüman veya veri bulunamadı (404 Not Found): ${path}`);
        }
        if (response.status === 401 || response.status === 403) {
          throw new Error(`Yetkilendirme hatası (${response.status}): Geçersiz veya iptal edilmiş API Key. Lütfen https://burkutportfoy.com/developer üzerinden anahtarınızı kontrol edin.`);
        }
        if (response.status === 429) {
          throw new Error(`Kotanız doldu veya dakikalık hız sınırına takıldınız (429 Rate Limit): Lütfen birkaç saniye bekleyin veya https://burkutportfoy.com/developer adresinden planınızı yükseltin.`);
        }

        throw new Error(`Bürküt API Hatası (HTTP ${response.status}): ${errorDetail || response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error(`İstek zaman aşımına uğradı (${this.config.timeoutMs}ms): ${url.toString()}`);
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // --- Funds (TEFAS) ---
  async getFunds(): Promise<any[]> {
    return this.request('/funds');
  }

  async getFundDetail(symbol: string): Promise<any> {
    const sym = normalizeSymbol(symbol);
    return this.request(`/funds/${sym}`);
  }

  // --- Stocks (BIST) ---
  async getStocks(symbols?: string[]): Promise<any[]> {
    const query = symbols && symbols.length > 0 ? { symbols: symbols.map(normalizeSymbol).join(',') } : undefined;
    return this.request('/stocks', { query });
  }

  async getStockQuote(symbol: string): Promise<any> {
    const sym = normalizeSymbol(symbol);
    return this.request(`/stocks/${sym}`);
  }

  // --- Forex ---
  async getForex(): Promise<any[]> {
    return this.request('/forex');
  }

  async getForexDetail(symbol: string): Promise<any> {
    return this.request(`/forex/${normalizeSymbol(symbol)}`);
  }

  // --- Gold ---
  async getGold(): Promise<any[]> {
    return this.request('/gold');
  }

  async getGoldDetail(symbol: string): Promise<any> {
    return this.request(`/gold/${normalizeSymbol(symbol)}`);
  }

  // --- Bonds ---
  async getBonds(): Promise<any[]> {
    return this.request('/bonds');
  }

  // --- VIOP ---
  async getViop(): Promise<any[]> {
    return this.request('/viop');
  }
}
