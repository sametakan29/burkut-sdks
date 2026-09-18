"""
VIOP (Futures and Options) Resource
"""

from typing import Any, Dict, List
from burkut.resources.base import BaseResource


class ViopResource(BaseResource):
    """Vadeli İşlem ve Opsiyon Piyasası (VİOP) sözleşmeleri."""

    def list(self) -> List[Dict[str, Any]]:
        """
        Tüm aktif VİOP sözleşmelerini listeler.

        Returns:
            VİOP sözleşmeleri listesi.
        """
        res = self._get("/viop")
        return res if isinstance(res, list) else []

    def get(self, symbol: str) -> Dict[str, Any]:
        """
        Belirli bir VİOP sözleşmesinin detaylarını getirir.

        Args:
            symbol: VİOP sözleşme kodu (Örn: 'F_XU0301026')
        """
        if not symbol or not isinstance(symbol, str):
            raise ValueError("symbol parametresi boş olamaz.")
        return self._get(f"/viop/{symbol.strip().upper()}")
