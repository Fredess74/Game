## 2024-05-18 - Timeline Accessibility
**Learning:** Icon-only media controls (Play/Pause, Skip) are common accessibility traps. While visually obvious to sighted users, they are completely opaque to screen readers if lacking `aria-label`. Similarly, disabled buttons without contextual tooltips leave users guessing why an action is unavailable.
**Action:** Always pair `aria-label` and `title` attributes on icon-only buttons. When disabling a button (like the Keyframe button), conditionally update its `title` to explain the requirement (e.g., "Select an actor to add keyframes").
