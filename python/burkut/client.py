"""
Bürküt Client Module
"""

import json
import os
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, Optional

from burkut.exceptions import (
    AuthenticationError,
    BurkutError,
    ForbiddenError,
    NetworkError,
    NotFoundError,
    QuotaExceededError,
    RateLimitError,
    ServerError,
)
from burkut.resources.bonds import BondsResource
from burkut.resources.forex import ForexResource
from burkut.resources.funds import FundsResource
from burkut.resources.gold import GoldResource
from burkut.resources.stocks import StocksResource
from burkut.resources.viop import ViopResource

DEFAULT_BASE_URL = "https://burkutportfoy.com/api/public/v1"
DEFAULT_TIMEOUT = 15.0
SDK_VERSION = "1.0.0"


class BurkutClient:
    """
    Bürküt Finansal Veri API İstemcisi.

    Kullanım:
        >>> from burkut import BurkutClient
        >>> client = BurkutClient(api_key="bk_live_...")
        >>> thyao = client.stocks.get("THYAO")
        >>> print(thyao["last_price"])
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = DEFAULT_BASE_URL,
        timeout: float = DEFAULT_TIMEOUT,
    ):
        """
        İstemciyi başlatır.

        Args:
            api_key: Bürküt API anahtarı ('bk_live_...' veya 'bk_test_...').
                     Belirtilmezse 'BURKUT_API_KEY' ortam değişkeninden okunur.
            base_url: API taban URL adresi.
            timeout: İstek zaman aşımı süresi (saniye).
        """
        resolved_key = api_key or os.environ.get("BURKUT_API_KEY")
        if not resolved_key:
            raise AuthenticationError(
                "API anahtarı bulunamadı. Lütfen 'api_key' parametresini sağlayın "
                "veya 'BURKUT_API_KEY' ortam değişkenini ayarlayın."
            )

        self.api_key = resolved_key.strip()
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

        # Kaynak nesneleri
        self.stocks = StocksResource(self)
        self.forex = ForexResource(self)
        self.gold = GoldResource(self)
        self.funds = FundsResource(self)
        self.bonds = BondsResource(self)
        self.viop = ViopResource(self)

    def request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
    ) -> Any:
        """
        API'ye yetkilendirilmiş bir HTTP isteği gönderir ve yanıtı işler.
        """
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        if params:
            query_string = urllib.parse.urlencode({k: v for k, v in params.items() if v is not None})
            if query_string:
                url = f"{url}?{query_string}"

        req = urllib.request.Request(
            url=url,
            method=method.upper(),
            headers={
                "X-API-Key": self.api_key,
                "User-Agent": f"Burkut-Python-SDK/{SDK_VERSION}",
                "Accept": "application/json",
            },
        )

        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as response:
                status_code = response.status
                body = response.read().decode("utf-8")
                try:
                    data = json.loads(body)
                except json.JSONDecodeError:
                    return body

                # Bürküt Public API standart sarmalayıcısı {"data": ...}
                if isinstance(data, dict) and "data" in data:
                    return data["data"]
                return data

        except urllib.error.HTTPError as err:
            status_code = err.code
            err_body = err.read().decode("utf-8") if err.fp else ""
            err_code = None
            err_msg = err.reason

            try:
                parsed = json.loads(err_body)
                if isinstance(parsed, dict):
                    err_code = parsed.get("error")
                    err_msg = parsed.get("message") or parsed.get("error") or err_msg
            except Exception:
                pass

            if status_code == 401:
                raise AuthenticationError(
                    message=err_msg or "Geçersiz veya eksik API anahtarı.",
                    status_code=401,
                    error_code=err_code or "UNAUTHORIZED",
                    response_body=err_body,
                ) from err

            if status_code == 403:
                raise ForbiddenError(
                    message=err_msg or "Bu veri setine erişim yetkiniz bulunmuyor.",
                    status_code=403,
                    error_code=err_code or "FORBIDDEN",
                    response_body=err_body,
                ) from err

            if status_code == 404:
                raise NotFoundError(
                    message=err_msg or "İstenen kaynak bulunamadı.",
                    status_code=404,
                    error_code=err_code or "NOT_FOUND",
                    response_body=err_body,
                ) from err

            if status_code == 429:
                retry_after_hdr = err.headers.get("Retry-After") if err.headers else None
                retry_after = int(retry_after_hdr) if retry_after_hdr and retry_after_hdr.isdigit() else None

                if err_code == "MONTHLY_QUOTA_EXCEEDED" or "kota" in (err_msg or "").lower():
                    raise QuotaExceededError(
                        message=err_msg or "Aylık API istek kotanız tükendi.",
                        status_code=429,
                        error_code="MONTHLY_QUOTA_EXCEEDED",
                        response_body=err_body,
                    ) from err

                raise RateLimitError(
                    message=err_msg or "Dakikalık hız limitine (rate-limit) ulaşıldı.",
                    status_code=429,
                    error_code=err_code or "RATE_LIMIT_EXCEEDED",
                    retry_after=retry_after,
                    response_body=err_body,
                ) from err

            if status_code >= 500:
                raise ServerError(
                    message=err_msg or f"Sunucu hatası oluştu ({status_code}).",
                    status_code=status_code,
                    error_code=err_code or "SERVER_ERROR",
                    response_body=err_body,
                ) from err

            raise BurkutError(
                message=err_msg or f"HTTP hatası: {status_code}",
                status_code=status_code,
                error_code=err_code,
                response_body=err_body,
            ) from err

        except (urllib.error.URLError, TimeoutError) as net_err:
            raise NetworkError(f"Bürküt API sunucusuna bağlanılamadı: {net_err}") from net_err
