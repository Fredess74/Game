## 2024-03-21 - Timeline Playback Accessibility
**Learning:** Icon-only playback controls and state-dependent buttons (like Add Keyframe) are common in creative tools but often lack proper screen reader labels and clear dynamic explanations for disabled states.
**Action:** Always add `aria-label` and `title` to icon-only buttons. For buttons that can be disabled based on state (like selection), make the `title` dynamic to explain *why* it's disabled, and add `disabled:cursor-not-allowed` for clear visual feedback.
