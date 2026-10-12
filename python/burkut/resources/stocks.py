"""
BIST Stocks Resource
"""

from typing import Any, Dict, List, Optional
from burkut.resources.base import BaseResource


class StocksResource(BaseResource):
    """Borsa İstanbul (BIST) hisse senedi verileri (15 dk gecikmeli)."""

    def list(self, symbols: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        """
        BIST hisselerini listeler.

        Args:
            symbols: İsteğe bağlı olarak sadece belirli sembolleri filtreler (Örn: ["THYAO", "GARAN", "ASELS"])

        Returns:
            Hisse senetlerinin 15 dk gecikmeli fiyat, değişim ve hacim verileri listesi.
        """
        params = {}
        if symbols:
            params["symbols"] = ",".join(s.strip().upper() for s in symbols if s.strip())
        res = self._get("/stocks", params=params if params else None)
        return res if isinstance(res, list) else []

    def get(self, symbol: str) -> Dict[str, Any]:
        """
        Tek bir hisse senedinin detaylı verilerini getirir (15 dk gecikmeli).

        Args:
            symbol: Hisse senedi sembol kodu (Örn: 'THYAO', 'GARAN', 'EREGL')

        Returns:
            Hisse senedine ait 15 dk gecikmeli son fiyat, günlük yüksek/düşük, hacim ve değişim bilgileri.
        """
        if not symbol or not isinstance(symbol, str):
            raise ValueError("symbol parametresi boş olamaz.")
        return self._get(f"/stocks/{symbol.strip().upper()}")

    def get_history(
        self,
        symbol: str,
        days: Optional[int] = None,
        range_: Optional[str] = None,
        interval: Optional[str] = None,
        currency: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Hisse senedinin geçmiş OHLCV verilerini getirir (bölünme düzeltmeli).

        Args:
            symbol: Hisse senedi sembol kodu (Örn: 'THYAO')
            days: Son kaç işlem gününün getirileceği (Örn: 250)
            range_: Periyot aralığı ('1mo', '3mo', '6mo', '1y', '2y', '5y', 'max')
            interval: Bar aralığı ('1d', '1wk', '1mo')
            currency: Para birimi (Varsayılan: 'TRY')

        Returns:
            Geçmiş OHLCV bar serisi ve meta veriler.
        """
        if not symbol or not isinstance(symbol, str):
            raise ValueError("symbol parametresi boş olamaz.")
        params: Dict[str, Any] = {}
        if days is not None:
            params["days"] = days
        if range_ is not None:
            params["range"] = range_
        if interval is not None:
            params["interval"] = interval
        if currency is not None:
            params["currency"] = currency
        return self._get(f"/stocks/{symbol.strip().upper()}/history", params=params if params else None)

    def get_eod(self, date: Optional[str] = None) -> Dict[str, Any]:
        """
        Tüm BIST hisselerinin toplu gün sonu (EOD) OHLCV verilerini döner.
        Tek bir istekle 560+ hisse çekilir ve kotanızdan yalnız 1 kredi düşer.

        Args:
            date: İsteğe bağlı geçmiş tarih ('YYYY-MM-DD'). Belirtilmezse en son tamamlanan seans verisi döner.

        Returns:
            Tüm BIST hisselerinin gün sonu kapanış, OHLC ve hacim listesi.
        """
        params: Dict[str, Any] = {}
        if date and isinstance(date, str) and date.strip():
            params["date"] = date.strip()
        return self._get("/stocks/eod", params=params if params else None)

