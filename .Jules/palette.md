## 2026-03-15 - File Upload Accessibility Pattern
**Learning:** Wrapping a hidden file input in a `<label>` element breaks keyboard accessibility as the label is not inherently focusable via Tab navigation.
**Action:** When implementing file upload buttons, always use a visually styled `<button>` element that triggers the hidden `<input type='file'>` using a React `ref`. This ensures the upload action is reachable and operable via keyboard.
