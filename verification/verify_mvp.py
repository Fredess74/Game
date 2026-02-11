
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('http://localhost:5173')
        # Wait for the scene to load (give it a few seconds for canvas)
        page.wait_for_timeout(3000)

        # Take a screenshot
        page.screenshot(path='verification/mvp_screenshot.png')
        browser.close()

if __name__ == '__main__':
    run()
