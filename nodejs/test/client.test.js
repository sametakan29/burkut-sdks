const test = require('node:test');
const assert = require('node:assert');
const {
  BurkutClient,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  QuotaExceededError
} = require('../dist/index.js');

test('BurkutClient initialization without API key throws AuthenticationError', () => {
  const originalEnv = process.env.BURKUT_API_KEY;
  delete process.env.BURKUT_API_KEY;

  try {
    assert.throws(() => {
      new BurkutClient();
    }, AuthenticationError);
  } finally {
    if (originalEnv) process.env.BURKUT_API_KEY = originalEnv;
  }
});

test('BurkutClient initialization with API key sets properties', () => {
  const client = new BurkutClient({ apiKey: 'bk_live_test_key' });
  assert.strictEqual(client.apiKey, 'bk_live_test_key');
  assert.strictEqual(client.baseUrl, 'https://api.burkutportfoy.com/api/public/v1');
});

test('StocksResource builds correct URL and headers', async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = '';
  let requestedHeaders = {};

  globalThis.fetch = async (url, init) => {
    requestedUrl = String(url);
    requestedHeaders = init.headers;
    return new Response(JSON.stringify({
      data: { symbol: 'THYAO', last_price: 320.0 }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };

  try {
    const client = new BurkutClient({ apiKey: 'bk_live_test' });
    const stock = await client.stocks.get('thyao');

    assert.strictEqual(stock.symbol, 'THYAO');
    assert.strictEqual(stock.last_price, 320.0);
    assert.ok(requestedUrl.includes('/stocks/THYAO'));
    assert.strictEqual(requestedHeaders['X-API-Key'], 'bk_live_test');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('StocksResource list with symbols query parameter', async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = '';

  globalThis.fetch = async (url) => {
    requestedUrl = String(url);
    return new Response(JSON.stringify({
      data: [
        { symbol: 'THYAO', last_price: 320.0 },
        { symbol: 'GARAN', last_price: 115.0 }
      ]
    }), { status: 200 });
  };

  try {
    const client = new BurkutClient({ apiKey: 'bk_live_test' });
    const list = await client.stocks.list(['thyao', 'garan']);

    assert.strictEqual(list.length, 2);
    assert.ok(requestedUrl.includes('symbols=THYAO%2CGARAN'));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Handles 401 Unauthorized properly', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    return new Response(JSON.stringify({
      error: 'UNAUTHORIZED',
      message: 'Invalid API Key'
    }), { status: 401 });
  };

  try {
    const client = new BurkutClient({ apiKey: 'bad_key' });
    await assert.rejects(async () => {
      await client.stocks.get('THYAO');
    }, AuthenticationError);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Handles 429 RateLimitError properly', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () => {
    return new Response(JSON.stringify({
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests'
    }), { status: 429, headers: { 'Retry-After': '30' } });
  };

  try {
    const client = new BurkutClient({ apiKey: 'test' });
    await assert.rejects(async () => {
      await client.forex.list();
    }, (err) => {
      return err instanceof RateLimitError && err.retryAfter === 30;
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Handles 429 QuotaExceededError properly', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () => {
    return new Response(JSON.stringify({
      error: 'MONTHLY_QUOTA_EXCEEDED',
      message: 'Aylık istek kotanız tükendi'
    }), { status: 429 });
  };

  try {
    const client = new BurkutClient({ apiKey: 'test' });
    await assert.rejects(async () => {
      await client.gold.list();
    }, QuotaExceededError);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('StocksResource getHistory and getEod build correct endpoints', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url) => {
    calls.push(String(url));
    if (String(url).includes('/history')) {
      return new Response(JSON.stringify({
        data: { symbol: 'THYAO', count: 1, points: [{ timestamp: 1700000000, close: 280 }] }
      }), { status: 200 });
    }
    return new Response(JSON.stringify({
      data: { date: '2026-10-09', count: 563, stocks: [] }
    }), { status: 200 });
  };

  try {
    const client = new BurkutClient({ apiKey: 'bk_live_test' });
    const hist = await client.stocks.getHistory('thyao', { days: 250 });
    assert.strictEqual(hist.symbol, 'THYAO');
    assert.ok(calls[0].includes('/stocks/THYAO/history?days=250'));

    const eod = await client.stocks.getEod('2026-10-09');
    assert.strictEqual(eod.date, '2026-10-09');
    assert.ok(calls[1].includes('/stocks/eod?date=2026-10-09'));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('KAPResource list and getBySymbol build correct endpoints', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url) => {
    calls.push(String(url));
    return new Response(JSON.stringify({
      data: { total: 10, page: 0, size: 20, items: [] }
    }), { status: 200 });
  };

  try {
    const client = new BurkutClient({ apiKey: 'bk_live_test' });
    await client.kap.list({ symbol: 'THYAO', page: 1 });
    assert.ok(calls[0].includes('/kap?symbol=THYAO&page=1'));

    await client.kap.getBySymbol('GARAN', { size: 5 });
    assert.ok(calls[1].includes('/kap/GARAN?size=5'));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('IndicatorsResource builds correct endpoints and parameters', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url) => {
    calls.push(String(url));
    if (String(url).includes('/rsi')) {
      return new Response(JSON.stringify({
        data: { symbol: 'THYAO', period: 14, rsi: 55.4, signal: 'Nötr', last_close: 310.5, last_date: '2026-10-15', data_points: 200 }
      }), { status: 200 });
    }
    if (String(url).includes('/macd')) {
      return new Response(JSON.stringify({
        data: { symbol: 'THYAO', fast_period: 12, slow_period: 26, signal_period: 9, macd: 2.1, signal: 1.8, histogram: 0.3, trend: 'Boğa (Alım Eğilimli)', last_close: 310.5, last_date: '2026-10-15', data_points: 200 }
      }), { status: 200 });
    }
    if (String(url).includes('/bollinger')) {
      return new Response(JSON.stringify({
        data: { symbol: 'THYAO', period: 20, std_dev: 2.0, upper: 320, middle: 305, lower: 290, bandwidth: 9.8, percent_b: 0.68, position: 'Bant İçi', last_close: 310.5, last_date: '2026-10-15', data_points: 200 }
      }), { status: 200 });
    }
    return new Response(JSON.stringify({
      data: { symbol: 'THYAO', last_close: 310.5, last_date: '2026-10-15' }
    }), { status: 200 });
  };

  try {
    const client = new BurkutClient({ apiKey: 'bk_live_test' });

    const summary = await client.indicators.getSummary('thyao');
    assert.strictEqual(summary.symbol, 'THYAO');
    assert.ok(calls[0].includes('/indicators/THYAO'));

    const rsi = await client.indicators.getRSI('thyao', 14);
    assert.strictEqual(rsi.rsi, 55.4);
    assert.ok(calls[1].includes('/indicators/THYAO/rsi?period=14'));

    const macd = await client.indicators.getMACD('thyao', { fast: 12, slow: 26, signal: 9 });
    assert.strictEqual(macd.macd, 2.1);
    assert.ok(calls[2].includes('/indicators/THYAO/macd?fast=12&slow=26&signal=9'));

    const bb = await client.indicators.getBollinger('thyao', { period: 20, stdDev: 2.0 });
    assert.strictEqual(bb.upper, 320);
    assert.ok(calls[3].includes('/indicators/THYAO/bollinger?period=20&stdDev=2'));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

