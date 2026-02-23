from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a defined viewport
        page = browser.new_page(viewport={'width': 1280, 'height': 720})

        try:
            # Navigate to the app
            page.goto("http://localhost:3000")

            # Wait for the app to load
            page.wait_for_selector("canvas", timeout=10000) # Wait for canvas which implies 3d scene loaded
            page.wait_for_timeout(2000)

            # Find the Play button using the new aria-label
            play_button = page.get_by_label("Play")

            if play_button.count() == 0:
                print("Play button not found with label 'Play'")
                # Fallback to check if it's already playing (Pause)
                play_button = page.get_by_label("Pause")

            if play_button.count() > 0:
                print("Found Play/Pause button")
                # Focus it to see the ring
                play_button.focus()
                page.wait_for_timeout(500)
                page.screenshot(path="verification/timeline_focus.png")
                print("Screenshot taken: verification/timeline_focus.png")
            else:
                print("Play/Pause button NOT found")
                # Take a screenshot anyway to debug
                page.screenshot(path="verification/debug_not_found.png")

            # Also check Skip Back and Skip Forward
            skip_back = page.get_by_label("Skip to start")
            if skip_back.count() > 0:
                print("Found Skip to start button")

            skip_forward = page.get_by_label("Skip to end")
            if skip_forward.count() > 0:
                print("Found Skip to end button")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
