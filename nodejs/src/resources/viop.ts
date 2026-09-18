import { BaseResource } from './base';
import type { ViopItem } from '../types';

export class ViopResource extends BaseResource {
  /**
   * Tüm aktif VİOP sözleşmelerini listeler.
   */
  async list(): Promise<ViopItem[]> {
    return this._get<ViopItem[]>('/viop');
  }

  /**
   * Belirli bir VİOP sözleşmesinin detaylarını getirir.
   * @param symbol VİOP sözleşme kodu (Örn: 'F_XU0301026')
   */
  async get(symbol: string): Promise<ViopItem> {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('symbol parametresi geçerli bir metin olmalıdır.');
    }
    return this._get<ViopItem>(`/viop/${symbol.trim().toUpperCase()}`);
  }
}
