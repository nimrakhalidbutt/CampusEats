/* CampusEats — ordering flow
   index → browse → food-detail → cart → checkout → confirmation
   State lives in localStorage (cart + last order). */
(function () {
  "use strict";

  /* ---------- Config (all values come from the Figma copy) ---------- */
  var USER_NAME = "Nimra";
  var SERVICE_FEE = 0.75;
  var TAX_RATE = 0.0378; // gives $0.85 on the $22.50 subtotal shown in the design
  var KEY_CART = "campuseats.cart";
  var KEY_ORDER = "campuseats.lastOrder";
  var IMG = "assets/img/";
  var ICON = "assets/icons/";

  var MENU = [
    { id: "garden-crunch-bowl", name: "Garden Crunch Bowl", price: 10.5, category: "bowls", tag: "Bestseller",
      desc: "Quinoa, avocado, roasted corn", img: IMG + "garden-crunch-bowl.png", bordered: true,
      alt: "Bowl of quinoa topped with avocado and roasted corn" },
    { id: "campus-smash-burger", name: "Campus Smash Burger", price: 12, category: "burgers", tag: "Popular",
      desc: "Double patty, cheddar, house sauce", img: IMG + "campus-smash-burger.png", bordered: false,
      alt: "Double smash burger with melted cheddar, pickles and house sauce on a brioche bun",
      long: "Two smashed beef patties, sharp cheddar, crisp lettuce, pickles, and our secret Commons sauce on a toasted brioche bun.",
      chips: ["High protein", "620 cal", "Contains dairy"] },
    { id: "green-goddess-salad", name: "Green Goddess Salad", price: 9.5, category: "salads", tag: "Vegan",
      desc: "Kale, cucumber, feta, herbs", img: IMG + "green-goddess-salad.png", bordered: true,
      alt: "Green salad with kale, cucumber, feta and fresh herbs" },
    { id: "spicy-stack-burger", name: "Spicy Stack Burger", price: 13, category: "burgers", tag: "New",
      desc: "Crispy onions, jalapeño, aioli", img: IMG + "spicy-stack-burger.png", bordered: true,
      alt: "Burger topped with crispy onions, jalapeño and aioli" }
  ];
  var SIDES = {
    fries: { name: "Seasoned fries", note: "Classic crispy cut" },
    salad: { name: "Side garden salad", note: "Light lemon dressing" }
  };

  /* ---------- Helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function round2(n) { return Math.round(n * 100) / 100; }
  function money(n) { return "$" + round2(n).toFixed(2); }
  function itemById(id) { return MENU.filter(function (m) { return m.id === id; })[0]; }
  function param(name) { return new URLSearchParams(window.location.search).get(name); }
  function read(key, fallback) {
    try { var v = window.localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
  }
  function icon(name, w, h, cls) {
    return '<img src="' + ICON + name + '.svg" width="' + w + '" height="' + h + '" alt=""' + (cls ? ' class="' + cls + '"' : "") + ">";
  }

  /* ---------- Cart ---------- */
  function getCart() { return read(KEY_CART, []); }
  function setCart(c) { write(KEY_CART, c); }
  function addToCart(id, side, qty) {
    var cart = getCart();
    var line = cart.filter(function (l) { return l.id === id && l.side === side; })[0];
    if (line) { line.qty = Math.min(20, line.qty + qty); } else { cart.push({ id: id, side: side, qty: qty }); }
    setCart(cart);
  }
  function cartCount(cart) { return cart.reduce(function (n, l) { return n + l.qty; }, 0); }
  function totals(cart) {
    var sub = round2(cart.reduce(function (s, l) { return s + itemById(l.id).price * l.qty; }, 0));
    var fee = cart.length ? SERVICE_FEE : 0;
    var tax = cart.length ? round2(sub * TAX_RATE) : 0;
    return { sub: sub, fee: fee, tax: tax, total: round2(sub + fee + tax) };
  }

  /* Back buttons: go back in history when possible, otherwise follow the link. */
  function wireBack() {
    $$("[data-back]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        if (window.history.length > 1 && document.referrer) { e.preventDefault(); window.history.back(); }
      });
    });
  }

  /* ==========================================================================
     Pages
     ========================================================================== */
  var pages = {};

  /* ---------- Home ---------- */
  pages.home = function () {
    var el = $("#today");
    if (!el || !window.Intl) { return; }
    var d = new Date();
    var wd = new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(d);
    var mo = new Intl.DateTimeFormat("en-GB", { month: "long" }).format(d);
    el.textContent = (wd + ", " + d.getDate() + " " + mo).toUpperCase(); // e.g. THURSDAY, 15 OCTOBER
  };

  /* ---------- Browse ---------- */
  pages.browse = function () {
    var list = $("#picks");
    var chips = $$(".chip");
    var active = param("cat") || "popular";
    var query = (param("q") || "").trim().toLowerCase(); // from the home-page search box
    if (!chips.some(function (c) { return c.dataset.filter === active; })) { active = "popular"; }

    function card(it) {
      return '<li class="pick-card">' +
        '<a class="pick-card__link" href="food-detail.html?item=' + it.id + '">' +
        '<img class="pick-card__img" src="' + it.img + '" width="95" height="96" alt="' + esc(it.alt) + '">' +
        '<div class="pick-card__info"><span class="tag">' + it.tag + '</span>' +
        '<p class="pick-card__name">' + it.name + '</p>' +
        '<p class="pick-card__desc">' + it.desc + '</p>' +
        '<p class="pick-card__price">' + money(it.price) + '</p></div></a>' +
        '<button class="add-btn" type="button" data-add="' + it.id + '" aria-label="Add ' + it.name + ' to cart">' +
        icon("icon-plus-add", 17.991, 17.991) + '</button></li>';
    }
    function render() {
      var items = MENU.filter(function (m) {
        var inCategory = active === "popular" || m.category === active;
        var inSearch = !query || (m.name + " " + m.desc + " " + m.tag + " " + m.category).toLowerCase().indexOf(query) !== -1;
        return inCategory && inSearch;
      });
      list.innerHTML = items.length ? items.map(card).join("") :
        '<li class="empty-note">' + (query ? "No dishes match “" + esc(query) + "”." : "Nothing here yet.") + "</li>";
      chips.forEach(function (c) {
        var on = c.dataset.filter === active;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", String(on));
      });
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () { active = c.dataset.filter; render(); });
    });
    list.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-add]");
      if (!btn) { return; }
      addToCart(btn.dataset.add, "fries", 1); // default side from the design
      window.location.href = "cart.html";
    });
    render();
  };

  /* ---------- Food detail ---------- */
  pages["food-detail"] = function () {
    var it = itemById(param("item")) || itemById("campus-smash-burger");
    var editSide = param("edit"); // when editing a cart line
    var existing = editSide ? getCart().filter(function (l) { return l.id === it.id && l.side === editSide; })[0] : null;
    var qty = existing ? existing.qty : 1;

    document.title = it.name + " · CampusEats";
    var hero = $("#hero-img"); hero.src = it.img; hero.alt = it.alt || it.name;
    $("#title").innerHTML = it.name.replace(/^(\S+ \S+) (.+)$/, "$1<br>$2");
    $("#price-pill").textContent = "$" + (it.price % 1 ? it.price.toFixed(2) : it.price);
    $("#desc").textContent = it.long || it.desc;
    var chipsEl = $("#chips");
    chipsEl.innerHTML = (it.chips || []).map(function (c) { return '<li class="info-chip">' + c + "</li>"; }).join("");
    chipsEl.hidden = !(it.chips && it.chips.length);

    var side = existing ? existing.side : "fries";
    $$('input[name="side"]').forEach(function (r) {
      r.checked = r.value === side;
      r.addEventListener("change", function () { side = r.value; });
    });

    var out = $("#qty"), priceOut = $("#btn-price");
    function sync() { out.textContent = qty; priceOut.textContent = money(it.price * qty); }
    $("#dec").addEventListener("click", function () { qty = Math.max(1, qty - 1); sync(); });
    $("#inc").addEventListener("click", function () { qty = Math.min(20, qty + 1); sync(); });
    sync();

    $("#add").addEventListener("click", function (e) {
      e.preventDefault();
      if (existing) {
        setCart(getCart().filter(function (l) { return !(l.id === it.id && l.side === editSide); }));
      }
      addToCart(it.id, side, qty);
      window.location.href = "cart.html";
    });
  };

  /* ---------- Cart / Order details ---------- */
  pages.cart = function () {
    if (param("demo") === "1") { // preload the exact order shown in the Figma design
      setCart([{ id: "campus-smash-burger", side: "fries", qty: 1 }, { id: "garden-crunch-bowl", side: "fries", qty: 1 }]);
    }
    var linesEl = $("#lines");

    function lineHtml(l, i) {
      var it = itemById(l.id);
      return '<li class="line">' +
        '<img class="line__img' + (it.bordered ? " line__img--bordered" : "") + '" src="' + it.img + '" width="76" height="82" alt="' + esc(it.alt) + '">' +
        '<div class="line__info"><p class="line__name">' + it.name + '</p>' +
        '<p class="line__side">' + SIDES[l.side].name + '</p>' +
        '<a class="line__edit" href="food-detail.html?item=' + it.id + "&edit=" + l.side + '" aria-label="Edit options for ' + esc(it.name) + '">Edit options</a></div>' +
        '<div class="line__right"><p class="line__price">' + money(it.price * l.qty) + '</p>' +
        '<div class="mini-qty"><button type="button" data-dec="' + i + '" aria-label="Decrease quantity of ' + esc(it.name) + '">' + icon("icon-minus-sm", 13.983, 13.983) + "</button>" +
        "<output>" + l.qty + "</output>" +
        '<button type="button" data-inc="' + i + '" aria-label="Increase quantity of ' + esc(it.name) + '">' + icon("icon-plus-sm", 13.983, 13.983) + "</button></div></div></li>";
    }
    function render() {
      var cart = getCart(), has = cart.length > 0, t = totals(cart), n = cartCount(cart);
      $("#cart-full").hidden = !has;
      $("#cart-empty").hidden = has;
      $("#cart-bar").hidden = !has;
      if (!has) { return; }
      $("#count").textContent = n + (n === 1 ? " ITEM" : " ITEMS");
      linesEl.innerHTML = cart.map(lineHtml).join("");
      $("#sub").textContent = money(t.sub);
      $("#fee").textContent = money(t.fee);
      $("#tax").textContent = money(t.tax);
      $("#total").textContent = money(t.total);
    }
    linesEl.addEventListener("click", function (e) {
      var cart = getCart(), d = e.target.closest("[data-dec]"), u = e.target.closest("[data-inc]");
      if (d) { var i = +d.dataset.dec; cart[i].qty -= 1; if (cart[i].qty < 1) { cart.splice(i, 1); } }
      else if (u) { var j = +u.dataset.inc; cart[j].qty = Math.min(20, cart[j].qty + 1); }
      else { return; }
      setCart(cart); render();
    });
    render();
  };

  /* ---------- Checkout ---------- */
  pages.checkout = function () {
    var cart = getCart();
    if (!cart.length) { window.location.replace("cart.html"); return; }
    var t = totals(cart), method = "pickup";

    $("#review-lines").innerHTML = cart.map(function (l) {
      return '<p class="h-16 review-line">' + l.qty + "× " + itemById(l.id).name + "</p>";
    }).join("");
    $("#review-total").textContent = money(t.total);
    $("#bar-total").textContent = money(t.total);

    var buttons = $$(".method");
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        method = b.dataset.method;
        buttons.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        $("#pickup-from").hidden = method !== "pickup";
      });
    });

    $("#confirm").addEventListener("click", function (e) {
      e.preventDefault();
      var now = new Date();
      var lead = method === "pickup" ? 14 : 29; // minutes until the estimate window opens
      var order = {
        id: "CE-" + (1000 + Math.floor(Math.random() * 9000)),
        method: method,
        placedAt: now.getTime(),
        from: now.getTime() + lead * 60000,
        to: now.getTime() + (lead + 10) * 60000,
        code: USER_NAME.toUpperCase() + " " + (10 + Math.floor(Math.random() * 90)),
        total: t.total
      };
      write(KEY_ORDER, order);
      window.location.href = "confirmation.html";
    });
  };

  /* ---------- Confirmation ---------- */
  pages.confirmation = function () {
    function clock(d, withMeridiem) {
      var h = d.getHours(), m = d.getMinutes(), ap = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      return h + ":" + (m < 10 ? "0" : "") + m + (withMeridiem ? " " + ap : "");
    }
    var order = read(KEY_ORDER, null);
    if (order) {
      var a = new Date(order.from), b = new Date(order.to);
      var same = (a.getHours() >= 12) === (b.getHours() >= 12);
      $("#order-no").textContent = "ORDER #" + order.id;
      $("#window").textContent = same ? clock(a) + " – " + clock(b, true) : clock(a, true) + " – " + clock(b, true);
      $("#placed").textContent = clock(new Date(order.placedAt), true);
      $("#code").textContent = order.code;
      if (order.method === "delivery") { $("#window-label").textContent = "ESTIMATED DELIVERY"; }
    } // otherwise the static copy from the Figma design is shown
    $("#back-home").addEventListener("click", function () { setCart([]); });
  };

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    wireBack();
    var page = document.body.getAttribute("data-page");
    if (pages[page]) { pages[page](); }
  });
})();
