export interface BurkutConfig {
  baseUrl: string;
  apiKey?: string;
  timeoutMs: number;
}

function getCliArg(flag: string): string | undefined {
  if (typeof process === 'undefined' || !Array.isArray(process.argv)) return undefined;
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === flag && i + 1 < args.length) {
      return args[i + 1];
    }
    if (args[i].startsWith(`${flag}=`)) {
      return args[i].slice(flag.length + 1);
    }
  }
  return undefined;
}

export function getConfig(): BurkutConfig {
  const envBaseUrl = process.env.BURKUT_API_BASE_URL || getCliArg('--base-url');
  // Varsayılan olarak doğrudan geliştirici veri borusuna (/api/public/v1) bağlanır
  const baseUrl = (envBaseUrl || 'https://api.burkutportfoy.com/api/public/v1').replace(/\/+$/, '');
  const apiKey = (process.env.BURKUT_API_KEY || getCliArg('--api-key') || getCliArg('-k') || '').trim() || undefined;
  const timeoutMs = parseInt(process.env.BURKUT_TIMEOUT_MS || getCliArg('--timeout') || '15000', 10);

  return {
    baseUrl,
    apiKey,
    timeoutMs,
  };
}
