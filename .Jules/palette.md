## 2024-04-14 - Improve Timeline Toolbar Accessibility
**Learning:** Icon-only buttons often lack accessibility for screen readers and tooltips for visual users. Furthermore, disabled buttons without explanation cause user confusion.
**Action:** Always add `aria-label` and `title` to icon-only buttons. For disabled buttons, provide a dynamic `title` attribute explaining the *reason* they are disabled, and append `disabled:cursor-not-allowed` for clear visual feedback.
