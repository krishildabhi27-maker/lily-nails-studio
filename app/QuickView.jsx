function QuickView({ product, wished, onWish, onClose }) {
  const { Badge, Button, Icon, IconButton, HeartFilled } = window.LilyNailsStudioDesignSystem_5de5bf;
  const [size, setSize] = React.useState(null);
  const [toast, setToast] = React.useState("");
  React.useEffect(() => { setSize(null); }, [product]);
  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);
  const share = async () => {
    const url = location.origin + location.pathname + "#product-" + product.id;
    const data = { title: product.name + " · Lily Nails Studio", text: product.name + " — " + product.price, url };
    try {
      if (navigator.share) { await navigator.share(data); return; }
    } catch (e) { if (e && e.name === "AbortError") return; }
    try {
      await navigator.clipboard.writeText(url);
      setToast("Product link copied to clipboard.");
    } catch (e) { setToast("Product link: " + url); }
  };
  React.useEffect(() => {
    if (!product) return;
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [product]);
  if (!product) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, display: "grid", placeItems: "center", padding: "clamp(16px,4vw,48px)", background: "rgba(61,46,53,.34)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", animation: "lilyFade .25s var(--ease-out)" }}>
      <div onClick={e => e.stopPropagation()} className="lily-qv" style={{ position: "relative", width: "min(920px,100%)", maxHeight: "90vh", overflow: "auto", background: "var(--surface-card)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)", display: "grid", gridTemplateColumns: "1fr 1fr", animation: "lilyRise .32s var(--ease-out)" }}>
        <div style={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}>
          <IconButton variant="glass" onClick={onClose} aria-label="Close"><span style={{ fontSize: 20, lineHeight: 1 }}>×</span></IconButton>
        </div>
        <div className="lily-qv-img" style={{ position: "relative", minHeight: 320 }}>
          <img src={product.image} alt={product.name} loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", top: 16, left: 16 }}><Badge tone={product.badgeTone}>{product.badge}</Badge></div>
        </div>
        <div className="lily-qv-body" style={{ padding: "clamp(20px,4vw,44px)" }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-caption)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--accent-strong)" }}>{product.shape}</div>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(2rem,3.4vw,2.75rem)", lineHeight: 1.05, color: "var(--text-heading)", margin: "8px 0 14px" }}>{product.name}</h3>
          <button type="button" onClick={share} className="lily-share-btn" aria-label={"Share " + product.name} style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 44, padding: "0 4px", margin: "0 0 8px -4px", border: "none", background: "none", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--text-body)", transition: "color var(--dur-med) var(--ease-soft)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>
            Share
          </button>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 22, fontWeight: 500, color: "var(--accent-strong)", marginBottom: 18 }}>{product.price}</div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 9 }}>Select size</div>
            <window.SizePills value={size} onChange={setSize} />
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", opacity: size ? 1 : 0.55, transition: "opacity var(--dur-med) var(--ease-soft)" }}>
            <Button variant="primary" size="lg" icon={<Icon name="bag" size={18} />} disabled={!size} onClick={() => { if (size) window.addToCart(product, size); }} style={{ flex: 1, cursor: size ? "pointer" : "not-allowed" }}>Add to Bag</Button>
            <IconButton variant="soft" active={wished} onClick={() => onWish(product.id)} aria-label="Wishlist" size={52}>
              {wished ? <HeartFilled size={22} /> : <Icon name="heart" size={22} />}
            </IconButton>
          </div>
          <Button variant="secondary" size="lg" disabled={!size} onClick={() => { if (size) { window.addToCart(product, size); onClose(); window.openCheckout(); } }} style={{ width: "100%", marginTop: 12, opacity: size ? 1 : 0.55, cursor: size ? "pointer" : "not-allowed" }}>Buy Now</Button>
          <div style={{ height: 16, marginTop: 6, fontFamily: "var(--font-body)", fontSize: 12, color: "var(--accent-strong)", textAlign: "center", opacity: size ? 0 : 1, transition: "opacity var(--dur-med) var(--ease-soft)" }}>Please select a size to continue.</div>
          <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--border-soft)" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", lineHeight: 1.7, color: "var(--text-body)", margin: "0 0 16px", textWrap: "pretty" }}>{product.blurb}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {product.tags.map(t => (
                <span key={t} style={{ fontFamily: "var(--font-body)", fontSize: 12.5, padding: "6px 14px", borderRadius: "var(--radius-pill)", background: "var(--surface-tint)", color: "var(--text-body)" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div aria-live="polite" style={{ position: "absolute", left: "50%", bottom: 18, transform: `translateX(-50%) translateY(${toast ? 0 : 12}px)`, opacity: toast ? 1 : 0, pointerEvents: "none", transition: "opacity var(--dur-med) var(--ease-soft), transform var(--dur-med) var(--ease-soft)", display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: "var(--radius-pill)", background: "var(--white-warm)", boxShadow: "var(--shadow-lg)", border: "1px solid var(--border-soft)", fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--text-heading)", whiteSpace: "nowrap", zIndex: 3 }}>{toast}</div>
      </div>
    </div>
  );
}
window.QuickView = QuickView;
