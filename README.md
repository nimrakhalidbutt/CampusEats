# CampusEats — website

A responsive HTML / CSS / JavaScript build of the six mobile screens in the
Figma file **CampusEats**, connected into a working ordering flow. No frameworks, no build step.

## Run it

1. **Download the images and icons** (needs internet, takes a few seconds):

   ```bash
   bash download-assets.sh
   ```

2. **Serve the folder** and open it in a browser (a server is recommended so the cart
   survives page changes in every browser):

   ```bash
   python3 -m http.server 8000
   # then open http://localhost:8000
   ```

## Pages and flow

| Figma screen        | File                 | What it does |
|---------------------|----------------------|--------------|
| Homepage            | `index.html`         | Categories, "Popular right now", restaurant card → Browse / Detail |
| Browse page         | `browse.html`        | Filter chips (Popular / Bowls / Burgers / Salads). `+` adds the item with the default side and opens the cart |
| Food Detail         | `food-detail.html`   | `?item=<id>`; choose a side, set quantity, **Add to cart** |
| Order Details       | `cart.html`          | Change quantities (going below 1 removes the line), edit options, live totals |
| Checkout            | `checkout.html`      | Pickup / Delivery toggle, order review, **Confirm order** |
| Order Confirmation  | `confirmation.html`  | Order number, estimated window and pickup code generated from the order; **Back to home** clears the cart |

Flow: `index → browse → food-detail → cart → checkout → confirmation → index`

Tip: open `cart.html?demo=1` to preload the exact two-item order shown in the Figma design.

## Files

```
index.html  browse.html  food-detail.html  cart.html  checkout.html  confirmation.html
css/styles.css          design tokens (Figma variables) + all screen styles
js/app.js               menu data, cart (localStorage), page behaviour
assets/img, assets/icons   filled by download-assets.sh
download-assets.sh      fetches every image / icon from the Figma file
```

## Design fidelity

Colors, type (Bricolage Grotesque, Manrope, Instrument Serif), spacing, radii, borders and the
hard offset shadows are copied from the Figma output; layouts are rebuilt with flexbox instead
of absolute positioning. Each screen keeps its 390px mobile layout on phones; from 768px up the
layout adapts (see **Responsive layout** below) instead of sitting in a narrow centred column.

Fonts load from Google Fonts. The browse/detail copy for items other than the Campus Smash Burger
uses the short descriptions shown on the Browse cards.

## Responsive layout (Lab 07, Task 3)

| Width | Layout |
|-------|--------|
| 375px (phone) | Original single-column mobile-app screens, bottom tab bar, sticky action bars |
| 768px (tablet) | Tab bar becomes pills under the header; two-column grids (home, menu cards, food detail, cart, checkout) |
| 1440px (desktop) | Content column up to 1200px; four menu cards per row, wider hero images, side-by-side cart / checkout / confirmation |

Every page uses `header`, `nav`, `main`, `section` and `footer`, a skip link, visible keyboard
focus and hover states, labelled form controls (`for`/`id`) and descriptive `alt` text.
The home search box now submits to `browse.html?q=…` and filters the menu.
See `TASK3-NOTES.md` for the full change list and how it was tested.

## Things that are not in the Figma file (kept minimal)

- An empty-cart message on `cart.html` (reuses existing tokens and the primary button).
- Tax is computed as 3.78% so the design's $22.50 subtotal gives its $0.85 tax; the service fee is a flat $0.75.
- The Profile tab and the Visa row are not wired (no screens exist for them).
- The Login Screen and Search Overlay frames in the file were not part of the six screens and are not built.

## Assets

The Figma asset links are temporary and expire 7 days after export. If `download-assets.sh`
reports 403/404, export the same layers from Figma (right-click → Copy/Export as SVG or PNG @2x) and
save them under the file names listed in the script.
