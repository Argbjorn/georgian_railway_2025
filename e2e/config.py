import os

# Override with E2E_BASE_URL to run against a local `hugo server`, e.g.
# E2E_BASE_URL=http://localhost:1313/
_host = os.environ.get("E2E_BASE_URL", "https://georailway.com/")
if not _host.endswith("/"):
    _host += "/"

BASE_URL = {"en": _host,
            "ru": _host + "ru/",
            "ka": _host + "ka/"}

LANGUAGES = ["en", "ru", "ka"]

DESKTOP_VIEWPORT = {"width": 1920, "height": 1080}

MOBILE_DEVICE = "iPhone 15"
