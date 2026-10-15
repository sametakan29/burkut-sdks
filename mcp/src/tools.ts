import { BurkutApiClient, normalizeSymbol } from './client.js';

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
  handler: (client: BurkutApiClient, args: any) => Promise<string>;
}

function unwrap(res: any): any {
  if (res && typeof res === 'object' && 'data' in res) {
    return res.data;
  }
  return res;
}

export const TOOLS: ToolDefinition[] = [
  {
    name: 'burkut_search_funds',
    description: 'TEFAS yatırım fonlarını ara, filtrele ve getirilerine (1 ay, 3 ay, 6 ay, 1 yıl) göre sırala.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Fon kodu (örn: "TI2", "MAC") veya isim anahtar kelimesi (örn: "Hisse", "Teknoloji", "Gümüş", "Eurobond").',
        },
        fundType: {
          type: 'string',
          description: 'Fon türü filtresi (örn: "Hisse Senedi Fonu", "Para Piyasası Fonu", "Değişken Fon", "Kıymetli Madenler Fonu").',
        },
        sortBy: {
          type: 'string',
          enum: ['yield1y', 'yield6m', 'yield3m', 'yield1m', 'dailyChangePct'],
          description: 'Sıralama ölçütü (büyükten küçüğe). Varsayılan: "yield1y".',
        },
        limit: {
          type: 'number',
          description: 'Döndürülecek maksimum fon sayısı (varsayılan: 15, maksimum: 50).',
        },
      },
    },
    handler: async (client, args) => {
      const raw = await client.getFunds();
      let list: any[] = [];
      const payload = unwrap(raw);
      if (Array.isArray(payload)) {
        list = payload;
      } else if (payload && Array.isArray((payload as any).items)) {
        list = (payload as any).items;
      }

      if (args.query) {
        const q = String(args.query).toLowerCase().trim();
        list = list.filter((f) =>
          (f.symbol && f.symbol.toLowerCase().includes(q)) ||
          (f.code && f.code.toLowerCase().includes(q)) ||
          (f.name && f.name.toLowerCase().includes(q)) ||
          (f.fundType && f.fundType.toLowerCase().includes(q))
        );
      }

      if (args.fundType) {
        const ft = String(args.fundType).toLowerCase().trim();
        list = list.filter((f) => f.fundType && f.fundType.toLowerCase().includes(ft));
      }

      const sortBy = args.sortBy || 'yield1y';
      list.sort((a, b) => {
        const valA = Number(a[sortBy] ?? -9999);
        const valB = Number(b[sortBy] ?? -9999);
        return valB - valA;
      });

      const limit = Math.min(Math.max(Number(args.limit) || 15, 1), 50);
      const results = list.slice(0, limit).map((f) => ({
        kod: f.symbol || f.code,
        isim: f.name,
        tur: f.fundType || f.type,
        fiyat: f.currentPrice ?? f.price,
        gunlukDegisimPct: f.dailyChangePct ?? f.dailyChangePercent,
        getiri1Ay: f.yield1m != null ? `%${f.yield1m}` : 'N/A',
        getiri3Ay: f.yield3m != null ? `%${f.yield3m}` : 'N/A',
        getiri6Ay: f.yield6m != null ? `%${f.yield6m}` : 'N/A',
        getiri1Yil: f.yield1y != null ? `%${f.yield1y}` : 'N/A',
        riskSeviyesi: f.riskLevel ?? 'N/A',
      }));

      return JSON.stringify({
        totalFound: list.length,
        returned: results.length,
        funds: results,
      }, null, 2);
    },
  },

  {
    name: 'burkut_get_fund_detail',
    description: 'Belirli bir TEFAS fonunun (örn: MAC, TI2, TCD) çoklu periyot getirilerini, risk seviyesini ve detaylı künyesini getirir.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: 'TEFAS fon kodu (örn: "MAC", "TI2", "TCD", "AFT").',
        },
      },
      required: ['symbol'],
    },
    handler: async (client, args) => {
      const fund = await client.getFundDetail(args.symbol);
      return JSON.stringify(unwrap(fund), null, 2);
    },
  },

  {
    name: 'burkut_get_stock_quote',
    description: 'Borsa İstanbul (BIST) hisse senedinin 15 dk gecikmeli resmi fiyatını, günlük değişim oranını ve hacmini getirir.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: 'Hisse sembolü (örn: "THYAO", "ASELS", "KCHOL", "GARAN").',
        },
      },
      required: ['symbol'],
    },
    handler: async (client, args) => {
      const quote = await client.getStockQuote(args.symbol);
      return JSON.stringify(unwrap(quote), null, 2);
    },
  },

  {
    name: 'burkut_list_stocks',
    description: 'Borsa İstanbul (BIST) hisselerini listeler veya virgülle ayrılmış sembol listesinin verilerini toplu çeker.',
    inputSchema: {
      type: 'object',
      properties: {
        symbols: {
          type: 'string',
          description: 'Virgülle ayrılmış hisse sembolleri (örn: "THYAO,ASELS,EREGL"). Belirtilmezse popüler hisseleri döner.',
        },
      },
    },
    handler: async (client, args) => {
      const symList = args.symbols
        ? String(args.symbols).split(',').map((s) => s.trim()).filter(Boolean)
        : undefined;
      const stocks = await client.getStocks(symList);
      return JSON.stringify(unwrap(stocks), null, 2);
    },
  },

  {
    name: 'burkut_get_stock_history',
    description: 'Borsa İstanbul (BIST) hisse senedinin bölünme düzeltmeli geçmiş OHLCV günlük bar serisini getirir (250 güne kadar). Teknik analiz ve geriye dönük testler için kullanılır.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: 'Hisse sembolü (örn: "THYAO", "GARAN", "TUPRS").',
        },
        days: {
          type: 'number',
          description: 'İstenen geçmiş işlem günü sayısı (örn: 30, 90, 250). Varsayılan: 250.',
        },
      },
      required: ['symbol'],
    },
    handler: async (client, args) => {
      const history = await client.getStockHistory(args.symbol, { days: args.days ? Number(args.days) : 250 });
      return JSON.stringify(unwrap(history), null, 2);
    },
  },

  {
    name: 'burkut_get_stock_eod',
    description: 'Tüm Borsa İstanbul (BIST) hisselerinin (560+ hisse) toplu gün sonu kapanış, OHLC ve hacim verilerini tek seferde getirir.',
    inputSchema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'İsteğe bağlı geçmiş tarih (YYYY-MM-DD formatında, örn: "2026-10-09"). Belirtilmezse son kapanmış seans verisi döner.',
        },
      },
    },
    handler: async (client, args) => {
      const eod = await client.getStockEod(args.date);
      return JSON.stringify(unwrap(eod), null, 2);
    },
  },

  {
    name: 'burkut_get_kap_notifications',
    description: 'Kamuyu Aydınlatma Platformu (KAP) son şirket bildirimlerini, özel durum açıklamalarını ve haberleri listeler.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: 'İsteğe bağlı şirket borsa kodu filtresi (örn: "THYAO", "ASELS", "KCHOL").',
        },
        limit: {
          type: 'number',
          description: 'Döndürülecek maksimum bildirim sayısı (varsayılan: 20).',
        },
      },
    },
    handler: async (client, args) => {
      const kap = await client.getKAP({ symbol: args.symbol, size: args.limit ? Number(args.limit) : 20 });
      return JSON.stringify(unwrap(kap), null, 2);
    },
  },


  {
    name: 'burkut_get_forex',
    description: 'Serbest piyasa ve TCMB döviz kurlarını (USD/TRY, EUR/TRY, GBP/TRY vb.) getirir.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: 'Belirli bir para birimi kodu (örn: "USD", "EUR"). Belirtilmezse tüm döviz kurlarını döner.',
        },
      },
    },
    handler: async (client, args) => {
      if (args.symbol) {
        const item = await client.getForexDetail(args.symbol);
        return JSON.stringify(unwrap(item), null, 2);
      }
      const data = await client.getForex();
      return JSON.stringify(unwrap(data), null, 2);
    },
  },

  {
    name: 'burkut_get_gold',
    description: 'Gram Altın, Çeyrek Altın, Yarım Altın, Tam Altın ve Ons fiyatlarını getirir.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: 'Belirli bir altın türü (örn: "ALTIN", "CEYREK_ALTIN"). Belirtilmezse tüm değerli madenleri döner.',
        },
      },
    },
    handler: async (client, args) => {
      if (args.symbol) {
        const item = await client.getGoldDetail(args.symbol);
        return JSON.stringify(unwrap(item), null, 2);
      }
      const data = await client.getGold();
      return JSON.stringify(unwrap(data), null, 2);
    },
  },

  {
    name: 'burkut_get_bonds',
    description: 'Devlet tahvilleri ve hazine bonoları faiz getirilerini listeler.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (client) => {
      const data = await client.getBonds();
      return JSON.stringify(unwrap(data), null, 2);
    },
  },

  {
    name: 'burkut_get_viop',
    description: 'VİOP (Vadeli İşlem ve Opsiyon Piyasası) kontratlarını ve güncel uzlaşma fiyatlarını listeler.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    handler: async (client) => {
      const data = await client.getViop();
      return JSON.stringify(unwrap(data), null, 2);
    },
  },

  {
    name: 'burkut_get_stock_indicators',
    description: 'Borsa İstanbul (BIST) hisseleri için teknik göstergeleri (RSI, MACD, Bollinger Bantları veya Özet) hesaplar ve getirir.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: 'Hisse senedi sembolü (örn: "THYAO", "ASELS", "GARAN").',
        },
        indicator: {
          type: 'string',
          enum: ['summary', 'rsi', 'macd', 'bollinger'],
          description: 'İstenen indikatör türü. "summary" (varsayılan) RSI, MACD ve Bollinger verilerini tek yanıtta döner.',
        },
        period: {
          type: 'number',
          description: 'RSI için periyot (varsayılan: 14) veya Bollinger için periyot (varsayılan: 20).',
        },
        fast: {
          type: 'number',
          description: 'MACD hızlı EMA periyodu (varsayılan: 12).',
        },
        slow: {
          type: 'number',
          description: 'MACD yavaş EMA periyodu (varsayılan: 26).',
        },
        signal: {
          type: 'number',
          description: 'MACD sinyal periyodu (varsayılan: 9).',
        },
        stdDev: {
          type: 'number',
          description: 'Bollinger standart sapma çarpanı (varsayılan: 2.0).',
        },
      },
      required: ['symbol'],
    },
    handler: async (client, args) => {
      const sym = args.symbol;
      const type = (args.indicator || 'summary').toLowerCase();
      let res: any;
      if (type === 'rsi') {
        res = await client.getRSI(sym, args.period);
      } else if (type === 'macd') {
        res = await client.getMACD(sym, { fast: args.fast, slow: args.slow, signal: args.signal });
      } else if (type === 'bollinger') {
        res = await client.getBollinger(sym, { period: args.period, stdDev: args.stdDev });
      } else {
        res = await client.getIndicatorsSummary(sym);
      }
      return JSON.stringify(unwrap(res), null, 2);
    },
  },
];
