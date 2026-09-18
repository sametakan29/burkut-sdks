import json
import unittest
from unittest.mock import MagicMock, patch
import urllib.error

from burkut import (
    AuthenticationError,
    BurkutClient,
    ForbiddenError,
    NotFoundError,
    QuotaExceededError,
    RateLimitError,
    ServerError,
)


class TestBurkutClient(unittest.TestCase):

    def test_init_without_key_raises_error(self):
        with patch.dict("os.environ", {}, clear=True):
            with self.assertRaises(AuthenticationError):
                BurkutClient()

    def test_init_with_key_success(self):
        client = BurkutClient(api_key="bk_live_test_123")
        self.assertEqual(client.api_key, "bk_live_test_123")
        self.assertEqual(client.base_url, "https://burkutportfoy.com/api/public/v1")

    def test_init_with_env_var(self):
        with patch.dict("os.environ", {"BURKUT_API_KEY": "bk_env_key"}):
            client = BurkutClient()
            self.assertEqual(client.api_key, "bk_env_key")

    @patch("urllib.request.urlopen")
    def test_get_stock_success(self, mock_urlopen):
        mock_resp = MagicMock()
        mock_resp.status = 200
        mock_resp.read.return_value = json.dumps({
            "data": {
                "symbol": "THYAO",
                "last_price": 315.5,
                "change_rate": 2.15
            }
        }).encode("utf-8")
        mock_resp.__enter__.return_value = mock_resp
        mock_urlopen.return_value = mock_resp

        client = BurkutClient(api_key="bk_live_test")
        result = client.stocks.get("thyao")

        self.assertEqual(result["symbol"], "THYAO")
        self.assertEqual(result["last_price"], 315.5)

        # Verify request parameters
        req = mock_urlopen.call_args[0][0]
        self.assertEqual(req.get_header("X-api-key"), "bk_live_test")
        self.assertIn("/stocks/THYAO", req.full_url)

    @patch("urllib.request.urlopen")
    def test_list_stocks_with_symbols(self, mock_urlopen):
        mock_resp = MagicMock()
        mock_resp.status = 200
        mock_resp.read.return_value = json.dumps({
            "data": [
                {"symbol": "THYAO", "last_price": 315.5},
                {"symbol": "GARAN", "last_price": 120.0}
            ]
        }).encode("utf-8")
        mock_resp.__enter__.return_value = mock_resp
        mock_urlopen.return_value = mock_resp

        client = BurkutClient(api_key="bk_live_test")
        result = client.stocks.list(symbols=["thyao", "garan"])

        self.assertEqual(len(result), 2)
        req = mock_urlopen.call_args[0][0]
        self.assertIn("symbols=THYAO%2CGARAN", req.full_url)

    @patch("urllib.request.urlopen")
    def test_error_401_authentication_error(self, mock_urlopen):
        fp = MagicMock()
        fp.read.return_value = json.dumps({
            "error": "UNAUTHORIZED",
            "message": "API key is invalid"
        }).encode("utf-8")
        err = urllib.error.HTTPError(
            url="http://test", code=401, msg="Unauthorized", hdrs={}, fp=fp
        )
        mock_urlopen.side_effect = err

        client = BurkutClient(api_key="invalid_key")
        with self.assertRaises(AuthenticationError) as ctx:
            client.stocks.get("THYAO")
        self.assertEqual(ctx.exception.status_code, 401)
        self.assertEqual(ctx.exception.error_code, "UNAUTHORIZED")

    @patch("urllib.request.urlopen")
    def test_error_404_not_found(self, mock_urlopen):
        fp = MagicMock()
        fp.read.return_value = json.dumps({
            "error": "NOT_FOUND",
            "message": "Stock not found"
        }).encode("utf-8")
        err = urllib.error.HTTPError(
            url="http://test", code=404, msg="Not Found", hdrs={}, fp=fp
        )
        mock_urlopen.side_effect = err

        client = BurkutClient(api_key="bk_live_test")
        with self.assertRaises(NotFoundError):
            client.stocks.get("NONEXISTENT")

    @patch("urllib.request.urlopen")
    def test_error_429_quota_exceeded(self, mock_urlopen):
        fp = MagicMock()
        fp.read.return_value = json.dumps({
            "error": "MONTHLY_QUOTA_EXCEEDED",
            "message": "Monthly quota reached"
        }).encode("utf-8")
        err = urllib.error.HTTPError(
            url="http://test", code=429, msg="Too Many Requests", hdrs={}, fp=fp
        )
        mock_urlopen.side_effect = err

        client = BurkutClient(api_key="bk_live_test")
        with self.assertRaises(QuotaExceededError):
            client.forex.list()

    @patch("urllib.request.urlopen")
    def test_error_429_rate_limit(self, mock_urlopen):
        fp = MagicMock()
        fp.read.return_value = json.dumps({
            "error": "RATE_LIMIT_EXCEEDED",
            "message": "Rate limit exceeded"
        }).encode("utf-8")
        hdrs = {"Retry-After": "15"}
        err = urllib.error.HTTPError(
            url="http://test", code=429, msg="Too Many Requests", hdrs=hdrs, fp=fp
        )
        mock_urlopen.side_effect = err

        client = BurkutClient(api_key="bk_live_test")
        with self.assertRaises(RateLimitError) as ctx:
            client.gold.list()
        self.assertEqual(ctx.exception.retry_after, 15)

    @patch("urllib.request.urlopen")
    def test_error_500_server_error(self, mock_urlopen):
        fp = MagicMock()
        fp.read.return_value = b"Internal Server Error"
        err = urllib.error.HTTPError(
            url="http://test", code=500, msg="Internal Server Error", hdrs={}, fp=fp
        )
        mock_urlopen.side_effect = err

        client = BurkutClient(api_key="bk_live_test")
        with self.assertRaises(ServerError):
            client.funds.list()


if __name__ == "__main__":
    unittest.main()
