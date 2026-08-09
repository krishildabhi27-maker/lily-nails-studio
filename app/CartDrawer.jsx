// Slide-in cart drawer + checkout flow. Opens on window "lily:cart" event.
function QtyStepper({ qty, onDec, onInc }) {
  const btn = { width: 30, height: 30, borderRadius: "var(--radius-pill)", border: "1px solid var(--border-soft)", background: "var(--white-warm)", color: "var(--text-heading)", cursor: "pointer", fontSize: 16, lineHeight: 1, display: "grid", placeItems: "center", fontFamily: "var(--font-body)" };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <button style={btn} onClick={onDec} aria-label="Decrease">−</button>
      <span style={{ minWidth: 20, textAlign: "center", fontFamily: "var(--font-body)", fontSize: 15, color: "var(--text-heading)" }}>{qty}</span>
      <button style={btn} onClick={onInc} aria-label="Increase">+</button>
    </div>
  );
}

function Row({ label, value, strong }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, fontFamily: "var(--font-body)", fontSize: strong ? 18 : 14.5, color: strong ? "var(--text-heading)" : "var(--text-body)", fontWeight: strong ? 600 : 400 }}>
      <span style={strong ? { fontFamily: "var(--font-display)", fontSize: 22, whiteSpace: "nowrap" } : { whiteSpace: "nowrap" }}>{label}</span>
      <span style={strong ? { color: "var(--accent-strong)", whiteSpace: "nowrap" } : { whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
}

function CartDrawer() {
  const { Button, Icon, IconButton, Input, Badge } = window.LilyNailsStudioDesignSystem_5de5bf;
  const cart = window.useCart();
  const { rows, subtotal, shipping, total, count } = cart;
  const [view, setView] = React.useState(null); // null | "cart" | "checkout" | "done"
  const [order, setOrder] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [toast, setToast] = React.useState("");
  const [form, setForm] = React.useState({ name: "", phone: "", address: "", state: "", city: "", pincode: "" });
  const set = k => e => setForm(f => {
    const nf = { ...f, [k]: e.target.value };
    if (k === "state") nf.city = "";
    return nf;
  });
  const cities = form.state ? (window.LILY_INDIA[form.state] || []) : [];
  const located = !!(form.state && form.city);
  const validIN = located && !!window.LILY_INDIA[form.state] && (window.LILY_INDIA[form.state] || []).includes(form.city);
  const ship = located ? window.LILY_shipFor(form.state, form.city) : null;
  const payable = subtotal + (ship || 0);

  React.useEffect(() => {
    const onOpen = e => setView(e.detail === "checkout" && count ? "checkout" : "cart");
    window.addEventListener("lily:cart", onOpen);
    return () => window.removeEventListener("lily:cart", onOpen);
  }, [count]);
  React.useEffect(() => {
    const onKey = e => { if (e.key === "Escape") setView(null); };
    if (view) { window.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [view]);

  const open = view !== null;
  const fmt = window.LilyCart.fmt;

  // Backend base URL (set window.LILY_API_BASE in the page to point at your deployed API).
  const API = "https://api.lilynailstudio.in/api";
  const loadRazorpay = () => new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load payment gateway."));
    document.body.appendChild(s);
  });
  // Poll order status for tracking (shipment is created by the webhook, may lag a moment).
  const fetchTracking = async (code) => {
    for (let i = 0; i < 5; i++) {
      try {
        const r = await fetch(`${API}/orders/${code}`);
        if (r.ok) { const d = await r.json(); if (d.awb || d.tracking_url) return d; }
      } catch (e) {}
      await new Promise(res => setTimeout(res, 1500));
    }
    return null;
  };

  const placeOrder = async e => {
    e.preventDefault();
    if (submitting || count === 0) return;
    if (!validIN) { setToast("We currently deliver only within India."); return; }
    setSubmitting(true);
    setToast("");
    try {
      const customer = { name: form.name, phone: form.phone, address: form.address, state: form.state, city: form.city, pincode: form.pincode, country: "India" };
      const cart = window.LilyCart.getItems();
      // 1) Create order on backend (server prices everything).
      const cr = await fetch(`${API}/payments/create-order`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, cart }),
      });
      const co = await cr.json();
      if (!cr.ok) throw new Error(co.error || "Could not create order.");

      // 2) Open Razorpay Checkout with the returned order id.
      await loadRazorpay();
      const rzp = new window.Razorpay({
        key: co.razorpayKeyId,
        order_id: co.razorpayOrderId,
        amount: co.amountPaise,
        currency: co.currency || "INR",
        name: "Lily Nails Studio",
        description: `Order ${co.orderCode}`,
        prefill: { name: form.name, contact: form.phone },
        theme: { color: "#c8879a" },
        handler: async (resp) => {
          try {
            // 4) Verify payment on the backend.
            const vr = await fetch(`${API}/payments/verify-payment`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              }),
            });
            const vd = await vr.json();
            if (!vr.ok || !vd.verified) throw new Error(vd.error || "Payment could not be verified.");
            // 5) Success — fetch tracking, clear cart, show existing success page.
            const track = await fetchTracking(co.orderCode);
            setOrder({ id: co.orderCode, name: form.name, total: co.amount, awb: track && track.awb, tracking_url: track && track.tracking_url });
            window.LilyCart.clear();
            setSubmitting(false);
            setView("done");
          } catch (err) {
            setSubmitting(false);
            setToast(err.message || "Payment verification failed.");
          }
        },
        modal: { ondismiss: () => { setSubmitting(false); setToast("Payment cancelled."); } },
      });
      rzp.on("payment.failed", () => { setSubmitting(false); setToast("Payment failed. Please try again."); });
      rzp.open();
    } catch (err) {
      setSubmitting(false);
      setToast(err.message || "Something went wrong. Please try again.");
    }
  };
  const selStyle = { width: "100%", boxSizing: "border-box", padding: "14px 18px", fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", color: form.state ? "var(--text-body)" : "var(--text-muted)", background: "var(--white-pearl)", border: "1px solid var(--border-soft)", borderRadius: "var(--radius-pill)", outline: "none", appearance: "none", cursor: "pointer" };
  const lblStyle = { display: "block", fontSize: "var(--fs-caption)", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8, fontFamily: "var(--font-body)" };

  return (
    <React.Fragment>
      <div onClick={() => setView(null)} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(61,46,53,.34)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity var(--dur-med) var(--ease-soft)" }} />
      <aside role="dialog" aria-label="Shopping cart" style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 91, width: "min(460px,100vw)", background: "var(--white-warm)", boxShadow: "var(--shadow-lg)", display: "flex", flexDirection: "column", transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform var(--dur-slow) var(--ease-out)" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 24px", borderBottom: "1px solid var(--border-soft)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {view === "checkout" && count > 0 && (
              <button onClick={() => setView("cart")} aria-label="Back" style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-heading)", display: "flex", padding: 0 }}><Icon name="chevron" size={22} /></button>
            )}
            <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500, fontSize: 28, color: "var(--text-heading)" }}>
              {view === "checkout" ? "Checkout" : view === "done" ? "Thank you" : "Your bag"}
            </h2>
          </div>
          <IconButton variant="soft" onClick={() => setView(null)} aria-label="Close"><span style={{ fontSize: 20, lineHeight: 1 }}>×</span></IconButton>
        </header>

        {view === "done" ? (
          <div style={{ flex: 1, display: "grid", placeItems: "center", textAlign: "center", padding: 32 }}>
            <div>
              <div style={{ width: 76, height: 76, margin: "0 auto 22px", borderRadius: "var(--radius-pill)", background: "var(--grad-blush)", display: "grid", placeItems: "center", color: "var(--accent-strong)" }}><Icon name="heart" size={34} /></div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--text-heading)", margin: "0 0 10px" }}>Order placed, {order && order.name ? order.name.split(" ")[0] : "lovely"}!</h3>
              <p style={{ fontFamily: "var(--font-body)", color: "var(--text-body)", lineHeight: 1.6, maxWidth: 300, margin: "0 auto 8px" }}>Your order <strong>#{order && order.id}</strong> is confirmed. We'll hand-finish your set and be in touch on Instagram shortly.</p>
              <p style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)", fontSize: 13, margin: "0 0 26px" }}>A confirmation has been noted for {order && order.total != null ? fmt(order.total) : ""}.</p>
              {order && (order.awb || order.tracking_url) ? (
                <p style={{ fontFamily: "var(--font-body)", color: "var(--text-body)", fontSize: 13.5, margin: "0 0 26px" }}>Tracking: <strong>{order.awb || "assigned"}</strong>{order.tracking_url ? <> · <a href={order.tracking_url} target="_blank" rel="noopener">Track order</a></> : null}</p>
              ) : (
                <p style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)", fontSize: 13, margin: "0 0 26px" }}>Your tracking number will appear here shortly.</p>
              )}
              <Button variant="primary" onClick={() => setView(null)}>Continue Shopping</Button>
            </div>
          </div>
        ) : count === 0 ? (
          <div style={{ flex: 1, display: "grid", placeItems: "center", textAlign: "center", padding: 32 }}>
            <div>
              <div style={{ color: "var(--accent-strong)", marginBottom: 16 }}><Icon name="bag" size={44} stroke={1} /></div>
              <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 24, color: "var(--text-heading)", margin: "0 0 8px" }}>Your bag is empty</p>
              <p style={{ fontFamily: "var(--font-body)", color: "var(--text-body)", margin: "0 0 24px" }}>Add a set you love to get started.</p>
              <Button variant="secondary" onClick={() => setView(null)}>Browse the Collection</Button>
            </div>
          </div>
        ) : view === "checkout" ? (
          <form onSubmit={placeOrder} style={{ flex: 1, overflowY: "auto", padding: "24px", display: "grid", gap: 16, alignContent: "start" }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", color: "var(--accent-strong)" }}>Your details</div>
            <Input label="Full name" placeholder="Jane Doe" value={form.name} onChange={set("name")} required />
            <Input label="Phone" type="tel" placeholder="+91 90000 00000" value={form.phone} onChange={set("phone")} required />
            <Input label="Shipping address" placeholder="Flat, street, area" value={form.address} onChange={set("address")} required />
            <label>
              <span style={lblStyle}>Country</span>
              <div style={{ ...selStyle, color: "var(--text-body)", cursor: "default", display: "flex", alignItems: "center", justifyContent: "space-between" }}>India<span style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--text-muted)" }}>Only</span></div>
            </label>
            <label>
              <span style={lblStyle}>State</span>
              <select value={form.state} onChange={set("state")} required style={selStyle}>
                <option value="" disabled>Select a state</option>
                {Object.keys(window.LILY_INDIA).map(s => <option key={s} value={s} style={{ color: "var(--text-body)" }}>{s}</option>)}
              </select>
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label>
                <span style={lblStyle}>City</span>
                <select value={form.city} onChange={set("city")} required disabled={!form.state} style={{ ...selStyle, color: form.city ? "var(--text-body)" : "var(--text-muted)", opacity: form.state ? 1 : 0.6, cursor: form.state ? "pointer" : "not-allowed" }}>
                  <option value="" disabled>{form.state ? "Select a city" : "Select state first"}</option>
                  {cities.map(c => <option key={c} value={c} style={{ color: "var(--text-body)" }}>{c}</option>)}
                </select>
              </label>
              <Input label="Pincode" placeholder="380001" value={form.pincode} onChange={set("pincode")} required />
            </div>
            <div style={{ borderTop: "1px solid var(--border-soft)", paddingTop: 16, display: "grid", gap: 10 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", color: "var(--accent-strong)", marginBottom: 2 }}>Order summary</div>
              {rows.map(r => (
                <div key={r.key} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-body)" }}>
                  <span>{r.name} · {r.size} × {r.qty}</span><span>{fmt(r.line)}</span>
                </div>
              ))}
              <Row label="Subtotal" value={fmt(subtotal)} />
              <Row label="Shipping" value={located ? (ship === 0 ? "FREE" : fmt(ship)) : "Select location"} />
              {located && ship > 0 && (
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11.5, color: "var(--text-muted)", marginTop: -4 }}>Distance-based · ~{Math.round(window.LILY_distanceKm(form.state, form.city))} km from Ahmedabad</div>
              )}
              <div style={{ borderTop: "1px solid var(--border-soft)", paddingTop: 12 }}><Row label="Total" value={fmt(payable)} strong /></div>
            </div>
            <Button type="submit" variant="primary" size="lg" icon={<Icon name="heart" size={18} />} disabled={!located || submitting} style={{ width: "100%", marginTop: 4, opacity: (located && !submitting) ? 1 : 0.55, cursor: (located && !submitting) ? "pointer" : "not-allowed" }}>{submitting ? "Placing order…" : `Place Order · ${fmt(payable)}`}</Button>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", textAlign: "center", margin: 0 }}>Payment is arranged over Instagram DM after your order is placed.</p>
            {toast && <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--accent-strong)", textAlign: "center", margin: "4px 0 0" }}>{toast}</p>}
          </form>
        ) : (
          <React.Fragment>
            <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "18px 24px" }}>
              {rows.map(r => (
                <div key={r.key} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid var(--border-soft)" }}>
                  <img src={r.image} alt={r.name} style={{ width: 74, height: 92, objectFit: "cover", borderRadius: "var(--radius-md)", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: "var(--text-heading)", lineHeight: 1.1 }}>{r.name}</span>
                      <button onClick={() => window.LilyCart.remove(r.id, r.size)} aria-label="Remove" style={{ border: "none", background: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 0, height: 20 }}>×</button>
                    </div>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--text-muted)" }}>Size: {r.size}</span>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                      <QtyStepper qty={r.qty} onDec={() => window.LilyCart.setQty(r.id, r.size, r.qty - 1)} onInc={() => window.LilyCart.setQty(r.id, r.size, r.qty + 1)} />
                      <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--accent-strong)" }}>{fmt(r.line)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border-soft)", background: "var(--white-pearl)", display: "grid", gap: 10 }}>
              <Row label="Subtotal" value={fmt(subtotal)} />
              <Row label="Shipping" value="Calculated at checkout" />
              <div style={{ borderTop: "1px solid var(--border-soft)", paddingTop: 12, marginTop: 2 }}><Row label="Total" value={fmt(total)} strong /></div>
              <Button variant="primary" size="lg" onClick={() => setView("checkout")} style={{ width: "100%", marginTop: 6 }}>Checkout</Button>
              <button onClick={() => setView(null)} style={{ border: "none", background: "none", fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--text-body)", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>Continue shopping</button>
            </div>
          </React.Fragment>
        )}
      </aside>
    </React.Fragment>
  );
}
window.CartDrawer = CartDrawer;

