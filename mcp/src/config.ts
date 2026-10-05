export interface BurkutConfig {
  baseUrl: string;
  apiKey?: string;
  timeoutMs: number;
}

export function getConfig(): BurkutConfig {
  const envBaseUrl = process.env.BURKUT_API_BASE_URL;
  // Default to production API if not specified
  const baseUrl = (envBaseUrl || 'https://api.burkutportfoy.com').replace(/\/+$/, '');
  const apiKey = process.env.BURKUT_API_KEY || undefined;
  const timeoutMs = parseInt(process.env.BURKUT_TIMEOUT_MS || '15000', 10);

  return {
    baseUrl,
    apiKey,
    timeoutMs,
  };
}
