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
  assert.strictEqual(client.baseUrl, 'https://burkutportfoy.com/api/public/v1');
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
