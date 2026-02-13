from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 720})
    page = context.new_page()

    # Wait for the app to load
    page.goto("http://localhost:5173")
    page.wait_for_selector("text=FREDESS", timeout=10000)

    # Verify the buttons exist by aria-label
    skip_start = page.get_by_label("Skip to start")
    play_pause = page.get_by_label("Play") # Initial state is paused, so label is Play? Or Pause?
    # Wait, if isPlaying is false (default), label is "Play".

    skip_end = page.get_by_label("Skip to end")
    add_keyframe = page.get_by_label("Add position keyframe") # Or "Add position keyframe" based on my change

    # Assertions
    if skip_start.count() == 0:
        print("FAIL: 'Skip to start' button not found")
        browser.close()
        return

    if skip_end.count() == 0:
        print("FAIL: 'Skip to end' button not found")
        browser.close()
        return

    if add_keyframe.count() == 0:
        print("FAIL: 'Add position keyframe' button not found")
        # Try generic just in case
        if page.get_by_label("Add keyframe").count() > 0:
             print("Found 'Add keyframe' instead.")
        else:
             print("FAIL: keyframe button not found")
        browser.close()
        return

    # Check titles
    assert skip_start.get_attribute("title") == "Skip to start"
    assert skip_end.get_attribute("title") == "Skip to end"

    # Focus on the play button to show focus ring in screenshot
    # Check if play button exists (it might be "Pause" if auto-playing?)
    if page.get_by_label("Play").count() > 0:
        play_btn = page.get_by_label("Play")
        assert play_btn.get_attribute("title") == "Play"
        play_btn.focus()
    elif page.get_by_label("Pause").count() > 0:
        play_btn = page.get_by_label("Pause")
        assert play_btn.get_attribute("title") == "Pause"
        play_btn.focus()
    else:
        print("FAIL: Play/Pause button not found")
        browser.close()
        return

    print("SUCCESS: All accessibility attributes found.")

    # Take screenshot of the timeline area
    # The timeline is at the bottom.
    page.screenshot(path="verification_timeline.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
