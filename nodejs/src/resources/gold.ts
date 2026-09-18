import { BaseResource } from './base';
import type { GoldItem } from '../types';

export class GoldResource extends BaseResource {
  /**
   * Tüm altın türlerini ve güncel fiyatlarını listeler.
   */
  async list(): Promise<GoldItem[]> {
    return this._get<GoldItem[]>('/gold');
  }

  /**
   * Belirli bir altın türünün fiyat bilgisini getirir.
   * @param symbol Altın kodu (Örn: 'ALTIN_GRAM', 'ALTIN_CEYREK', 'ONS')
   */
  async get(symbol: string): Promise<GoldItem> {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('symbol parametresi geçerli bir metin olmalıdır.');
    }
    return this._get<GoldItem>(`/gold/${symbol.trim().toUpperCase()}`);
  }
}
