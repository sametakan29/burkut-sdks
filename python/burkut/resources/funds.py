"""
Investment Funds (TEFAS) Resource
"""

from typing import Any, Dict, List
from burkut.resources.base import BaseResource


class FundsResource(BaseResource):
    """Yatırım Fonları (TEFAS) verileri."""

    def list(self) -> List[Dict[str, Any]]:
        """
        Tüm yatırım fonlarını listeler.

        Returns:
            Yatırım fonları listesi.
        """
        res = self._get("/funds")
        return res if isinstance(res, list) else []

    def get(self, symbol: str) -> Dict[str, Any]:
        """
        Belirli bir yatırım fonunun detaylarını getirir.

        Args:
            symbol: Fon kodu (Örn: 'TCD', 'AFT', 'MAC')
        """
        if not symbol or not isinstance(symbol, str):
            raise ValueError("symbol parametresi boş olamaz.")
        return self._get(f"/funds/{symbol.strip().upper()}")
