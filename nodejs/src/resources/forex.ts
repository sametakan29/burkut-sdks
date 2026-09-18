import { BaseResource } from './base';
import type { ForexItem } from '../types';

export class ForexResource extends BaseResource {
  /**
   * Tüm döviz kurlarını listeler.
   */
  async list(): Promise<ForexItem[]> {
    return this._get<ForexItem[]>('/forex');
  }

  /**
   * Belirli bir döviz kurunun verilerini getirir.
   * @param symbol Döviz çifti kodu (Örn: 'USDTRY', 'EURTRY')
   */
  async get(symbol: string): Promise<ForexItem> {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('symbol parametresi geçerli bir metin olmalıdır.');
    }
    return this._get<ForexItem>(`/forex/${symbol.trim().toUpperCase()}`);
  }
}
