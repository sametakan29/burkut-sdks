import { BaseResource } from './base';
import type { FundItem } from '../types';

export class FundsResource extends BaseResource {
  /**
   * Tüm TEFAS yatırım fonlarını listeler.
   */
  async list(): Promise<FundItem[]> {
    return this._get<FundItem[]>('/funds');
  }

  /**
   * Belirli bir TEFAS yatırım fonunun detaylarını getirir.
   * @param symbol Fon kodu (Örn: 'TCD', 'AFT', 'MAC')
   */
  async get(symbol: string): Promise<FundItem> {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('symbol parametresi geçerli bir metin olmalıdır.');
    }
    return this._get<FundItem>(`/funds/${symbol.trim().toUpperCase()}`);
  }
}
