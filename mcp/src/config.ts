export interface BurkutConfig {
  baseUrl: string;
  apiKey?: string;
  timeoutMs: number;
}

export function getConfig(): BurkutConfig {
  const envBaseUrl = process.env.BURKUT_API_BASE_URL;
  // Varsayılan olarak doğrudan geliştirici veri borusuna (/api/public/v1) bağlanır
  const baseUrl = (envBaseUrl || 'https://api.burkutportfoy.com/api/public/v1').replace(/\/+$/, '');
  const apiKey = process.env.BURKUT_API_KEY || undefined;
  const timeoutMs = parseInt(process.env.BURKUT_TIMEOUT_MS || '15000', 10);

  return {
    baseUrl,
    apiKey,
    timeoutMs,
  };
}
