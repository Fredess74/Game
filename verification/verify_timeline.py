from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 720})
    page = context.new_page()

    print("Navigating to app...")
    page.goto("http://localhost:5173/")

    # Wait for the timeline to be visible
    page.wait_for_selector("text=0.00s")

    print("Checking for aria-labels...")
    # Verify the buttons exist with the correct labels
    skip_back = page.get_by_label("Skip to start")
    play_pause = page.get_by_label("Play")
    skip_forward = page.get_by_label("Skip to end")

    if skip_back.count() == 1:
        print("✅ Found 'Skip to start' button")
    else:
        print("❌ 'Skip to start' button not found")

    if play_pause.count() == 1:
        print("✅ Found 'Play' button")
    else:
        print("❌ 'Play' button not found")

    if skip_forward.count() == 1:
        print("✅ Found 'Skip to end' button")
    else:
        print("❌ 'Skip to end' button not found")

    # Verify tooltips (title attribute)
    print("Checking title attributes...")
    if skip_back.get_attribute("title") == "Skip to start":
        print("✅ 'Skip to start' title correct")
    else:
        print(f"❌ 'Skip to start' title incorrect: {skip_back.get_attribute('title')}")

    if play_pause.get_attribute("title") == "Play":
        print("✅ 'Play' title correct")
    else:
        print(f"❌ 'Play' title incorrect: {play_pause.get_attribute('title')}")

    if skip_forward.get_attribute("title") == "Skip to end":
        print("✅ 'Skip to end' title correct")
    else:
        print(f"❌ 'Skip to end' title incorrect: {skip_forward.get_attribute('title')}")

    # Focus on the Play button to show the focus ring
    print("Focusing on Play button...")
    play_pause.focus()

    # Take screenshot
    print("Taking screenshot...")
    page.screenshot(path="verification/timeline_accessibility.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
