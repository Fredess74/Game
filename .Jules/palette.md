# Palette's Journal

## 2025-02-17 - Timeline Accessibility Pattern
**Learning:** Icon-only playback controls (Play/Pause, Skip) are a frequent accessibility gap in media editors. Without dynamic labels, screen readers cannot communicate the current state (Playing vs Paused).
**Action:** Always pair state-toggling icons with dynamic `aria-label` attributes that reflect the *current* action available (e.g., "Pause" when playing, "Play" when paused).
