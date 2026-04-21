## 2026-04-21 - File Upload Button Accessibility
**Learning:** Standard `<label>` wrappers for hidden `<input type="file">` elements break keyboard accessibility in this app's patterns because labels cannot receive keyboard focus directly without extra hacking.
**Action:** Always implement custom file uploads using a visible, focusable `<button>` element that triggers the hidden `<input>` via a React `useRef()` proxy pattern.
