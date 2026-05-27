
## 2026-05-27 - Timeline Control Accessibility
**Learning:** Interactive state controls like Play/Pause require dynamic aria-labels, titles, and aria-pressed attributes to accurately convey their current state to assistive technologies, rather than static labels.
**Action:** When implementing toggle buttons or playback controls, always tie their a11y attributes directly to the underlying state variable (e.g., isPlaying) to ensure screen readers provide accurate, context-aware feedback.
