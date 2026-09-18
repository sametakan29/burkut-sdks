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
