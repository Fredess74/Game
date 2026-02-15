from playwright.sync_api import Page, expect, sync_playwright

def test_a11y_labels(page: Page):
    # 1. Arrange: Go to the app.
    page.goto("http://localhost:5173")

    # Wait for app to load
    page.wait_for_selector("canvas", state="visible")

    # 2. Add an actor (Box)
    # Find "Props" tab.
    # Note: AssetLibrary might be hidden on small screens but viewport is 1280x720 so it should be visible.
    page.get_by_role("button", name="Props").click()

    # Click "Box" card to add it.
    page.get_by_role("button", name="Box").click()

    # 3. Select the actor from Timeline
    # The timeline item has class "truncate" inside a container.
    # Let's find the element in the timeline.
    # The timeline is the bottom panel.
    # We can search for "Box" text that is NOT the button we just clicked.
    # Or just use the last one, as the timeline updates.

    # Wait for the timeline to update
    page.wait_for_timeout(500)

    # Click the timeline item. It's a div with text "Box".
    # We can target it by finding the timeline container first if needed.
    # But usually the timeline item is the only other place "Box" appears besides the add button.
    # Let's try locating by text and filtering out the button.

    box_elements = page.get_by_text("Box", exact=True).all()
    # One is the button label, one is the timeline item.
    # The button label is inside a button.

    # Let's find the one that is NOT inside a button (or rather, the timeline item acts as a button but has no role).
    # Easier: Use the class name from Timeline.tsx: "h-8 px-4 flex items-center ..."
    # Or just click the last one.

    page.get_by_text("Box", exact=True).last.click()

    # 4. Verify Properties Panel Accessibility

    # Verify "Hide Box" button exists (aria-label).
    # Since we added "Box", its name is likely "Box" (first one) or "Prop_1" depending on logic.
    # AssetLibrary: handleAddPrimitive('box') -> name: "Box".
    # So "Hide Box" should be correct.

    hide_btn = page.get_by_label("Hide Box")
    expect(hide_btn).to_be_visible()

    # Verify "Delete Box" button exists.
    delete_btn = page.get_by_label("Delete Box")
    expect(delete_btn).to_be_visible()

    # Verify Inputs have labels.
    # "Position X", "Position Y", "Position Z"
    # Note: These are created by our new accessible NumberInput.
    expect(page.get_by_label("Position X")).to_be_visible()
    expect(page.get_by_label("Position Y")).to_be_visible()
    expect(page.get_by_label("Position Z")).to_be_visible()

    expect(page.get_by_label("Rotation X")).to_be_visible()

    expect(page.get_by_label("Scale X")).to_be_visible()

    # Verify Collapsible Section
    # "Transform" button should have aria-expanded
    transform_btn = page.get_by_role("button", name="Transform")
    expect(transform_btn).to_have_attribute("aria-expanded", "true")

    # Verify Color input
    # PrimitiveRenderer uses properties.color.
    # So "Properties" section should be visible.
    expect(page.get_by_label("Color")).to_be_visible()

    # Verify Roughness/Metalness
    expect(page.get_by_label("Roughness")).to_be_visible()
    expect(page.get_by_label("Metalness")).to_be_visible()

    # 5. Screenshot
    page.screenshot(path="/home/jules/verification/properties_a11y.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a larger viewport to ensure panels are open
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        try:
            test_a11y_labels(page)
            print("Verification Passed!")
        except Exception as e:
            print(f"Verification Failed: {e}")
            page.screenshot(path="/home/jules/verification/failure.png")
            raise e
        finally:
            browser.close()
