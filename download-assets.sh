#!/usr/bin/env bash
# Downloads every image and icon used by the site from the Figma file "CampusEats"
# into assets/img and assets/icons. Run once, from any folder:  bash download-assets.sh
#
# NOTE: Figma's asset links are temporary (they expire 7 days after they were generated).
# If a download fails with 403/404, re-export the assets (see README.md, "Assets").
set -uo pipefail
cd "$(dirname "$0")"
mkdir -p assets/img assets/icons

B="https://www.figma.com/api/mcp/asset"
HOME_="$B/833c73a2-f56f-41ee-8317-4499f965de43"      # Homepage
BROWSE="$B/c4baca58-2941-4af5-b367-d51839986e04"     # Browse page
DETAIL="$B/b0ac2048-4f2b-4ea7-a526-932a200ea9e5"     # Food Detail
ORDER="$B/500c2541-dc46-417a-ae83-f78015163236"      # Order Details
CHECKOUT="$B/b43df193-ecce-43c9-9dd8-0a9e22e6cc34"   # Checkout
CONFIRM="$B/aabd0fab-17cc-4513-aa9e-97ea156c5211"    # Order Confirmation

fail=0
get() { # url  destination
  if curl -fsSL --retry 2 "$1" -o "$2"; then echo "ok    $2"; else echo "FAIL  $2  ($1)"; rm -f "$2"; fail=1; fi
}

# ---- Photos ----
get "$HOME_/e2aab.png"  assets/img/category-pizza.png
get "$HOME_/3c027.png"  assets/img/category-burgers.png
get "$HOME_/11b42.png"  assets/img/category-desserts.png
get "$HOME_/acd1c.png"  assets/img/campus-smash-burger.png
get "$HOME_/949d5.png"  assets/img/students-dining.png
get "$BROWSE/4e50a.png" assets/img/colorful-spread.png
get "$BROWSE/e5f84.png" assets/img/garden-crunch-bowl.png
get "$BROWSE/8a641.png" assets/img/green-goddess-salad.png
get "$BROWSE/dc978.png" assets/img/spicy-stack-burger.png

# ---- Icons (SVG) ----
get "$HOME_/c5881.svg"  assets/icons/icon-back.svg
get "$HOME_/2d65b.svg"  assets/icons/icon-cart.svg
get "$HOME_/be536.svg"  assets/icons/icon-search.svg
get "$HOME_/575e4.svg"  assets/icons/icon-filter.svg
get "$HOME_/43adf.svg"  assets/icons/icon-star-dark.svg
get "$HOME_/62af2.svg"  assets/icons/nav-home-active.svg
get "$HOME_/d8560.svg"  assets/icons/nav-browse.svg
get "$HOME_/ed2ff.svg"  assets/icons/nav-orders.svg
get "$HOME_/209c8.svg"  assets/icons/nav-profile.svg

get "$BROWSE/0774e.svg" assets/icons/icon-star-light.svg
get "$BROWSE/77f60.svg" assets/icons/icon-clock-light.svg
get "$BROWSE/b0790.svg" assets/icons/icon-plus-add.svg
get "$BROWSE/c7f94.svg" assets/icons/nav-home.svg
get "$BROWSE/990dd.svg" assets/icons/nav-browse-active.svg

get "$DETAIL/95e12.svg" assets/icons/icon-star-detail.svg
get "$DETAIL/6a4c3.svg" assets/icons/icon-radio-dot.svg
get "$DETAIL/cf0e1.svg" assets/icons/icon-minus-lg.svg
get "$DETAIL/bdba5.svg" assets/icons/icon-plus-lg.svg

get "$ORDER/e3b33.svg"  assets/icons/icon-minus-sm.svg
get "$ORDER/43601.svg"  assets/icons/icon-plus-sm.svg
get "$ORDER/466af.svg"  assets/icons/icon-add-another.svg
get "$ORDER/3c78d.svg"  assets/icons/icon-ready.svg
get "$ORDER/0c6e5.svg"  assets/icons/icon-arrow-right.svg

get "$CHECKOUT/8aaad.svg" assets/icons/icon-check-sm.svg
get "$CHECKOUT/04df2.svg" assets/icons/icon-pickup.svg
get "$CHECKOUT/e2ba0.svg" assets/icons/icon-delivery.svg
get "$CHECKOUT/c89b2.svg" assets/icons/icon-store.svg
get "$CHECKOUT/71db2.svg" assets/icons/icon-chevron-right.svg

get "$CONFIRM/b7853.svg" assets/icons/icon-success.svg
get "$CONFIRM/5144f.svg" assets/icons/icon-pickup-clock.svg

echo
if [ "$fail" -eq 0 ]; then echo "All assets downloaded."; else echo "Some downloads failed — see README.md (Assets)."; exit 1; fi
