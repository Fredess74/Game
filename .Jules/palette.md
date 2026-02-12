## 2025-02-14 - Improve accessibility of Properties Panel inputs
**Learning:** Zod v4.x (uncommon version) drops `ZodError.errors` alias in favor of `ZodError.issues`.
**Action:** When working with Zod, check version and prefer `.issues` for error handling if `.errors` is missing.
**Learning:** Using `React.useId()` with `<label htmlFor={id}>` creates robust accessible inputs without requiring unique prop IDs manually.
**Action:** Default to `useId` for form inputs in React components.
