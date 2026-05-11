
## 2024-05-18 - [Header File Upload Keyboard Accessibility]
**Learning:** In React, wrapping a hidden `<input type="file">` inside a `<label>` (while visually functional) breaks standard keyboard focus patterns because the label itself is not naturally focusable without `tabIndex=0` and custom key event handling.
**Action:** Always implement custom file upload buttons as a true `<button>` element that triggers the hidden input's `click()` method via a `useRef`. Furthermore, remember to reset the input's value (`e.target.value = ''`) inside the `onChange` handler to allow the user to select the exact same file consecutively (a common requirement for iterative JSON config updates).
