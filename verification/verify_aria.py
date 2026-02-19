from playwright.sync_api import sync_playwright, expect
import time

def verify_timeline_accessibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 720})

        print("Navigating to app...")
        page.goto("http://localhost:5173")

        # Wait for the timeline to appear
        # The timeline has text "0.00s / 60s" (default)
        try:
            page.wait_for_selector(".font-mono", timeout=10000)
        except Exception as e:
            print("Could not find font-mono element. Dumping content:")
            print(page.content())
            raise e

        print("Timeline loaded.")

        # Take a screenshot of the initial state
        page.screenshot(path="verification/before_fix.png")

        # Find the timeline toolbar
        toolbar = page.locator(".h-10.border-b.border-gray-700.flex.items-center.justify-between")

        # Find all buttons in the toolbar
        buttons = toolbar.locator("button").all()

        print(f"Found {len(buttons)} buttons in timeline toolbar.")

        missing_labels = []
        for i, btn in enumerate(buttons):
            aria_label = btn.get_attribute("aria-label")
            icon_html = btn.inner_html()
            print(f"Button {i}: aria-label='{aria_label}' content='{icon_html[:20]}...'")
            if not aria_label:
                missing_labels.append(i)

        if missing_labels:
            print(f"FAIL: {len(missing_labels)} buttons are missing aria-label.")
        else:
            print("SUCCESS: All timeline buttons have aria-label.")

        browser.close()

if __name__ == "__main__":
    verify_timeline_accessibility()
