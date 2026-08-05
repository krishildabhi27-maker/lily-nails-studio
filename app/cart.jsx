// Lightweight cart store + hook (localStorage-persisted). No deps.
(function () {
  const KEY = "lily_cart_v1";
  let items = load();
  const subs = new Set();
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function commit(next) { items = next; try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} subs.forEach(f => f()); }
  function same(x, id, size) { return x.id === id && x.size === size; }

  function add(id, size, qty) {
    qty = qty || 1;
    const ex = items.find(x => same(x, id, size));
    commit(ex ? items.map(x => same(x, id, size) ? { ...x, qty: x.qty + qty } : x) : [...items, { id, size, qty }]);
  }
  function setQty(id, size, qty) {
    if (qty <= 0) return remove(id, size);
    commit(items.map(x => same(x, id, size) ? { ...x, qty } : x));
  }
  function remove(id, size) { commit(items.filter(x => !same(x, id, size))); }
  function clear() { commit([]); }
  function getItems() { return items; }
  function subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }

  function price(p) { return Number(String(p == null ? "" : p).replace(/[^0-9.]/g, "")) || 0; }
  function fmt(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }
  function detailed() {
    const rows = items.map(x => {
      const p = (window.LILY_PRODUCTS || []).find(pr => pr.id === x.id) || {};
      return { ...p, id: x.id, size: x.size, qty: x.qty, key: x.id + "|" + x.size, unit: price(p.price), line: price(p.price) * x.qty };
    });
    const subtotal = rows.reduce((s, r) => s + r.line, 0);
    const shipping = 0;
    const total = subtotal + shipping;
    const count = rows.reduce((s, r) => s + r.qty, 0);
    return { rows, subtotal, shipping, total, count };
  }

  window.LilyCart = { add, setQty, remove, clear, getItems, subscribe, price, fmt, detailed };
  window.openCart = () => window.dispatchEvent(new CustomEvent("lily:cart", { detail: "cart" }));
  window.openCheckout = () => window.dispatchEvent(new CustomEvent("lily:cart", { detail: "checkout" }));

  window.LILY_SIZES = ["Small", "Medium", "Large"];
  window.SizePills = function SizePills({ value, onChange, size = "md" }) {
    const pad = size === "sm" ? "7px 0" : "9px 0";
    const fs = size === "sm" ? 12 : 12.5;
    return React.createElement("div", { role: "radiogroup", "aria-label": "Select size", style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 } },
      window.LILY_SIZES.map(s => {
        const on = value === s;
        return React.createElement("button", {
          key: s, type: "button", role: "radio", "aria-checked": on, onClick: (e) => { e.stopPropagation(); onChange(s); },
          style: {
            padding: pad, borderRadius: "var(--radius-pill)", cursor: "pointer",
            fontFamily: "var(--font-body)", fontSize: fs, letterSpacing: ".08em", textTransform: "uppercase",
            border: on ? "1px solid transparent" : "1px solid var(--border-strong)",
            background: on ? "var(--grad-btn, linear-gradient(120deg,var(--accent-strong),var(--rose-gold)))" : "transparent",
            color: on ? "#fff" : "var(--text-body)",
            boxShadow: on ? "var(--shadow-xs)" : "none",
            transition: "all var(--dur-med) var(--ease-soft)",
          },
        }, s);
      })
    );
  };

  window.useCart = function useCart() {
    const [, force] = React.useReducer(c => c + 1, 0);
    React.useEffect(() => window.LilyCart.subscribe(force), []);
    return window.LilyCart.detailed();
  };

  // ---- Wishlist store (persistent) ----
  const WKEY = "lily_wishlist_v1";
  let wl = wload();
  const wsubs = new Set();
  function wload() { try { return JSON.parse(localStorage.getItem(WKEY)) || []; } catch (e) { return []; } }
  function wcommit(next) { wl = next; try { localStorage.setItem(WKEY, JSON.stringify(wl)); } catch (e) {} wsubs.forEach(f => f()); }
  function wtoggle(id) { wcommit(wl.includes(id) ? wl.filter(x => x !== id) : [...wl, id]); }
  function wremove(id) { wcommit(wl.filter(x => x !== id)); }
  function whas(id) { return wl.includes(id); }
  function wproducts() { return wl.map(id => (window.LILY_PRODUCTS || []).find(p => p.id === id)).filter(Boolean); }
  window.LilyWishlist = { toggle: wtoggle, remove: wremove, has: whas, ids: () => wl, products: wproducts, subscribe: fn => { wsubs.add(fn); return () => wsubs.delete(fn); } };
  window.openWishlist = () => window.dispatchEvent(new CustomEvent("lily:wishlist"));

  window.useWishlist = function useWishlist() {
    const [, force] = React.useReducer(c => c + 1, 0);
    React.useEffect(() => window.LilyWishlist.subscribe(force), []);
    return { ids: wl, count: wl.length, has: whas, toggle: wtoggle, remove: wremove, products: wproducts() };
  };
})();
