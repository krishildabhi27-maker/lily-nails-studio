function FloatBits() {
  const { Icon } = window.LilyNailsStudioDesignSystem_5de5bf;
  const bits = [
    { name: "ribbon", top: "14%", left: "6%", size: 30, dur: 7, color: "var(--pink-deep)" },
    { name: "sparkles", top: "20%", right: "10%", size: 26, dur: 5, color: "var(--champagne-deep)" },
    { name: "heart", top: "66%", left: "12%", size: 22, dur: 6, color: "var(--rose-gold)" },
    { name: "flower", top: "72%", right: "16%", size: 28, dur: 8, color: "var(--pink-deep)" },
    { name: "star", top: "42%", left: "3%", size: 18, dur: 6.5, color: "var(--champagne-deep)" },
    { name: "sparkles", top: "82%", right: "40%", size: 18, dur: 7.5, color: "var(--rose-gold)" },
  ];
  return (
    <>
      {bits.map((b, i) => (
        <span key={i} style={{
          position: "absolute", top: b.top, left: b.left, right: b.right,
          color: b.color, opacity: .8,
          animation: `floaty ${b.dur}s var(--ease-soft) ${i * 0.4}s infinite alternate`,
          pointerEvents: "none",
        }}><Icon name={b.name} size={b.size} /></span>
      ))}
    </>
  );
}

function Hero() {
  const { Button, Eyebrow } = window.LilyNailsStudioDesignSystem_5de5bf;
  const hero = window.LILY_PRODUCTS[0];
  return (
    <section id="top" style={{ position: "relative", overflow: "hidden", background: "var(--grad-hero)", padding: "clamp(48px,7vw,96px) clamp(20px,5vw,64px) clamp(80px,10vw,140px)" }}>
      <FloatBits />
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: "clamp(32px,5vw,72px)", alignItems: "center" }} className="lily-hero-grid">
        <div>
          <Eyebrow>Handcrafted Press-On Nails</Eyebrow>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(3rem,7vw,5.75rem)", lineHeight: 1.02, letterSpacing: "-.01em", color: "var(--text-heading)", margin: "18px 0 0" }}>
            Pretty Nails,<br /><span style={{ fontStyle: "italic", color: "var(--accent-strong)" }}>Pretty Mood.</span>
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body-lg)", lineHeight: 1.6, color: "var(--text-body)", maxWidth: 452, margin: "26px 0 34px" }}>
            A little studio built entirely out of love for nail art. Every set is designed and hand-finished in small batches — wearable art made to make you feel confident, elegant, and unmistakably you.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Button variant="primary" size="lg" onClick={() => document.getElementById("best-sellers").scrollIntoView({ behavior: "smooth" })}>Shop the Collection</Button>
            <Button variant="secondary" size="lg" onClick={() => document.getElementById("story").scrollIntoView({ behavior: "smooth" })}>Our Story</Button>
          </div>
          <div style={{ display: "flex", gap: 28, marginTop: 40, flexWrap: "wrap" }}>
            {[["Handmade", "in small batches"], ["Reusable", "with proper care"], ["Custom", "sizing available"]].map(([a, b]) => (
              <div key={a}>
                <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 22, color: "var(--accent-strong)" }}>{a}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)" }}>{b}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", aspectRatio: "4/5", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
          <img src={hero.image} alt={hero.name} loading="eager" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 28% 22%,rgba(255,255,255,.35),transparent 55%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: 18, bottom: 18, right: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 20px", borderRadius: "var(--radius-pill)", background: "rgba(255,255,255,.62)", backdropFilter: "var(--glass-blur)", WebkitBackdropFilter: "var(--glass-blur)", border: "var(--glass-border)" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--text-heading)" }}>{hero.name}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--text-muted)" }}>Best Seller</div>
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--accent-strong)" }}>{hero.price}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
window.Hero = Hero;
