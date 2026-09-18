"""
Forex (Currency Rates) Resource
"""

from typing import Any, Dict, List
from burkut.resources.base import BaseResource


class ForexResource(BaseResource):
    """Canlı döviz kurları (USDTRY, EURTRY, GBPTRY vb.)."""

    def list(self) -> List[Dict[str, Any]]:
        """
        Tüm döviz kurlarını listeler.

        Returns:
            Döviz kurları listesi.
        """
        res = self._get("/forex")
        return res if isinstance(res, list) else []

    def get(self, symbol: str) -> Dict[str, Any]:
        """
        Belirli bir döviz kurunun verilerini getirir.

        Args:
            symbol: Döviz çifti kodu (Örn: 'USDTRY', 'EURTRY', 'GBPTRY')
        """
        if not symbol or not isinstance(symbol, str):
            raise ValueError("symbol parametresi boş olamaz.")
        return self._get(f"/forex/{symbol.strip().upper()}")
