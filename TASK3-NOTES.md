# Lab 07 · Task 3 — what changed

## 1. Responsive design (375 / 768 / 1440)
- Mobile-first: base CSS is the original 375px layout; `@media (min-width: 768px)` and `(min-width: 1100px)` add tablet and desktop.
- Removed the 430px centred shell. Content now fills a column up to 1200px (backgrounds full-bleed).
- Tablet: 2-column grids (home, menu cards, food detail, cart, checkout). Desktop: 4 food cards per row, bigger heroes, 2-column cart/checkout/confirmation.
- Bottom tab bar → pill tabs under the header on tablet/desktop. Sticky bars become normal content there.
- No horizontal overflow: tested at 320–2560px on all six pages.

## 2. Semantics
- `header`, `nav`, `main`, `section`, `footer` on every page; one `h1` per page; skip link.
- Absolute positioning replaced with grid/flex stacking (heroes, titles, badges, add button, confetti). Only `sticky` bars and screen-reader-only text remain.
- Native `button` for actions (Add to cart, Confirm order), `a` for navigation, real `input[type=radio]` (restyled, not hidden) in a `fieldset`, real search `input`.
- Lists use `ul`/`ol`; checkout steps are an `ol`; inline styles removed.

## 3. HCI / accessibility
- Hover + `:focus-visible` states on every link, button, chip, card, radio and input; pressed feedback on buttons; reduced-motion respected.
- Every input has a `label for` + matching `id` (search box, side radios).
- Descriptive `alt` for food/restaurant photos; decorative icons use `alt=""`; icon-only buttons have `aria-label`s; `aria-pressed` on filter chips and delivery toggle; `aria-current` on nav/steps.
- Small contrast fixes: muted text `#667571`→`#5e6d69`, brand text on tinted pills uses `--tone-4`, price label opacity removed.

## 4. Testing
Playwright + Chromium at 375, 768, 1440 on all six pages: no overflow, axe-core (WCAG 2.x A/AA + best-practice) 0 violations, full order flow passes, every Tab stop shows a focus ring, hover changes verified.

## JS changes (all additive)
Alt text data, `li` markup for cards/cart lines, `?q=` search filter on Browse, `aria-pressed`, richer aria-labels. Cart, totals, edit-options, checkout and confirmation logic untouched.
