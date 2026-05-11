## 2024-05-18 - [Timeline Transport Controls Accessibility]
 **Learning:** Icon-only playback controls in custom timeline interfaces often lack semantic meaning for screen readers, and default browser focus rings may be invisible against dark editor themes.
 **Action:** Always ensure custom transport controls (Play, Pause, Skip) pair `aria-label` with `title` for dual accessibility (screen readers and mouse users), and explicitly define high-contrast focus rings (`focus-visible:ring-editor-accent`) to guarantee keyboard navigation visibility.
