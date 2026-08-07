import pytest

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args, playwright):
    iphone15 = playwright.devices['iPhone 15']
    return {
        **browser_context_args,
        **iphone15,
    }
