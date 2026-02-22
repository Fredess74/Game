## 2025-05-23 - File Upload Accessibility
**Learning:** Using `<label>` to wrap a hidden file input is a common pattern but fails keyboard accessibility because `label` elements are not focusable by default.
**Action:** Always use a visible `<button>` that triggers the hidden input via `ref.current.click()`. This ensures the action is in the tab order and can be activated with Enter/Space.
