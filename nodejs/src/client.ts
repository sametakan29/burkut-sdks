import {
  AuthenticationError,
  BurkutError,
  ForbiddenError,
  NetworkError,
  NotFoundError,
  QuotaExceededError,
  RateLimitError,
  ServerError,
} from './errors';
import { BondsResource } from './resources/bonds';
import { ForexResource } from './resources/forex';
import { FundsResource } from './resources/funds';
import { GoldResource } from './resources/gold';
import { StocksResource } from './resources/stocks';
import { ViopResource } from './resources/viop';
import type { BurkutClientOptions } from './types';

declare const process: any;

const DEFAULT_BASE_URL = 'https://api.burkutportfoy.com/api/public/v1';
const DEFAULT_TIMEOUT_MS = 15000;
const SDK_VERSION = '1.0.0';

export class BurkutClient {
  public readonly apiKey: string;
  public readonly baseUrl: string;
  public readonly timeoutMs: number;

  public readonly stocks: StocksResource;
  public readonly forex: ForexResource;
  public readonly gold: GoldResource;
  public readonly funds: FundsResource;
  public readonly bonds: BondsResource;
  public readonly viop: ViopResource;

  constructor(options: BurkutClientOptions = {}) {
    const resolvedKey = options.apiKey || (typeof process !== 'undefined' ? process.env?.BURKUT_API_KEY : undefined);
    if (!resolvedKey) {
      throw new AuthenticationError(
        "API anahtarı bulunamadı. Lütfen 'apiKey' seçeneğini belirtin veya 'BURKUT_API_KEY' ortam değişkenini ayarlayın."
      );
    }

    this.apiKey = resolvedKey.trim();
    this.baseUrl = (options.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;

    this.stocks = new StocksResource(this);
    this.forex = new ForexResource(this);
    this.gold = new GoldResource(this);
    this.funds = new FundsResource(this);
    this.bonds = new BondsResource(this);
    this.viop = new ViopResource(this);
  }

  /**
   * Bürküt API'ye yetkilendirilmiş istek gönderir.
   */
  async request<T>(
    method: string,
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    let url = `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`;

    if (params) {
      const searchParams = new URLSearchParams();
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) {
          searchParams.append(k, String(v));
        }
      }
      const qs = searchParams.toString();
      if (qs) {
        url = `${url}?${qs}`;
      }
    }

    let controller: AbortController | undefined;
    let timer: any;
    if (typeof AbortController !== 'undefined') {
      controller = new AbortController();
      timer = setTimeout(() => controller?.abort(), this.timeoutMs);
    }

    try {
      const response = await fetch(url, {
        method: method.toUpperCase(),
        headers: {
          'X-API-Key': this.apiKey,
          'User-Agent': `Burkut-Node-SDK/${SDK_VERSION}`,
          Accept: 'application/json',
        },
        signal: controller?.signal,
      });

      const responseText = await response.text();
      let responseJson: any;
      try {
        responseJson = JSON.parse(responseText);
      } catch {
        // Not JSON
      }

      if (response.ok) {
        if (responseJson && typeof responseJson === 'object' && 'data' in responseJson) {
          return responseJson.data as T;
        }
        return (responseJson ?? responseText) as T;
      }

      // Hata işleme
      const errorCode = responseJson?.error;
      const errorMessage = responseJson?.message || responseJson?.error || response.statusText;

      if (response.status === 401) {
        throw new AuthenticationError(errorMessage || 'Geçersiz veya eksik API anahtarı.', responseText);
      }

      if (response.status === 403) {
        throw new ForbiddenError(errorMessage || 'Bu veri setine erişim yetkiniz bulunmuyor.', responseText);
      }

      if (response.status === 404) {
        throw new NotFoundError(errorMessage || 'İstenen kaynak bulunamadı.', responseText);
      }

      if (response.status === 429) {
        const retryHeader = response.headers.get('Retry-After');
        const retryAfter = retryHeader ? parseInt(retryHeader, 10) : undefined;

        if (errorCode === 'MONTHLY_QUOTA_EXCEEDED' || (errorMessage && errorMessage.toLowerCase().includes('kota'))) {
          throw new QuotaExceededError(errorMessage || 'Aylık API istek kotanız tükendi.', responseText);
        }

        throw new RateLimitError(
          errorMessage || 'Dakikalık hız limitine (rate-limit) ulaşıldı.',
          Number.isNaN(retryAfter) ? undefined : retryAfter,
          responseText
        );
      }

      if (response.status >= 500) {
        throw new ServerError(errorMessage || `Sunucu hatası (${response.status})`, response.status, responseText);
      }

      throw new BurkutError(errorMessage || `HTTP hatası: ${response.status}`, response.status, errorCode, responseText);
    } catch (err: any) {
      if (err instanceof BurkutError) {
        throw err;
      }
      if (err.name === 'AbortError') {
        throw new NetworkError(`İstek zaman aşımına uğradı (${this.timeoutMs}ms).`);
      }
      throw new NetworkError(`Bürküt API sunucusuna bağlanılamadı: ${err.message || err}`);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}
