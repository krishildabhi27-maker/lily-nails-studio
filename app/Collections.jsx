function SectionHead({ eyebrow, title, sub, id }) {
  const { Eyebrow } = window.LilyNailsStudioDesignSystem_5de5bf;
  return (
    <div id={id} style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 52px", scrollMarginTop: 90 }}>
      <Eyebrow rules>{eyebrow}</Eyebrow>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(2.2rem,4vw,3.25rem)", letterSpacing: "-.01em", color: "var(--text-heading)", margin: "16px 0 0", lineHeight: 1.08 }}>{title}</h2>
      {sub && <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", lineHeight: 1.6, color: "var(--text-body)", margin: "14px auto 0", maxWidth: 520, textWrap: "pretty" }}>{sub}</p>}
    </div>
  );
}

function ProductGrid({ ids, wished, onWish, onQuick }) {
  const { ProductCard, Button, Icon } = window.LilyNailsStudioDesignSystem_5de5bf;
  const items = ids.map(id => window.LILY_PRODUCTS.find(p => p.id === id));
  return (
    <div className="lily-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "var(--space-6)" }}>
      {items.map(it => <ProductCardWithSize key={it.id} it={it} wished={wished} onWish={onWish} onQuick={onQuick} />)}
    </div>
  );
}

function ProductCardWithSize({ it, wished, onWish, onQuick }) {
  const { ProductCard, Button, Icon } = window.LilyNailsStudioDesignSystem_5de5bf;
  const [size, setSize] = React.useState(null);
  const ready = !!size;
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ProductCard name={it.name} price={it.price} image={it.image}
        badge={it.badge} badgeTone={it.badgeTone}
        wished={!!wished[it.id]} onWish={() => onWish(it.id)} onQuickView={() => onQuick(it)} />
      <div style={{ marginTop: 14, marginBottom: 12 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 7 }}>Size</div>
        <window.SizePills value={size} onChange={setSize} size="sm" />
      </div>
      <div style={{ display: "flex", gap: 8, opacity: ready ? 1 : 0.55, transition: "opacity var(--dur-med) var(--ease-soft)" }}>
        <Button variant="primary" size="sm" icon={<Icon name="bag" size={14} />} disabled={!ready} onClick={() => ready && window.addToCart(it, size)} style={{ flex: 1, cursor: ready ? "pointer" : "not-allowed" }}>Add to Cart</Button>
        <Button variant="secondary" size="sm" disabled={!ready} onClick={() => { if (ready) { window.addToCart(it, size); window.openCheckout(); } }} style={{ cursor: ready ? "pointer" : "not-allowed" }}>Buy Now</Button>
      </div>
      <div style={{ height: 16, marginTop: 4, fontFamily: "var(--font-body)", fontSize: 11.5, color: "var(--accent-strong)", opacity: ready ? 0 : 1, transition: "opacity var(--dur-med) var(--ease-soft)" }}>Please select a size first.</div>
    </div>
  );
}

function BestSellers(props) {
  const { RibbonDivider } = window.LilyNailsStudioDesignSystem_5de5bf;
  return (
    <section style={{ padding: "var(--space-section) clamp(20px,5vw,64px) 0", background: "var(--white-warm)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHead id="best-sellers" eyebrow="Loved by Many" title="Best sellers" sub="The sets that keep selling out — designed like fine jewelry, hand-finished one at a time." />
        <ProductGrid ids={["royal-elegance", "blooming-blush", "sage-luxe"]} {...props} />
        <div style={{ marginTop: 72 }}><RibbonDivider width={200} /></div>
      </div>
    </section>
  );
}

function NewArrivals(props) {
  return (
    <section style={{ padding: "var(--space-section) clamp(20px,5vw,64px)", background: "var(--white-warm)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHead id="new-arrivals" eyebrow="Fresh Off the Studio Desk" title="New arrivals" sub="Small, limited drops in new colourways and motifs. Once they're gone, they're gone." />
        <ProductGrid ids={["peach-coquette", "pink-cateye", "ice-blue-cateye", "burgundy-ribbon", "retro-chocolate", "brown-choco", "polka-dot", "lavender-elegance", "cherry-crush", "velvet-wine"]} {...props} />
      </div>
    </section>
  );
}
function NavratriCollection(props) {
  const { Eyebrow, RibbonDivider } = window.LilyNailsStudioDesignSystem_5de5bf;
  return (
    <section id="navratri" style={{ position: "relative", overflow: "hidden", padding: "var(--space-section) clamp(20px,5vw,64px)", background: "linear-gradient(180deg, var(--white-warm), color-mix(in srgb, var(--champagne, #f3e3c8) 45%, var(--white-warm)) 55%, var(--white-warm))", scrollMarginTop: 80 }}>
      <div aria-hidden="true" style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 720, height: 260, background: "radial-gradient(closest-side, color-mix(in srgb, var(--champagne-deep, #d9b978) 40%, transparent), transparent)", pointerEvents: "none" }} />
      <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 660, margin: "0 auto 20px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "7px 18px", borderRadius: "var(--radius-pill)", background: "color-mix(in srgb, var(--champagne, #f3e3c8) 55%, var(--white-warm))", border: "1px solid var(--border-soft)", color: "var(--champagne-deep, #b9954e)", fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", marginBottom: 20 }}>Seasonal · Limited Drop</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(2.4rem,4.4vw,3.6rem)", letterSpacing: "-.01em", color: "var(--text-heading)", margin: 0, lineHeight: 1.05 }}>Navratri <span style={{ fontStyle: "italic", color: "var(--champagne-deep, #b9954e)" }}>Collection</span></h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", lineHeight: 1.6, color: "var(--text-body)", margin: "14px auto 0", maxWidth: 500, textWrap: "pretty" }}>Festive sets hand-finished to celebrate the season — intricate artistry, ribbons and charms, made in small batches.</p>
          <div style={{ marginTop: 24 }}><RibbonDivider width={170} /></div>
        </div>
        <div style={{ marginTop: 32 }}>
          <ProductGrid ids={["navratri", "navratri-n4", "navratri-n5", "navratri-bow", "navratri-n1", "navratri-n2", "navratri-n3"]} {...props} />
        </div>
      </div>
    </section>
  );
}
window.NavratriCollection = NavratriCollection;
window.SectionHead = SectionHead;
window.BestSellers = BestSellers;
window.NewArrivals = NewArrivals;
