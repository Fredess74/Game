## 2026-02-14 - Contextual Labels for Vector Inputs
**Learning:** In 3D editor panels, multi-part inputs (like Vector3 for Position/Rotation/Scale) often use single-letter visual labels (X, Y, Z). This is confusing for screen reader users who hear "X edit text", "Y edit text" without knowing *which* property (Position? Scale?) it belongs to.
**Action:** When creating reusable `Vector3Input` or similar components, always accept a parent label and construct full accessible names (e.g., `aria-label="Position X"`) for the child inputs, while keeping the visual label minimal.
