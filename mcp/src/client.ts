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

  private async request<T>(path: string, options: { query?: Record<string, string | number | boolean | undefined>; usePublicV1?: boolean } = {}): Promise<T> {
    const { query, usePublicV1 } = options;

    let resolvedPath = path;
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'burkut-mcp/1.0.0',
    };

    if (this.config.apiKey) {
      headers['X-API-Key'] = this.config.apiKey;
      if (usePublicV1 && !path.startsWith('/api/public/v1')) {
        resolvedPath = `/api/public/v1${path.replace(/^\/api\/v1/, '')}`;
      }
    }

    const url = new URL(`${this.config.baseUrl}${resolvedPath}`);
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
          throw new Error(`Yetkilendirme hatası (${response.status}): Geçersiz veya yetkisiz API Key. Lütfen burkutportfoy.com/developer üzerinden anahtarınızı kontrol edin.`);
        }
        if (response.status === 429) {
          throw new Error(`İstek limiti aşıldı (429 Rate Limit): Lütfen birkaç saniye bekleyin veya daha yüksek kotalı bir plana geçin.`);
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
    if (this.config.apiKey) {
      return this.request('/funds', { usePublicV1: true });
    }
    return this.request('/api/v1/market/funds');
  }

  async getFundDetail(symbol: string): Promise<any> {
    const sym = normalizeSymbol(symbol);
    if (this.config.apiKey) {
      return this.request(`/funds/${sym}`, { usePublicV1: true });
    }
    return this.request(`/api/v1/market/funds/${sym}`);
  }

  // --- Stocks (BIST) ---
  async getStocks(symbols?: string[]): Promise<any[]> {
    const query = symbols && symbols.length > 0 ? { symbols: symbols.map(normalizeSymbol).join(',') } : undefined;
    if (this.config.apiKey) {
      return this.request('/stocks', { query, usePublicV1: true });
    }
    return this.request('/api/v1/market/stocks', { query });
  }

  async getStockQuote(symbol: string): Promise<any> {
    const sym = normalizeSymbol(symbol);
    if (this.config.apiKey) {
      return this.request(`/stocks/${sym}`, { usePublicV1: true });
    }
    return this.request(`/api/v1/market/stocks/${sym}`);
  }

  // --- KAP Announcements ---
  async getKapAnnouncements(symbol?: string, page = 1, size = 20): Promise<any> {
    const sym = symbol ? normalizeSymbol(symbol) : undefined;
    if (sym) {
      return this.request(`/api/v1/kap/${sym}`, { query: { page, size } });
    }
    return this.request('/api/v1/kap', { query: { page, size } });
  }

  async getKapDetail(id: string): Promise<any> {
    return this.request(`/api/v1/kap/detail/${encodeURIComponent(id.trim())}`);
  }

  // --- IPO (Halka Arz) ---
  async getIpoList(activeOnly = false): Promise<any[]> {
    if (activeOnly) {
      return this.request('/api/v1/ipo/active');
    }
    return this.request('/api/v1/ipo');
  }

  async getIpoDetail(symbol: string): Promise<any> {
    return this.request(`/api/v1/ipo/${normalizeSymbol(symbol)}`);
  }

  // --- Dividends (Temettü) ---
  async getDividends(symbol?: string): Promise<any> {
    if (symbol) {
      return this.request(`/api/v1/dividends/${normalizeSymbol(symbol)}`);
    }
    return this.request('/api/v1/dividends');
  }

  // --- Macro: Inflation, Forex, Gold ---
  async getInflation(): Promise<any> {
    return this.request('/api/v1/turkey/inflation');
  }

  async getForex(): Promise<any[]> {
    if (this.config.apiKey) {
      return this.request('/forex', { usePublicV1: true });
    }
    return this.request('/api/v1/market/forex');
  }

  async getGold(): Promise<any[]> {
    if (this.config.apiKey) {
      return this.request('/gold', { usePublicV1: true });
    }
    return this.request('/api/v1/market/gold');
  }
}
