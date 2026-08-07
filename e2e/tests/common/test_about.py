import pytest
from config import LANGUAGES

page_titles = {"en": "About", "ru": "О проекте", "ka": "პროექტის შესახებ"}

@pytest.mark.parametrize("language", LANGUAGES)
def test_about_page_has_correct_h1(page, site_base_url, language):
    page.goto(site_base_url[language] + "about")
    page.wait_for_load_state("networkidle")
    assert page.locator("h1").inner_text() == page_titles[language]
