/**
 * Bürküt SDK TypeScript Tip Tanımları
 */

export interface StockItem {
  symbol: string;
  name?: string;
  last_price: number;
  change_rate?: number;
  change_amount?: number;
  high?: number;
  low?: number;
  volume?: number;
  volume_try?: number;
  time?: string;
}

export interface ForexItem {
  symbol: string;
  name?: string;
  buying: number;
  selling: number;
  change_rate?: number;
  time?: string;
}

export interface GoldItem {
  symbol: string;
  name?: string;
  buying: number;
  selling: number;
  change_rate?: number;
  time?: string;
}

export interface FundItem {
  symbol: string;
  name?: string;
  price: number;
  daily_return?: number;
  category?: string;
  fund_size?: number;
  investor_count?: number;
  time?: string;
}

export interface BondItem {
  symbol: string;
  name?: string;
  compound_interest?: number;
  simple_interest?: number;
  maturity_date?: string;
  time?: string;
}

export interface ViopItem {
  symbol: string;
  name?: string;
  last_price: number;
  change_rate?: number;
  open_interest?: number;
  settlement_price?: number;
  time?: string;
}

export interface BurkutClientOptions {
  /**
   * Bürküt API Anahtarı ('bk_live_...' veya 'bk_test_...').
   * Belirtilmezse process.env.BURKUT_API_KEY kullanılır.
   */
  apiKey?: string;

  /**
   * API taban URL adresi (Varsayılan: 'https://burkutportfoy.com/api/public/v1').
   */
  baseUrl?: string;

  /**
   * İstek zaman aşımı süresi (milisaniye cinsinden, varsayılan: 15000ms).
   */
  timeoutMs?: number;
}
