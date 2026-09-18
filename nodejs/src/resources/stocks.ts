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
}
