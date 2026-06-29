## 2024-05-24 - Timeline Toolbar Accessibility
**Learning:** In a highly interactive custom timeline component, providing clear custom tooltips (e.g., "Select an actor to add a keyframe") on disabled state buttons provides significantly better UX guidance than just greying out the button, especially since standard HTML disables hover events.
**Action:** Always include a dynamic `title` attribute on disabled buttons that explains *why* it's disabled or *how* to enable it.
