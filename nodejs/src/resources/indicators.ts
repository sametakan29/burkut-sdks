import { BaseResource } from './base';
import type {
  BollingerResult,
  IndicatorsSummary,
  MACDResult,
  RSIResult,
} from '../types';

export class IndicatorsResource extends BaseResource {
  /**
   * Belirtilen BIST hissesi için tüm teknik göstergelerin (RSI, MACD, Bollinger) özetini döner.
   * @param symbol Hisse sembolü (Örn: 'THYAO', 'ASELS')
   */
  async getSummary(symbol: string): Promise<IndicatorsSummary> {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('symbol parametresi geçerli bir metin olmalıdır.');
    }
    return this._get<IndicatorsSummary>(`/indicators/${symbol.trim().toUpperCase()}`);
  }

  /**
   * Belirtilen BIST hissesi için Relative Strength Index (RSI) değerini döner.
   * @param symbol Hisse sembolü (Örn: 'THYAO')
   * @param period RSI periyodu (Varsayılan: 14)
   */
  async getRSI(symbol: string, period?: number): Promise<RSIResult> {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('symbol parametresi geçerli bir metin olmalıdır.');
    }
    const params: Record<string, number | undefined> = {};
    if (period !== undefined) params.period = period;
    return this._get<RSIResult>(`/indicators/${symbol.trim().toUpperCase()}/rsi`, params);
  }

  /**
   * Belirtilen BIST hissesi için MACD (Moving Average Convergence Divergence) değerlerini döner.
   * @param symbol Hisse sembolü (Örn: 'THYAO')
   * @param options MACD parametreleri (fast: 12, slow: 26, signal: 9)
   */
  async getMACD(
    symbol: string,
    options?: { fast?: number; slow?: number; signal?: number }
  ): Promise<MACDResult> {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('symbol parametresi geçerli bir metin olmalıdır.');
    }
    const params: Record<string, number | undefined> = {};
    if (options?.fast !== undefined) params.fast = options.fast;
    if (options?.slow !== undefined) params.slow = options.slow;
    if (options?.signal !== undefined) params.signal = options.signal;
    return this._get<MACDResult>(`/indicators/${symbol.trim().toUpperCase()}/macd`, params);
  }

  /**
   * Belirtilen BIST hissesi için Bollinger Bantları değerlerini döner.
   * @param symbol Hisse sembolü (Örn: 'THYAO')
   * @param options Bollinger parametreleri (period: 20, stdDev: 2.0)
   */
  async getBollinger(
    symbol: string,
    options?: { period?: number; stdDev?: number }
  ): Promise<BollingerResult> {
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('symbol parametresi geçerli bir metin olmalıdır.');
    }
    const params: Record<string, number | undefined> = {};
    if (options?.period !== undefined) params.period = options.period;
    if (options?.stdDev !== undefined) params.stdDev = options.stdDev;
    return this._get<BollingerResult>(`/indicators/${symbol.trim().toUpperCase()}/bollinger`, params);
  }
}
