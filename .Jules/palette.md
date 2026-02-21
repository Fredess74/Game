## 2024-05-23 - Timeline Accessibility
**Learning:** Generic 'div' lists can be easily upgraded to accessible lists using role='listbox' and role='option', but require explicit keyboard handling (tabIndex, onKeyDown). Specifically, Space key activation must use e.preventDefault() to avoid page scrolling.
**Action:** Always test Space key interaction on custom interactive elements to ensure no unwanted scrolling.
