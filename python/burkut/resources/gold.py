"""
Gold and Precious Metals Resource
"""

from typing import Any, Dict, List
from burkut.resources.base import BaseResource


class GoldResource(BaseResource):
    """Altın ve kıymetli maden fiyatları (Gram Altın, Çeyrek Altın, Ons vb.)."""

    def list(self) -> List[Dict[str, Any]]:
        """
        Tüm altın türlerini listeler.

        Returns:
            Altın türleri ve fiyatları listesi.
        """
        res = self._get("/gold")
        return res if isinstance(res, list) else []

    def get(self, symbol: str) -> Dict[str, Any]:
        """
        Belirli bir altın türünün fiyat bilgisini getirir.

        Args:
            symbol: Altın kodu (Örn: 'ALTIN_GRAM', 'ALTIN_CEYREK', 'ONS')
        """
        if not symbol or not isinstance(symbol, str):
            raise ValueError("symbol parametresi boş olamaz.")
        return self._get(f"/gold/{symbol.strip().upper()}")
