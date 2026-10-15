"""
Technical Indicators Resource
"""

from typing import Any, Dict, Optional
from burkut.resources.base import BaseResource


class IndicatorsResource(BaseResource):
    """Borsa İstanbul (BIST) hisse senetleri için teknik analiz göstergeleri (RSI, MACD, Bollinger)."""

    def get_summary(self, symbol: str) -> Dict[str, Any]:
        """
        Belirtilen BIST hissesi için tüm teknik göstergelerin (RSI, MACD, Bollinger) özetini getirir.

        Args:
            symbol: Hisse senedi sembol kodu (Örn: 'THYAO', 'GARAN')

        Returns:
            Teknik gösterge sonuçlarını içeren sözlük.
        """
        if not symbol or not isinstance(symbol, str):
            raise ValueError("symbol parametresi boş olamaz.")
        return self._get(f"/indicators/{symbol.strip().upper()}")

    def get_rsi(self, symbol: str, period: Optional[int] = None) -> Dict[str, Any]:
        """
        Belirtilen BIST hissesi için Relative Strength Index (RSI) değerini döner.

        Args:
            symbol: Hisse senedi sembol kodu (Örn: 'THYAO')
            period: RSI periyodu (Varsayılan: 14)

        Returns:
            RSI değeri ve aşırı alım/satım sinyali.
        """
        if not symbol or not isinstance(symbol, str):
            raise ValueError("symbol parametresi boş olamaz.")
        params = {}
        if period is not None:
            params["period"] = period
        return self._get(f"/indicators/{symbol.strip().upper()}/rsi", params=params if params else None)

    def get_macd(
        self,
        symbol: str,
        fast: Optional[int] = None,
        slow: Optional[int] = None,
        signal: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Belirtilen BIST hissesi için MACD göstergesi değerlerini döner.

        Args:
            symbol: Hisse senedi sembol kodu (Örn: 'THYAO')
            fast: Hızlı EMA periyodu (Varsayılan: 12)
            slow: Yavaş EMA periyodu (Varsayılan: 26)
            signal: Sinyal çizgisi periyodu (Varsayılan: 9)

        Returns:
            MACD çizgisi, sinyal çizgisi, histogram ve trend yorumu.
        """
        if not symbol or not isinstance(symbol, str):
            raise ValueError("symbol parametresi boş olamaz.")
        params = {}
        if fast is not None:
            params["fast"] = fast
        if slow is not None:
            params["slow"] = slow
        if signal is not None:
            params["signal"] = signal
        return self._get(f"/indicators/{symbol.strip().upper()}/macd", params=params if params else None)

    def get_bollinger(
        self,
        symbol: str,
        period: Optional[int] = None,
        std_dev: Optional[float] = None,
    ) -> Dict[str, Any]:
        """
        Belirtilen BIST hissesi için Bollinger Bantları değerlerini döner.

        Args:
            symbol: Hisse senedi sembol kodu (Örn: 'THYAO')
            period: Hareketli ortalama periyodu (Varsayılan: 20)
            std_dev: Standart sapma çarpanı (Varsayılan: 2.0)

        Returns:
            Üst, orta, alt bantlar, bant genişliği ve %B konumu.
        """
        if not symbol or not isinstance(symbol, str):
            raise ValueError("symbol parametresi boş olamaz.")
        params = {}
        if period is not None:
            params["period"] = period
        if std_dev is not None:
            params["stdDev"] = std_dev
        return self._get(f"/indicators/{symbol.strip().upper()}/bollinger", params=params if params else None)
