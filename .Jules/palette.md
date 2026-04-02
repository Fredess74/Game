# Palette Journal
## 2024-04-02 - Icon-Only Buttons in the Timeline Toolbar
**Learning:** Icon-only buttons without labels (like Play/Pause/Skip) are completely inaccessible to screen readers. Disabled buttons without an explanation can lead to user confusion.
**Action:** Always add `aria-label` and `title` to icon-only buttons. For disabled buttons, use `title` to explain the reason it is disabled, and add visual feedback such as `disabled:cursor-not-allowed`.
