# theaiinsurancegroup

Marketing site for The AI Insurance Group, a licensed insurance agency. Vite +
React, one `index.html` serving every route, deployed on Vercel. Tests are a
single script: `node test/check-lead-route.mjs`.

Because the agency is licensed, a lot of the copy on this site is **regulated**:
a sentence that overstates what a policy does, or a licence number in the wrong
place, is a compliance problem rather than a typo. The rule below exists for
that copy specifically.

---

## Mutation-check every test that pins regulated copy

**Before committing a test that guards regulated copy: change the guarded text,
run the test, confirm it fails, then restore the text.** A test that cannot fail
is worse than no test, because it reads as protection.

```
1. Edit the source string so the guard should trip
2. node test/check-lead-route.mjs        -> the assertion MUST fail
3. Restore the string (git checkout, or a saved copy)
4. node test/check-lead-route.mjs        -> back to green
5. git status                            -> confirm nothing was left mutated
```

Note in the commit message that the check was done and what was mutated.

### Why this rule is here

Four assertions in this suite were green against something other than the thing
they guarded. Every one was written in good faith and every one would have gone
on passing while the copy it "protected" drifted:

- An absence check for the rejected phrase `scans 100+ carriers` matched the
  **JSX comment that quotes that phrase in order to ban it**, not the copy.
- A check on the `96/91/88` sample percentages sliced the file from
  `function SamplePanel()`, but `SAMPLE_ROWS` is declared **above** it, so the
  slice excluded exactly the literals being pinned.
- A check that the old positioning was gone from the page description matched
  the **HTML comment explaining what the old wording had been**.
- A sitemap check for excluded paths matched the **XML comment naming them**.

The pattern is always the same: the test matched a whole file, and the file also
contained prose about the string. Two defences, use both:

- **Assert on the value, not the file.** Parse the tag, import the constant,
  slice the exact region. `shell.includes(...)` over a whole document is how
  comments get matched.
- **Strip comments before any absence check.** `test/check-lead-route.mjs` has a
  `codeOnly()` helper: block comments first (JSX `{/* … */}` middle lines start
  with ordinary words and survive a line-based filter), then whole-line `//`
  only, so `https://` inside a string literal survives.

### What counts as regulated copy

| What | Where |
| --- | --- |
| NJ Producer Licence No. 3004245927 | `src/lead/claims.js`, `src/App.jsx` (footer, disclosures), `src/contact.js`, `src/home.jsx` |
| TCPA consent, documents consent | `TCPA_TEXT`, `DOCS_TEXT` in `src/lead/LeadForm.jsx` |
| Paid landing page claims | `src/lead/claims.js` — every insurance-substantive sentence, approved individually |
| Hero paragraph, "screens" wording | `src/home.jsx` — **"screens the carriers that write your kind of risk"**. Screening is what actually happens and is what can be substantiated. `scans 100+ carriers` is rejected. |
| SAMPLE label and the sample panel | `src/home.jsx` — the chip, and the panel staying static. The gap, carrier names and percentages are illustrative; animating them would make invented numbers read as live output |
| Blog author byline | `AUTHOR_BIO` in `src/contact.js`, matching the `blog_posts.author_bio` default (migration 13, `ai-policy-audit-tool`) |
| Sal's About biography | `ABOUT_BIO` in `src/App.jsx` — his own words, approved verbatim |
| Financial services disclosure | `src/App.jsx` Disclosures panel — no securities licences are listed by number |

---

## Other standing rules

- **No guessing on regulated language.** If a sentence asserts something about
  insurance and you cannot source it, do not write it — raise it instead.
- **Strings duplicated across repositories** (the byline, the portal consent
  text) have no build-time link. A test pins each one byte for byte; if you
  change one copy, change the other and the test.
- **Two places set page metadata.** `index.html` is the shell and the non-JS
  fallback; `src/meta.js` overwrites it per route on render. Editing only the
  shell looks right in view-source and wrong in the browser.
- **Confirm a deploy by bundle hash**, not by HTTP status. Vercel's building
  placeholder answers 200, and the SPA rewrite answers 200 with `index.html` for
  files that do not exist yet.
- **Use the Edit tool or `String.raw` for anything with backslashes.** Regexes
  passed through heredocs and `node -e` have been silently destroyed repeatedly,
  each time producing a pattern that matches nothing.
