## 2025-01-31 - Header Accessibility

**Learning:** Using a `<label>` as a clickable element for a hidden file input often breaks keyboard accessibility (focus states, Enter/Space activation).
**Action:** Always refactor file upload triggers to a semantic `<button>` that programmatically clicks a hidden `<input type="file" />` via `useRef`, ensuring full keyboard support and proper focus management.
