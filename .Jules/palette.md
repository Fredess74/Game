## 2026-06-01 - [Timeline Toolbar Accessibility]
**Learning:** Icon-only timeline buttons (Play/Pause, SkipBack, SkipForward) and conditional UI like disabled state Keyframes are easy targets for missed ARIA and title tags. Play/Pause specifically requires an `aria-pressed` attribute for screen readers to properly communicate its dynamic toggle state.
**Action:** Add comprehensive accessibilty traits (aria-labels, titles, dynamic properties where needed) to generic generic toolbars, especially custom ones built without headless UI libraries.
