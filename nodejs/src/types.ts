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

export interface HistoryPoint {
  timestamp: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockHistoryResponse {
  symbol: string;
  currency: string;
  range: string;
  interval: string;
  count: number;
  points: HistoryPoint[];
}

export interface StockHistoryOptions {
  days?: number;
  range?: string;
  interval?: string;
  currency?: string;
}

export interface EODStockRecord {
  symbol: string;
  name?: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  volume_unit?: string;
  change_rate?: number;
}

export interface StockEODResponse {
  date: string;
  timestamp: number;
  count: number;
  stocks: EODStockRecord[];
}

export interface DividendItem {
  symbol: string;
  company_name?: string;
  gross_dividend: number;
  net_dividend: number;
  dividend_yield: number;
  record_date?: string | null;
  payment_date?: string | null;
  year?: number;
}

export interface KAPNotificationItem {
  id: string;
  title: string;
  summary?: string;
  symbol?: string;
  company_title?: string;
  publish_date: string;
  disclosure_type?: string;
  url?: string;
}

export interface KAPListResponse {
  total: number;
  page: number;
  size: number;
  items: KAPNotificationItem[];
}

export interface RSIResult {
  symbol: string;
  period: number;
  rsi: number;
  signal: string;
  last_close: number;
  last_date: string;
  data_points: number;
}

export interface MACDResult {
  symbol: string;
  fast_period: number;
  slow_period: number;
  signal_period: number;
  macd: number;
  signal: number;
  histogram: number;
  trend: string;
  last_close: number;
  last_date: string;
  data_points: number;
}

export interface BollingerResult {
  symbol: string;
  period: number;
  std_dev: number;
  upper: number;
  middle: number;
  lower: number;
  bandwidth: number;
  percent_b: number;
  position: string;
  last_close: number;
  last_date: string;
  data_points: number;
}

export interface IndicatorsSummary {
  symbol: string;
  last_close: number;
  last_date: string;
  rsi?: RSIResult;
  macd?: MACDResult;
  bollinger?: BollingerResult;
}

export interface BurkutClientOptions {
  /**
   * Bürküt API Anahtarı ('bk_live_...' veya 'bk_test_...').
   * Belirtilmezse process.env.BURKUT_API_KEY kullanılır.
   */
  apiKey?: string;

  /**
   * API taban URL adresi (Varsayılan: 'https://api.burkutportfoy.com/api/public/v1').
   */
  baseUrl?: string;

  /**
   * İstek zaman aşımı süresi (milisaniye cinsinden, varsayılan: 15000ms).
   */
  timeoutMs?: number;
}

