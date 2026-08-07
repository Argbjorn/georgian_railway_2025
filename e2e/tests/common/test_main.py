import pytest
from config import LANGUAGES
from pages.header import switch_language
from tests.helpers import assert_url_equals
from playwright.sync_api import expect

def test_main_page_opens_and_has_correct_title(page, site_base_url):
    page.goto(site_base_url["en"])
    page.wait_for_load_state("networkidle")
    assert page.title() == "Georgian Railway Map"

@pytest.mark.parametrize("language", LANGUAGES)
def test_main_page_has_correct_language_and_url(page, site_base_url, language):
    page.goto(site_base_url[language])
    assert page.locator('html').get_attribute('lang') == language
    assert_url_equals(page, site_base_url[language])

def test_main_page_switches_language(page, site_base_url):
    page.goto(site_base_url["en"])
    page.wait_for_load_state("networkidle")
    switch_language(page, "ru")
    assert_url_equals(page, site_base_url["ru"])

def test_main_page_has_attribution(page, site_base_url):
    page.goto(site_base_url["en"])
    page.wait_for_load_state("networkidle")
    expect(page.locator(".maplibregl-ctrl-attrib-inner")).to_be_visible(timeout=10000)
