# CampusEats

A responsive food-ordering website for campus dining, built with plain **HTML, CSS and JavaScript**. It is a faithful implementation of the **CampusEats** Figma design: six screens connected into a working order flow, from browsing the menu to a pickup confirmation.

No frameworks, no build step, no dependencies.

## Features

- Six pages that follow the Figma design: Homepage, Browse, Food Detail, Cart, Checkout and Order Confirmation
- Working ordering flow: browse, add to cart, edit quantities, check out, get a pickup code
- Menu filters (Popular, Bowls, Burgers, Salads)
- Item detail with required side selection and quantity picker
- Cart with live subtotal, service fee, tax and total
- Pickup or delivery choice at checkout
- Confirmation page with an order number, estimated time window and pickup code generated from the order
- Cart and last order saved in the browser with `localStorage`
- Mobile-first layout, centered in a column on tablets and desktops

## Pages and flow

```
index → browse → food-detail → cart → checkout → confirmation → index
```

| Screen | File | What it does |
|---|---|---|
| Homepage | `index.html` | Categories, "Popular right now" and the restaurant card |
| Browse | `browse.html` | Filter chips and the menu list. The `+` button adds an item and opens the cart |
| Food Detail | `food-detail.html` | Choose a side, set quantity, add to cart (`?item=<id>`) |
| Cart | `cart.html` | Change quantities, edit options, see totals |
| Checkout | `checkout.html` | Pickup or delivery, payment row, order review, confirm |
| Confirmation | `confirmation.html` | Order number, time window, pickup code |

Tip: open `cart.html?demo=1` to preload the two-item order shown in the Figma design.

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Download the images and icons

The photos and icons come from the Figma file and are not stored in the repo. Run the script once (requires internet):

```bash
bash download-assets.sh
```

This fills `assets/img/` and `assets/icons/`.

> **Note:** the Figma asset links in the script are temporary and expire after 7 days. If a download fails with 403 or 404, export the same images and icons from Figma and save them under the file names listed in `download-assets.sh`. You can then commit them to the repo and skip this step.

### 3. Start a local server

```bash
python3 -m http.server 8000
```

On Windows use `python -m http.server 8000`. Any static server works (VS Code Live Server, `npx serve`, and so on).

### 4. Open the site

Go to <http://localhost:8000>.

## Project structure

```
.
├── index.html
├── browse.html
├── food-detail.html
├── cart.html
├── checkout.html
├── confirmation.html
├── css/
│   └── styles.css        # design tokens and styles for every screen
├── js/
│   └── app.js            # menu data, cart logic, page behaviour
├── assets/
│   ├── img/              # photos (filled by download-assets.sh)
│   └── icons/            # SVG icons (filled by download-assets.sh)
├── download-assets.sh    # fetches images and icons from Figma
└── README.md
```

## Design

The design tokens are defined as CSS variables at the top of `css/styles.css` and match the Figma variables:

| Token | Value |
|---|---|
| Canvas | `#f8f4e8` |
| Card | `#fffdf7` |
| Ink | `#173b36` |
| Brand | `#0c7c70` |
| Lime accent | `#dff7a3` |
| Peach accent | `#f5dfc3` |
| Muted text | `#667571` |

Fonts (loaded from Google Fonts): **Bricolage Grotesque**, **Manrope** and **Instrument Serif**.

## How it works

- **Menu data** lives in the `MENU` array in `js/app.js`. Add or edit items there.
- **Cart state** is stored in `localStorage` under `campuseats.cart`. The last order is stored under `campuseats.lastOrder`.
- **Totals:** subtotal, plus a flat $0.75 campus service fee, plus tax at 3.78%. These values are constants at the top of `js/app.js`.
- **Customer name** (used for the greeting and pickup code) is the `USER_NAME` constant in `js/app.js`.

### Adding a menu item

1. Add an object to `MENU` in `js/app.js` with `id`, `name`, `price`, `category`, `tag`, `desc` and `img`.
2. Add the image to `assets/img/`.

It then appears on the Browse page, the detail page and in the cart automatically.

## Browser support

Current versions of Chrome, Edge, Firefox and Safari.

## Known limitations

- There is no backend. Orders are simulated and no payment is processed.
- The Profile tab and the payment row are visual only.
- The Figma file also contains a Login screen and a Search overlay, which are not implemented.
- The cart is stored per browser and is not synced across devices.

## Credits

Design: CampusEats Figma file. Implementation: HTML, CSS and vanilla JavaScript.

## License

MIT License.
