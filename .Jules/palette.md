## 2024-05-24 - Accessibility improvements for icon-only buttons and disabled states
**Learning:** Icon-only buttons (like play/pause and skip controls) require both `aria-label` for screen readers and `title` for visual tooltips to ensure usability. Additionally, disabled buttons benefit greatly from dynamic `title` attributes explaining why they are disabled, coupled with `disabled:cursor-not-allowed` for explicit visual feedback.
**Action:** Always include both `aria-label` and `title` on icon-only buttons, and use dynamic tooltips on disabled interactive elements.
