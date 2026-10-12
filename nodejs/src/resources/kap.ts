import { BaseResource } from './base';
import type { KAPListResponse } from '../types';

export class KAPResource extends BaseResource {
  /**
   * Kamuyu Aydınlatma Platformu (KAP) bildirimlerini listeler.
   * @param options Sayfalama ve hisse filtresi (page, size, symbol)
   */
  async list(options?: { symbol?: string; page?: number; size?: number }): Promise<KAPListResponse> {
    const params: Record<string, string | number | undefined> = {};
    if (options?.symbol) params.symbol = options.symbol.trim().toUpperCase();
    if (options?.page !== undefined) params.page = options.page;
    if (options?.size !== undefined) params.size = options.size;

    return this._get<KAPListResponse>('/kap', params);
  }

  /**
   * Belirli bir hisseye ait KAP bildirimlerini listeler.
   * @param symbol Hisse sembolü (Örn: 'THYAO')
   * @param options Sayfalama seçenekleri (page, size)
   */
  async getBySymbol(
    symbol: string,
    options?: { page?: number; size?: number }
  ): Promise<KAPListResponse> {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('symbol parametresi geçerli bir metin olmalıdır.');
    }
    const params: Record<string, string | number | undefined> = {};
    if (options?.page !== undefined) params.page = options.page;
    if (options?.size !== undefined) params.size = options.size;

    return this._get<KAPListResponse>(`/kap/${symbol.trim().toUpperCase()}`, params);
  }
}
