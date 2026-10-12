"""
Resources Package
"""

from burkut.resources.bonds import BondsResource
from burkut.resources.forex import ForexResource
from burkut.resources.funds import FundsResource
from burkut.resources.gold import GoldResource
from burkut.resources.kap import KAPResource
from burkut.resources.stocks import StocksResource
from burkut.resources.viop import ViopResource

__all__ = [
    "StocksResource",
    "ForexResource",
    "GoldResource",
    "FundsResource",
    "BondsResource",
    "ViopResource",
    "KAPResource",
]

