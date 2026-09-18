"""
Government & Corporate Bonds Resource
"""

from typing import Any, Dict, List
from burkut.resources.base import BaseResource


class BondsResource(BaseResource):
    """Tahvil ve Bono verileri."""

    def list(self) -> List[Dict[str, Any]]:
        """
        Tüm tahvil ve bono verilerini listeler.

        Returns:
            Tahvil verileri listesi.
        """
        res = self._get("/bonds")
        return res if isinstance(res, list) else []

    def get(self, symbol: str) -> Dict[str, Any]:
        """
        Belirli bir tahvilin detaylarını getirir.

        Args:
            symbol: Tahvil kodu
        """
        if not symbol or not isinstance(symbol, str):
            raise ValueError("symbol parametresi boş olamaz.")
        return self._get(f"/bonds/{symbol.strip().upper()}")
