"""
KAP (Kamuyu Aydınlatma Platformu) Notifications Resource
"""

from typing import Any, Dict, Optional
from burkut.resources.base import BaseResource


class KAPResource(BaseResource):
    """Kamuyu Aydınlatma Platformu (KAP) bildirimleri."""

    def list(
        self,
        symbol: Optional[str] = None,
        page: int = 0,
        size: int = 20,
    ) -> Dict[str, Any]:
        """
        KAP bildirimlerini listeler.

        Args:
            symbol: İsteğe bağlı hisse senedi sembol filtresi (Örn: 'THYAO')
            page: Sayfa indeksi (0'dan başlar)
            size: Sayfa başına bildirim sayısı (varsayılan: 20)

        Returns:
            Sayfalanmış KAP bildirim listesi ve sayfa bilgileri.
        """
        params: Dict[str, Any] = {"page": page, "size": size}
        if symbol and isinstance(symbol, str) and symbol.strip():
            params["symbol"] = symbol.strip().upper()
        res = self._get("/kap", params=params)
        return res if isinstance(res, dict) else {"items": res}

    def get_by_symbol(
        self,
        symbol: str,
        page: int = 0,
        size: int = 20,
    ) -> Dict[str, Any]:
        """
        Belirli bir şirkete ait KAP bildirimlerini getirir.

        Args:
            symbol: Şirket borsa kodu (Örn: 'THYAO', 'GARAN')
            page: Sayfa indeksi
            size: Sayfa başına bildirim adedi

        Returns:
            Şirkete ait bildirim listesi.
        """
        if not symbol or not isinstance(symbol, str):
            raise ValueError("symbol parametresi boş olamaz.")
        params: Dict[str, Any] = {"page": page, "size": size}
        res = self._get(f"/kap/{symbol.strip().upper()}", params=params)
        return res if isinstance(res, dict) else {"items": res}
