## 2026-04-02 - Toggle Buttons and Loading States
**Learning:** In this app, toggle switches (like the Editor/Camera view toggle) require `aria-pressed` to strictly define their active state for screen readers, and buttons triggering asynchronous actions (like Export) require `aria-busy='true'` and dynamic `aria-label`s during loading.
**Action:** When implementing or updating toggle buttons, ensure `aria-pressed` is used. When adding asynchronous operations to buttons, implement `aria-busy` and a dynamic `aria-label` to inform assistive technologies of the loading state.
