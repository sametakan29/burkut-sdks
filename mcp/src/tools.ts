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

export const TOOLS: ToolDefinition[] = [
  {
    name: 'burkut_search_funds',
    description: 'Search and filter Turkish TEFAS mutual funds (Yatırım Fonları) by code, name, category, or top performance yields (1 ay, 3 ay, 6 ay, 1 yıl).',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search keyword matching fund code (e.g. "TI2", "MAC") or name (e.g. "Hisse", "Teknoloji", "Gümüş", "Eurobond").',
        },
        fundType: {
          type: 'string',
          description: 'Filter by fund type, e.g. "Hisse Senedi Fonu", "Para Piyasası Fonu", "Değişken Fon", "Kıymetli Madenler Fonu", "Borçlanma Araçları Fonu".',
        },
        sortBy: {
          type: 'string',
          enum: ['yield1y', 'yield6m', 'yield3m', 'yield1m', 'dailyChangePct'],
          description: 'Sort field (highest to lowest). Default is "yield1y".',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of funds to return (default: 15, max: 50).',
        },
      },
    },
    handler: async (client, args) => {
      const raw = await client.getFunds();
      let list: any[] = [];
      if (Array.isArray(raw)) {
        list = raw;
      } else if (raw && Array.isArray((raw as any).items)) {
        list = (raw as any).items;
      }

      if (args.query) {
        const q = String(args.query).toLowerCase().trim();
        list = list.filter((f) =>
          (f.symbol && f.symbol.toLowerCase().includes(q)) ||
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
        kod: f.symbol,
        isim: f.name,
        tur: f.fundType || f.type,
        fiyat: f.currentPrice,
        gunlukDegisimPct: f.dailyChangePct,
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
    description: 'Get in-depth metrics and multi-period returns for a specific Turkish TEFAS fund (e.g. MAC, TI2, TCD, GLDTR).',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: 'The 3-5 character TEFAS fund code, e.g. "MAC", "TI2", "TCD", "AFT".',
        },
      },
      required: ['symbol'],
    },
    handler: async (client, args) => {
      const fund = await client.getFundDetail(args.symbol);
      return JSON.stringify(fund, null, 2);
    },
  },

  {
    name: 'burkut_get_stock_quote',
    description: 'Get current price, percentage change, and volume for a Borsa Istanbul (BIST) equity (15-min delayed official feed).',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: 'Stock symbol without exchange prefix, e.g. "THYAO", "ASELS", "KCHOL", "GARAN".',
        },
      },
      required: ['symbol'],
    },
    handler: async (client, args) => {
      const quote = await client.getStockQuote(args.symbol);
      return JSON.stringify(quote, null, 2);
    },
  },

  {
    name: 'burkut_get_kap_announcements',
    description: 'Fetch latest Kamuyu Aydınlatma Platformu (KAP) company disclosures, material events, financial balance sheets, and corporate announcements.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: 'Optional stock symbol to filter disclosures for a specific firm (e.g. "THYAO"). If omitted, market-wide disclosures are returned.',
        },
        limit: {
          type: 'number',
          description: 'Number of notifications to retrieve (default: 10, max: 30).',
        },
      },
    },
    handler: async (client, args) => {
      const limit = Math.min(Math.max(Number(args.limit) || 10, 1), 30);
      const data = await client.getKapAnnouncements(args.symbol, 1, limit);
      return JSON.stringify(data, null, 2);
    },
  },

  {
    name: 'burkut_get_ipo_calendar',
    description: 'Get the Turkish public offering (Halka Arz) calendar, including active/upcoming IPOs, offering price, dates, and subscription status.',
    inputSchema: {
      type: 'object',
      properties: {
        activeOnly: {
          type: 'boolean',
          description: 'If true, only returns active and upcoming IPOs. If false, returns recent IPO history too.',
        },
      },
    },
    handler: async (client, args) => {
      const data = await client.getIpoList(Boolean(args.activeOnly));
      return JSON.stringify(data, null, 2);
    },
  },

  {
    name: 'burkut_get_dividends',
    description: 'Fetch dividend distribution history, dividend yield %, payout dates, and net payment per share for BIST companies.',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: {
          type: 'string',
          description: 'Optional BIST stock symbol, e.g. "FROTO", "TUPRS", "EREGL". If omitted, upcoming market dividends are returned.',
        },
      },
    },
    handler: async (client, args) => {
      const data = await client.getDividends(args.symbol);
      return JSON.stringify(data, null, 2);
    },
  },

  {
    name: 'burkut_get_macro_indicators',
    description: 'Fetch Turkish macroeconomic indicators: official inflation rates (TÜFE / ÜFE monthly & annual), foreign exchange rates (USD/TRY, EUR/TRY), and precious metals (Gram Altın, Çeyrek Altın, Ons).',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          enum: ['all', 'inflation', 'forex', 'gold'],
          description: 'Category to fetch: "inflation" for CPI/PPI, "forex" for FX rates, "gold" for precious metals, or "all" (default).',
        },
      },
    },
    handler: async (client, args) => {
      const category = args.category || 'all';
      const results: Record<string, any> = {};

      if (category === 'all' || category === 'inflation') {
        try {
          results.inflation = await client.getInflation();
        } catch (e: any) {
          results.inflation = { error: e.message };
        }
      }

      if (category === 'all' || category === 'forex') {
        try {
          results.forex = await client.getForex();
        } catch (e: any) {
          results.forex = { error: e.message };
        }
      }

      if (category === 'all' || category === 'gold') {
        try {
          results.gold = await client.getGold();
        } catch (e: any) {
          results.gold = { error: e.message };
        }
      }

      return JSON.stringify(results, null, 2);
    },
  },
];
