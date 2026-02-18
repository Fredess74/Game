from playwright.sync_api import sync_playwright
import time

def verify_search():
    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=True)
        # Use a larger viewport to ensure sidebar is visible
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()

        print("Navigating to app...")
        try:
            page.goto("http://localhost:5173", timeout=30000)
        except Exception as e:
            print(f"Failed to navigate: {e}")
            browser.close()
            return

        # Wait for the app to load
        try:
            page.wait_for_selector("text=Actors", timeout=10000)
        except Exception as e:
            print(f"Failed to load: {e}")
            page.screenshot(path="verification/failed_load.png")
            browser.close()
            return

        print("Testing Search Filter...")
        # Find search input
        search_input = page.get_by_placeholder("Search assets...")
        search_input.fill("Robot")

        # Wait for filter to apply
        time.sleep(1) # React update

        # Take screenshot of filtered results
        page.screenshot(path="verification/search_filtered.png")
        print("Screenshot saved: verification/search_filtered.png")

        print("Testing Empty State...")
        search_input.fill("NonExistentAsset")

        # Wait for empty state
        time.sleep(1)

        # Take screenshot of empty state
        page.screenshot(path="verification/search_empty.png")
        print("Screenshot saved: verification/search_empty.png")

        browser.close()

if __name__ == "__main__":
    verify_search()