function CartToast() {
  const [msg, setMsg] = React.useState(null);
  React.useEffect(() => {
    let t;
    const on = e => { setMsg(e.detail); clearTimeout(t); t = setTimeout(() => setMsg(null), 2200); };
    window.addEventListener("lily:added", on);
    return () => { window.removeEventListener("lily:added", on); clearTimeout(t); };
  }, []);
  const { Icon } = window.LilyNailsStudioDesignSystem_5de5bf;
  return (
    <div style={{ position: "fixed", left: "50%", bottom: 28, zIndex: 95, transform: `translateX(-50%) translateY(${msg ? 0 : 20}px)`, opacity: msg ? 1 : 0, pointerEvents: "none", transition: "opacity var(--dur-med) var(--ease-soft), transform var(--dur-med) var(--ease-soft)", display: "flex", alignItems: "center", gap: 10, padding: "13px 22px", borderRadius: "var(--radius-pill)", background: "var(--white-warm)", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border-soft)", fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-heading)" }}>
      <span style={{ color: "var(--accent-strong)", display: "flex" }}><Icon name="bag" size={18} /></span>{msg ? `${msg} added to bag` : ""}
    </div>
  );
}
window.CartToast = CartToast;

function WishlistDrawer() {
  const { Button, Icon, IconButton, HeartFilled } = window.LilyNailsStudioDesignSystem_5de5bf;
  const wl = window.useWishlist();
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState({});
  React.useEffect(() => {
    const on = () => setOpen(true);
    window.addEventListener("lily:wishlist", on);
    return () => window.removeEventListener("lily:wishlist", on);
  }, []);
  React.useEffect(() => {
    const onKey = e => { if (e.key === "Escape") setOpen(false); };
    if (open) { window.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);
  const fmt = window.LilyCart.fmt;
  return (
    <React.Fragment>
      <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(61,46,53,.34)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity var(--dur-med) var(--ease-soft)" }} />
      <aside role="dialog" aria-label="Wishlist" style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 91, width: "min(460px,100vw)", background: "var(--white-warm)", boxShadow: "var(--shadow-lg)", display: "flex", flexDirection: "column", transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform var(--dur-slow) var(--ease-out)" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 24px", borderBottom: "1px solid var(--border-soft)" }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500, fontSize: 28, color: "var(--text-heading)" }}>Your wishlist</h2>
          <IconButton variant="soft" onClick={() => setOpen(false)} aria-label="Close"><span style={{ fontSize: 20, lineHeight: 1 }}>×</span></IconButton>
        </header>
        {wl.count === 0 ? (
          <div style={{ flex: 1, display: "grid", placeItems: "center", textAlign: "center", padding: 32 }}>
            <div>
              <div style={{ color: "var(--accent-strong)", marginBottom: 16 }}><Icon name="heart" size={44} stroke={1} /></div>
              <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 24, color: "var(--text-heading)", margin: "0 0 8px" }}>No favourites yet</p>
              <p style={{ fontFamily: "var(--font-body)", color: "var(--text-body)", margin: "0 0 24px" }}>Tap the heart on any set you love to save it here.</p>
              <Button variant="secondary" onClick={() => setOpen(false)}>Browse the Collection</Button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "18px 24px" }}>
            {wl.products.map(p => {
              const sz = size[p.id];
              return (
                <div key={p.id} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid var(--border-soft)" }}>
                  <img src={p.image} alt={p.name} style={{ width: 74, height: 92, objectFit: "cover", borderRadius: "var(--radius-md)", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--text-heading)", lineHeight: 1.15 }}>{p.name}</span>
                      <button onClick={() => window.LilyWishlist.remove(p.id)} aria-label="Remove" style={{ border: "none", background: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 0, height: 20 }}>×</button>
                    </div>
                    <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--accent-strong)", fontSize: 14 }}>{p.price}</span>
                    <window.SizePills value={sz || null} onChange={s => setSize(m => ({ ...m, [p.id]: s }))} size="sm" />
                    <Button variant="primary" size="sm" icon={<Icon name="bag" size={14} />} disabled={!sz} onClick={() => sz && window.addToCart(p, sz)} style={{ width: "100%", opacity: sz ? 1 : 0.55, cursor: sz ? "pointer" : "not-allowed" }}>{sz ? "Add to Cart" : "Select a size"}</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </aside>
    </React.Fragment>
  );
}
window.WishlistDrawer = WishlistDrawer;

window.addToCart = function (product, size, qty) {
  if (!size) return;
  window.LilyCart.add(product.id, size, qty || 1);
  window.dispatchEvent(new CustomEvent("lily:added", { detail: product.name + " · " + size }));
};
