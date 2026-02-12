from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    # Set viewport size to ensure elements are visible
    context = browser.new_context(viewport={"width": 1280, "height": 720})
    page = context.new_page()

    print("Navigating to app...")
    page.goto("http://localhost:5173/")

    # Wait for the app to load - wait for the SAVE button which is critical for our test
    try:
        # Use a more specific selector if possible, or just text
        save_btn = page.locator("button:has-text('SAVE')")
        save_btn.wait_for(state="visible", timeout=10000)
        print("SAVE button is visible.")
    except Exception as e:
        print(f"Error waiting for SAVE button: {e}")
        page.screenshot(path="verification/error.png")
        print("Error screenshot saved to verification/error.png")
        raise e

    # Verify SAVE functionality (check if download is triggered)
    print("Testing SAVE functionality...")
    with page.expect_download() as download_info:
        page.click("button:has-text('SAVE')")

    download = download_info.value
    print(f"Download triggered: {download.suggested_filename}")

    if "project_" in download.suggested_filename and ".json" in download.suggested_filename:
        print("SAVE functionality verified successfully.")
    else:
        print("SAVE functionality failed: Unexpected filename.")

    # Verify EXPORT MODAL opens
    print("Testing EXPORT MODAL...")
    page.click("button:has-text('EXPORT MOVIE')")

    # Wait for modal to appear
    page.wait_for_selector("text=Export Settings")

    # Take screenshot
    print("Taking screenshot of Export Modal...")
    page.screenshot(path="verification/export_modal.png")
    print("Screenshot saved to verification/export_modal.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
