def switch_language(page, language):
    language_text = {"en": "English", "ru": "Русский", "ka": "ქართული"}
    switcher = page.locator(".hextra-language-switcher").first
    options = page.locator(".hextra-language-options").first
    switcher.click()
    options.locator("li").filter(has=page.locator("a", has_text=language_text[language])).click()
