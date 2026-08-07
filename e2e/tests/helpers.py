def assert_url_equals(page, url):
    assert page.url == url

def open_routes_page(page, site_base_url, language):
    page.goto(site_base_url[language] + "routes")
    page.wait_for_load_state("networkidle")
