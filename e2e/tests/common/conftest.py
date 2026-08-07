import pytest
from config import DESKTOP_VIEWPORT, MOBILE_DEVICE

DEVICES = ["mobile", "desktop"]

@pytest.fixture(scope="session")
def browser_type_launch_args(browser_type_launch_args, browser_name):
    # Firefox's headless mode refuses to create a WebGL context at all
    # (FEATURE_FAILURE_WEBGL_EXHAUSTED_DRIVERS), which stops the maplibre
    # map from ever rendering. Running headed under Xvfb (see CI workflow)
    # gives it a real GLX surface to fall back to software rendering.
    if browser_name == "firefox":
        return {
            **browser_type_launch_args,
            "headless": False,
        }
    return browser_type_launch_args

@pytest.fixture(scope="session", params=DEVICES, ids=DEVICES)
def device_type(request):
    return request.param

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args, playwright, device_type):
    if device_type == "mobile":
        return {
            **browser_context_args,
            **playwright.devices[MOBILE_DEVICE],
        }
    return {
        **browser_context_args,
        "viewport": DESKTOP_VIEWPORT,
    }

# pytest hook to deselect unsupported test cases for mobile Firefox
def pytest_collection_modifyitems(config, items):
    selected, deselected = [], []
    for item in items:
        callspec = getattr(item, "callspec", None)
        is_unsupported = (
            callspec
            and callspec.params.get("device_type") == "mobile"
            and callspec.params.get("browser_name") == "firefox"
        )
        (deselected if is_unsupported else selected).append(item)
    if deselected:
        config.hook.pytest_deselected(items=deselected)
        items[:] = selected
