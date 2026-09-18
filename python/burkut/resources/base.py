"""
Base Resource Class for Burkut SDK
"""

from typing import TYPE_CHECKING, Any, Dict, Optional

if TYPE_CHECKING:
    from burkut.client import BurkutClient


class BaseResource:
    """Alt veri kaynağı için temel sınıf."""

    def __init__(self, client: "BurkutClient"):
        self._client = client

    def _get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Any:
        return self._client.request("GET", endpoint, params=params)
