## 2024-03-20 - Icon-Only Controls & Disabled States
**Learning:** Icon-only playback controls without tooltips or ARIA labels make the interface inaccessible, and disabled buttons without explanations leave users confused about why an action is unavailable.
**Action:** Always provide `aria-label` and `title` attributes for icon-only buttons, add `focus-visible` states for keyboard navigation, and include dynamic `title` texts on disabled buttons to explain the missing requirements.
