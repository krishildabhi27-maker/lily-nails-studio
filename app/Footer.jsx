function Footer() {
  const { NewsletterForm, Icon, RibbonDivider } = window.LilyNailsStudioDesignSystem_5de5bf;
  const [joined, setJoined] = React.useState(false);
  const cols = [
    { h: "Shop", links: ["Best Sellers", "New Arrivals", "Limited Edition", "Custom Sets", "Gift Cards"] },
    { h: "Studio", links: ["Our Story", "Care Instructions", "Why Press-On", "Instagram", "Contact"] },
    { h: "Help", links: ["Shipping", "Returns", "Sizing Guide", "FAQ"] },
  ];
  return (
    <footer style={{ background: "var(--white-warm)", borderTop: "1px solid var(--border-soft)" }}>
      <div style={{ background: "var(--grad-blush)", padding: "clamp(48px,7vw,84px) clamp(20px,5vw,64px)", textAlign: "center" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.9rem,3.5vw,2.6rem)", color: "var(--text-heading)", margin: "0 0 10px" }}>
          Join the list, lovely
        </h3>
        <p style={{ fontFamily: "var(--font-body)", color: "var(--text-body)", margin: "0 0 26px" }}>
          Early access to new drops, restocks & studio secrets.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <NewsletterForm cta={joined ? "Joined ♥" : "Join"} onSubmit={() => setJoined(true)} />
        </div>
      </div>
      <div className="lily-foot-grid" style={{ maxWidth: 1120, margin: "0 auto", padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px) 32px", display: "grid", gridTemplateColumns: "1.4fr repeat(3,1fr)", gap: "clamp(24px,5vw,56px)" }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, color: "var(--text-heading)" }}>
            Lily <span style={{ fontStyle: "italic", color: "var(--accent-strong)" }}>Nails</span>
          </div>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, maxWidth: 240, margin: "12px 0 18px" }}>
            Handcrafted press-on nails, made with love in small batches.
          </p>
          <div style={{ display: "flex", gap: 14, color: "var(--accent-strong)" }}>
            <a href="#" style={{ color: "inherit" }} aria-label="Email"><Icon name="mail" size={20} /></a>
            <a href="#" style={{ color: "inherit" }} aria-label="Instagram"><Icon name="heart" size={20} /></a>
            <a href="#" style={{ color: "inherit" }} aria-label="Reviews"><Icon name="star" size={20} /></a>
          </div>
        </div>
        {cols.map(c => (
          <div key={c.h}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", color: "var(--accent-strong)", marginBottom: 16 }}>{c.h}</div>
            <div style={{ display: "grid", gap: 10 }}>
              {c.links.map(l => <a key={l} href="#" style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-body)", textDecoration: "none" }}>{l}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 clamp(20px,5vw,64px) 40px" }}>
        <RibbonDivider width={140} />
        <div style={{ textAlign: "center", fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--text-muted)", marginTop: 20 }}>
          © 2026 Lily Nails Studio · Made with love
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
