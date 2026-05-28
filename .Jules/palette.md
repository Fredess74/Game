
## 2024-05-24 - Interactive Timeline Controls Accessibility
**Learning:** Native `title` attributes act as effective, low-effort tooltips for icon-only toolbar buttons (like Play/Pause and Keyframe additions) while `aria-label` provides the required context for assistive tech. Combining these with `focus-visible` ensures strong keyboard navigation support. Dynamic disabled states (e.g. "Add Keyframe" without a selection) benefit greatly from a dynamic `title` that explains *why* the action is unavailable.
**Action:** Always pair `aria-label` with `title` for icon-only action buttons. Use dynamic `title` attributes on disabled action buttons to explain the blocking condition, and always include `.focus-visible:ring-2 .focus-visible:ring-editor-accent` for consistent focus indicators.
