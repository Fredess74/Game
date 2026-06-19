## 2024-11-20 - [Playwright verification of Tailwind Arbitrary values]
**Learning:** When using Playwright Python with `re.compile()` to assert Tailwind arbitrary value classes containing brackets (e.g., `focus-visible:ring-[#4ade80]`), the brackets must be double-escaped in the raw string (e.g., `r'focus-visible:ring-\[\#4ade80\]'`) to avoid assertion failures.
**Action:** Always ensure proper escape sequences when matching complex, bracketed Tailwind utility classes via regular expressions in Playwright tests.
