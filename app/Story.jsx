function WhyPressOn() {
  const { Eyebrow, Icon } = window.LilyNailsStudioDesignSystem_5de5bf;
  const points = [
    { icon: "sparkles", t: "Salon-worthy in minutes", d: "Full, flawless nails at home in under ten minutes — no appointment, no dry time, no smudges." },
    { icon: "gift", t: "Reusable & kind to nails", d: "Applied with care, each set can be worn again and again — no drills, no damage to your natural nail." },
    { icon: "flower", t: "Truly one of a kind", d: "Every set is hand-painted and sculpted, so no two are ever exactly alike — wearable, tiny artwork." },
    { icon: "package", t: "Made to fit you", d: "Custom sizing and shapes on request, delivered in a keepsake box with everything you need to apply." },
  ];
  return (
    <section style={{ padding: "var(--space-section) clamp(20px,5vw,64px)", background: "var(--surface-tint)" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Eyebrow rules>Why Press-On</Eyebrow>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(2.2rem,4vw,3.25rem)", letterSpacing: "-.01em", color: "var(--text-heading)", margin: "16px 0 0" }}>
            All the artistry, none of the wait
          </h2>
        </div>
        <div className="lily-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "var(--space-6)" }}>
          {points.map(p => (
            <window.GlowCard key={p.t} style={{ background: "var(--surface-card)", borderRadius: "var(--radius-lg)", padding: "32px 26px", boxShadow: "var(--shadow-sm)", textAlign: "center" }}>
              <div style={{ width: 58, height: 58, margin: "0 auto 18px", borderRadius: "var(--radius-pill)", background: "var(--grad-blush)", display: "grid", placeItems: "center", color: "var(--accent-strong)" }}>
                <Icon name={p.icon} size={26} />
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 600, color: "var(--text-heading)", marginBottom: 8 }}>{p.t}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.6, color: "var(--text-body)", textWrap: "pretty" }}>{p.d}</div>
            </window.GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const { Eyebrow, Button, Icon } = window.LilyNailsStudioDesignSystem_5de5bf;
  const points = [
    { icon: "ribbon", t: "Handcrafted", d: "Every set is finished by hand — no mass production, ever." },
    { icon: "sparkles", t: "Made with love", d: "A passion project born from a genuine obsession with nail art." },
    { icon: "gift", t: "Quality over quantity", d: "Small, limited releases so each design stays special." },
  ];
  return (
    <section id="story" style={{ padding: "var(--space-section) clamp(20px,5vw,64px)", background: "var(--white-warm)", scrollMarginTop: 80 }}>
      <div className="lily-story-grid" style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: ".95fr 1.05fr", gap: "clamp(32px,6vw,80px)", alignItems: "center" }}>
        <div style={{ position: "relative", aspectRatio: "1/1", borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
          <img src={window.LILY_IMG("royal-elegance")} alt="Lily Nails Studio press-on set" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 20%,rgba(255,255,255,.28),transparent 55%)" }} />
        </div>
        <div>
          <Eyebrow>Our Story</Eyebrow>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1.1, color: "var(--text-heading)", margin: "16px 0 20px" }}>
            It started with a love of beautiful nails
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body-lg)", lineHeight: 1.7, color: "var(--text-body)", margin: "0 0 30px", textWrap: "pretty" }}>
            Lily Nails Studio isn't a salon — it's a little creative studio built entirely out of passion. Every collection is designed with patience, artistry, and an almost obsessive attention to detail, so wearing them feels like wearing a tiny piece of art.
          </p>
          <div style={{ display: "grid", gap: 18, marginBottom: 32 }}>
            {points.map(p => (
              <div key={p.t} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ color: "var(--accent-strong)", flexShrink: 0, marginTop: 2 }}><Icon name={p.icon} size={24} /></span>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--text-heading)", fontSize: 16 }}>{p.t}</div>
                  <div style={{ fontFamily: "var(--font-body)", color: "var(--text-body)", fontSize: 15, lineHeight: 1.5 }}>{p.d}</div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="primary" onClick={() => document.getElementById("best-sellers").scrollIntoView({ behavior: "smooth" })}>Shop the Collection</Button>
        </div>
      </div>
    </section>
  );
}
window.WhyPressOn = WhyPressOn;
window.About = About;
