function Header() {
  const { Icon, IconButton } = window.LilyNailsStudioDesignSystem_5de5bf;
  const { count } = window.useCart();
  const wl = window.useWishlist();
  const [scrolled, setScrolled] = React.useState(false);
  const [menu, setMenu] = React.useState(false);
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  React.useEffect(() => { document.body.style.overflow = menu ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menu]);
  const links = [
    { l: "Best Sellers", h: "#best-sellers" },
    { l: "Navratri", h: "#navratri" },
    { l: "New Arrivals", h: "#new-arrivals" },
    { l: "Our Story", h: "#story" },
    { l: "Contact", h: "#contact" },
  ];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 40,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px clamp(20px,5vw,64px)",
      background: scrolled ? "rgba(255,253,253,.82)" : "transparent",
      backdropFilter: scrolled ? "var(--glass-blur)" : "none",
      WebkitBackdropFilter: scrolled ? "var(--glass-blur)" : "none",
      borderBottom: scrolled ? "1px solid var(--border-soft)" : "1px solid transparent",
      transition: "all var(--dur-med) var(--ease-soft)",
    }}>
      <nav className="lily-nav" style={{ display: "flex", gap: 28, flex: 1, alignItems: "center" }}>
        {links.map(x => <a key={x.l} href={x.h} style={navLink}>{x.l}</a>)}
      </nav>
      <button className="lily-burger" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(m => !m)} style={{ display: "none", flex: 1, width: 44, height: 44, minWidth: 44, border: "none", background: "none", cursor: "pointer", color: "var(--text-heading)", alignItems: "center", justifyContent: "flex-start", padding: 0 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">{menu ? <g><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></g> : <g><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></g>}</svg>
      </button>
      <a href="#top" style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, fontStyle: "italic", letterSpacing: "-.01em", lineHeight: 1, color: "var(--accent-strong)", textDecoration: "none", whiteSpace: "nowrap" }}>
        Lily Nails
      </a>
      <div style={{ display: "flex", gap: 10, flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <IconButton variant="soft" aria-label="Wishlist" onClick={() => window.openWishlist()}><Icon name="heart" size={20} /></IconButton>
          {wl.count > 0 && (
            <span aria-hidden="true" style={{ position: "absolute", top: -3, right: -3, minWidth: 19, height: 19, padding: "0 5px", borderRadius: "var(--radius-pill)", background: "var(--accent-strong)", color: "#fff", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, display: "grid", placeItems: "center", boxShadow: "var(--shadow-xs)" }}>{wl.count}</span>
          )}
        </div>
        <div style={{ position: "relative" }}>
          <IconButton variant="soft" aria-label="Bag" onClick={() => window.openCart()}><Icon name="bag" size={20} /></IconButton>
          {count > 0 && (
            <span aria-hidden="true" style={{ position: "absolute", top: -3, right: -3, minWidth: 19, height: 19, padding: "0 5px", borderRadius: "var(--radius-pill)", background: "var(--accent-strong)", color: "#fff", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, display: "grid", placeItems: "center", boxShadow: "var(--shadow-xs)" }}>{count}</span>
          )}
        </div>
      </div>
      <div className="lily-mobile-menu" onClick={() => setMenu(false)} style={{ position: "fixed", inset: 0, top: 0, zIndex: 39, background: "rgba(61,46,53,.34)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", opacity: menu ? 1 : 0, pointerEvents: menu ? "auto" : "none", transition: "opacity var(--dur-med) var(--ease-soft)" }}>
        <nav onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 0, left: 0, right: 0, background: "var(--white-warm)", borderBottom: "1px solid var(--border-soft)", boxShadow: "var(--shadow-md)", padding: "84px clamp(20px,6vw,40px) 28px", display: "grid", gap: 6, transform: menu ? "translateY(0)" : "translateY(-12px)", transition: "transform var(--dur-med) var(--ease-soft)" }}>
          {links.map(x => <a key={x.l} href={x.h} onClick={() => setMenu(false)} style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--text-heading)", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid var(--border-soft)", minHeight: 44 }}>{x.l}</a>)}
        </nav>
      </div>
    </header>
  );
}
const navLink = { fontFamily: "var(--font-body)", fontSize: 14, letterSpacing: ".02em", color: "var(--text-body)", textDecoration: "none" };
window.Header = Header;
