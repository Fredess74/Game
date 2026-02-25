from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 720})
    page.goto("http://localhost:5173")

    # Wait for the timeline to be visible (using text that appears in the timeline)
    page.wait_for_selector("text=/ 60s")

    # Verify Skip Back button
    skip_back = page.locator("button[aria-label='Skip to Start']")
    if skip_back.count() > 0:
        print("✅ Skip Back button found with correct aria-label")
    else:
        print("❌ Skip Back button NOT found")

    # Verify Play/Pause button (initially Play)
    play_btn = page.locator("button[aria-label='Play']")
    if play_btn.count() > 0:
        print("✅ Play button found with correct aria-label")
    else:
        print("❌ Play button NOT found")

    # Verify Skip Forward button
    skip_fwd = page.locator("button[aria-label='Skip to End']")
    if skip_fwd.count() > 0:
        print("✅ Skip Forward button found with correct aria-label")
    else:
        print("❌ Skip Forward button NOT found")

    # Verify Add Keyframe button
    keyframe_btn = page.locator("button[aria-label='Add Keyframe']")
    if keyframe_btn.count() > 0:
        print("✅ Add Keyframe button found with correct aria-label")
    else:
        print("❌ Add Keyframe button NOT found")

    # Take a screenshot
    page.screenshot(path="verification/timeline_accessibility.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
