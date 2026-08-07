import pytest

from config import BASE_URL

@pytest.fixture(scope="session", autouse=True)
def site_base_url():
    return BASE_URL
