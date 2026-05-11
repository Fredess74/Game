import re
from playwright.sync_api import sync_playwright

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 720})
        page.goto('http://localhost:5173/')
        page.wait_for_timeout(5000)  # wait for React to mount

        # Locate the buttons by checking for their known classes or structure
        # Since Timeline might be deeply nested, we can use an aria-label or title to find them

        skip_back = page.locator('button[aria-label="Skip to start"]')
        assert skip_back.count() == 1, "Skip to start button not found"
        assert skip_back.get_attribute("title") == "Skip to start"

        play_pause = page.locator('button[aria-label="Play"]')
        assert play_pause.count() == 1, "Play button not found"
        assert play_pause.get_attribute("title") == "Play"

        skip_forward = page.locator('button[aria-label="Skip to end"]')
        assert skip_forward.count() == 1, "Skip to end button not found"
        assert skip_forward.get_attribute("title") == "Skip to end"

        # Test keyboard focus visible styles
        # First click somewhere to focus the body, then tab
        page.mouse.click(10, 10)
        page.keyboard.press("Tab") # Should focus maybe something else first, let's just test the class presence

        focus_classes = ["focus-visible:ring-2", "focus-visible:ring-editor-accent", "focus-visible:outline-none"]
        for cls in focus_classes:
            import re
            assert skip_back.evaluate(f"el => el.classList.contains('{cls}')"), f"Missing {cls} on skip_back"
            assert play_pause.evaluate(f"el => el.classList.contains('{cls}')"), f"Missing {cls} on play_pause"
            assert skip_forward.evaluate(f"el => el.classList.contains('{cls}')"), f"Missing {cls} on skip_forward"

        keyframe_btn = page.locator('button', has_text="Keyframe")
        assert keyframe_btn.count() == 1, "Keyframe button not found"
        assert keyframe_btn.get_attribute("title") == "Select an actor to add keyframe", f"Incorrect title: {keyframe_btn.get_attribute('title')}"
        assert keyframe_btn.evaluate("el => el.classList.contains('disabled:cursor-not-allowed')"), "Missing disabled cursor class"

        for cls in focus_classes:
            assert keyframe_btn.evaluate(f"el => el.classList.contains('{cls}')"), f"Missing {cls} on keyframe_btn"

        print("All UI verifications passed successfully.")

        browser.close()

if __name__ == "__main__":
    verify()
