## 2026-05-06 - File Upload Accessibility via ref
**Learning:** The `<label>` with a nested hidden `<input type="file">` pattern breaks keyboard accessibility because the hidden input is removed from the tab sequence, and the label cannot receive native focus. Attempting to make the label focusable often causes recursive click events.
**Action:** Use a visible `<button>` and a sibling `<input type="file" className="hidden">`. Access the hidden input via a React `useRef` and call `ref.current.click()` in the button's `onClick` handler to ensure both screen reader and keyboard accessibility.
