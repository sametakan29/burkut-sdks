import { BaseResource } from './base';
import type { BondItem } from '../types';

export class BondsResource extends BaseResource {
  /**
   * Tüm tahvil ve bono verilerini listeler.
   */
  async list(): Promise<BondItem[]> {
    return this._get<BondItem[]>('/bonds');
  }

  /**
   * Belirli bir tahvilin detaylarını getirir.
   * @param symbol Tahvil kodu
   */
  async get(symbol: string): Promise<BondItem> {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('symbol parametresi geçerli bir metin olmalıdır.');
    }
    return this._get<BondItem>(`/bonds/${symbol.trim().toUpperCase()}`);
  }
}
