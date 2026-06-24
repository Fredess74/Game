import re
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1280, 'height': 720})

        print("Navigating to http://localhost:5173")
        await page.goto("http://localhost:5173")

        # Wait for the app to mount
        await page.wait_for_timeout(3000)

        print("Verifying Skip to start button...")
        skip_start_btn = page.locator('button[aria-label="Skip to start"]')
        await skip_start_btn.wait_for(state="visible")
        assert await skip_start_btn.get_attribute("title") == "Skip to start"

        print("Verifying Play button...")
        play_btn = page.locator('button[aria-label="Play"]')
        await play_btn.wait_for(state="visible")
        assert await play_btn.get_attribute("title") == "Play"

        print("Verifying Skip to end button...")
        skip_end_btn = page.locator('button[aria-label="Skip to end"]')
        await skip_end_btn.wait_for(state="visible")
        assert await skip_end_btn.get_attribute("title") == "Skip to end"

        print("Verifying Keyframe button disabled state...")
        keyframe_btn = page.locator('button:has-text("Keyframe")')
        await keyframe_btn.wait_for(state="visible")

        assert not await keyframe_btn.is_enabled()
        assert await keyframe_btn.get_attribute("title") == "Select an actor to add a keyframe"

        class_list = await keyframe_btn.get_attribute("class")
        assert "disabled:cursor-not-allowed" in class_list
        assert "focus-visible:ring-2" in class_list

        print("Verifying Play/Pause toggle dynamic state...")
        await play_btn.click()
        await page.wait_for_timeout(500) # wait for state update

        # Now it should be a pause button
        pause_btn = page.locator('button[aria-label="Pause"]')
        await pause_btn.wait_for(state="visible")
        assert await pause_btn.get_attribute("title") == "Pause"

        print("All UX improvements verified successfully!")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
