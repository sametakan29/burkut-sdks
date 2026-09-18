/**
 * Bürküt SDK Error Classes
 */

export class BurkutError extends Error {
  public readonly statusCode?: number;
  public readonly errorCode?: string;
  public readonly responseBody?: string;

  constructor(message: string, statusCode?: number, errorCode?: string, responseBody?: string) {
    super(message);
    this.name = 'BurkutError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.responseBody = responseBody;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthenticationError extends BurkutError {
  constructor(message: string = 'Geçersiz veya eksik API anahtarı.', responseBody?: string) {
    super(message, 401, 'UNAUTHORIZED', responseBody);
    this.name = 'AuthenticationError';
  }
}

export class ForbiddenError extends BurkutError {
  constructor(message: string = 'Bu veri setine erişim yetkiniz bulunmuyor.', responseBody?: string) {
    super(message, 403, 'FORBIDDEN', responseBody);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends BurkutError {
  constructor(message: string = 'İstenen kaynak bulunamadı.', responseBody?: string) {
    super(message, 404, 'NOT_FOUND', responseBody);
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends BurkutError {
  public readonly retryAfter?: number;

  constructor(
    message: string = 'Dakikalık hız limitine (rate-limit) ulaşıldı.',
    retryAfter?: number,
    responseBody?: string
  ) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', responseBody);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class QuotaExceededError extends BurkutError {
  constructor(message: string = 'Aylık API istek kotanız tükendi.', responseBody?: string) {
    super(message, 429, 'MONTHLY_QUOTA_EXCEEDED', responseBody);
    this.name = 'QuotaExceededError';
  }
}

export class ServerError extends BurkutError {
  constructor(message: string = 'Bürküt API sunucu hatası.', statusCode: number = 500, responseBody?: string) {
    super(message, statusCode, 'SERVER_ERROR', responseBody);
    this.name = 'ServerError';
  }
}

export class NetworkError extends BurkutError {
  constructor(message: string = 'Bürküt API sunucusuna bağlanılamadı.') {
    super(message);
    this.name = 'NetworkError';
  }
}
