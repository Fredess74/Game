## 2024-05-24 - Dynamic ARIA labels on Play/Pause toggles
**Learning:** For dynamic toggle buttons like Play/Pause where the icon changes based on state, static ARIA labels are confusing for screen readers. The `aria-label` must dynamically reflect the *action* that will occur if pressed (e.g., "Pause" when it is currently playing), rather than describing the current visual icon.
**Action:** Always implement dynamic `aria-label` and `title` properties on stateful playback controls (e.g., `{isPlaying ? 'Pause' : 'Play'}`).
