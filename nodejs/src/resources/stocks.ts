import { BaseResource } from './base';
import type { StockItem } from '../types';

export class StocksResource extends BaseResource {
  /**
   * Borsa İstanbul hisse senetlerini listeler (15 dk gecikmeli).
   * @param symbols İsteğe bağlı filtreleme yapılacak hisse sembolleri (Örn: ['THYAO', 'GARAN'])
   */
  async list(symbols?: string[]): Promise<StockItem[]> {
    const params: Record<string, string> = {};
    if (symbols && symbols.length > 0) {
      params.symbols = symbols.map((s) => s.trim().toUpperCase()).join(',');
    }
    return this._get<StockItem[]>('/stocks', params);
  }

  /**
   * Tek bir hisse senedinin detaylı verilerini getirir (15 dk gecikmeli).
   * @param symbol Hisse sembol kodu (Örn: 'THYAO', 'GARAN')
   */
  async get(symbol: string): Promise<StockItem> {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('symbol parametresi geçerli bir metin olmalıdır.');
    }
    return this._get<StockItem>(`/stocks/${symbol.trim().toUpperCase()}`);
  }

  /**
   * Hisse senedinin geçmiş OHLCV verilerini getirir (bölünme düzeltmeli).
   * @param symbol Hisse sembol kodu (Örn: 'THYAO')
   * @param options Tarih aralığı, gün sayısı veya mum aralığı filtreleri
   */
  async getHistory(
    symbol: string,
    options?: import('../types').StockHistoryOptions
  ): Promise<import('../types').StockHistoryResponse> {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('symbol parametresi geçerli bir metin olmalıdır.');
    }
    const params: Record<string, string | number | undefined> = {};
    if (options?.days) params.days = options.days;
    if (options?.range) params.range = options.range;
    if (options?.interval) params.interval = options.interval;
    if (options?.currency) params.currency = options.currency;

    return this._get<import('../types').StockHistoryResponse>(
      `/stocks/${symbol.trim().toUpperCase()}/history`,
      params
    );
  }

  /**
   * Tüm BIST hisselerinin toplu gün sonu (EOD) OHLCV verisini döner.
   * Tek bir istekle tüm piyasa çekilir ve kotanızdan yalnız 1 kredi düşer.
   * @param date İsteğe bağlı geçmiş tarih (YYYY-MM-DD formatında). Belirtilmezse en son işlem gününün verisi döner.
   */
  async getEod(date?: string): Promise<import('../types').StockEODResponse> {
    const params: Record<string, string | undefined> = {};
    if (date && date.trim()) {
      params.date = date.trim();
    }
    return this._get<import('../types').StockEODResponse>('/stocks/eod', params);
  }
}

