"""
Bürküt SDK Exceptions
"""

from typing import Optional


class BurkutError(Exception):
    """Bürküt API isteklerinde meydana gelen temel istisna sınıfı."""

    def __init__(
        self,
        message: str,
        status_code: Optional[int] = None,
        error_code: Optional[str] = None,
        response_body: Optional[str] = None,
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.response_body = response_body

    def __str__(self) -> str:
        if self.status_code and self.error_code:
            return f"[{self.status_code} {self.error_code}] {self.message}"
        if self.status_code:
            return f"[{self.status_code}] {self.message}"
        return self.message


class AuthenticationError(BurkutError):
    """Geçersiz veya eksik API anahtarı (HTTP 401)."""
    pass


class ForbiddenError(BurkutError):
    """Yetkisiz veri seti erişimi veya askıya alınmış hesap (HTTP 403)."""
    pass


class NotFoundError(BurkutError):
    """Aranan finansal sembol veya veri bulunamadı (HTTP 404)."""
    pass


class RateLimitError(BurkutError):
    """Hız limiti aşıldı (HTTP 429)."""

    def __init__(
        self,
        message: str,
        status_code: int = 429,
        error_code: str = "RATE_LIMIT_EXCEEDED",
        retry_after: Optional[int] = None,
        response_body: Optional[str] = None,
    ):
        super().__init__(message, status_code, error_code, response_body)
        self.retry_after = retry_after


class QuotaExceededError(BurkutError):
    """Aylık istek kotası tükendi (HTTP 429)."""

    def __init__(
        self,
        message: str,
        status_code: int = 429,
        error_code: str = "MONTHLY_QUOTA_EXCEEDED",
        response_body: Optional[str] = None,
    ):
        super().__init__(message, status_code, error_code, response_body)


class ServerError(BurkutError):
    """Bürküt API sunucu hatası (HTTP 500+)."""
    pass


class NetworkError(BurkutError):
    """Ağ bağlantı hatası veya zaman aşımı."""
    pass
