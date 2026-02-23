## 2025-02-19 - Icon-only Buttons Accessibility Pattern
**Learning:** This app frequently uses `lucide-react` icons inside buttons without text labels, relying solely on visual cues. This makes key controls (like timeline playback) inaccessible to screen readers and keyboard users.
**Action:** Systematically audit all icon-only buttons for `aria-label` and `title` attributes. Add `focus-visible` rings to ensure keyboard navigability, using the theme's accent color (`--color-editor-accent`).
