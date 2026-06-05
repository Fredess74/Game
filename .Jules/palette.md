## 2024-06-05 - Match local color conventions for focus rings
**Learning:** While the project has a global Tailwind theme (e.g. `--color-editor-accent`), some components like `Timeline.tsx` use hardcoded hex values (like `#4ade80`). Using the theme variable (`ring-editor-accent`) creates visual inconsistencies if the component doesn't already use it.
**Action:** When adding standard focus styles (`focus-visible:ring-2`), always inspect the specific component's styling first and use arbitrary values (e.g., `focus-visible:ring-[#4ade80]`) if the component relies on hardcoded hex colors.
