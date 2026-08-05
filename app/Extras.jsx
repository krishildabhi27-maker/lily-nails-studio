function Instagram() {
  const { Eyebrow, Button, Icon } = window.LilyNailsStudioDesignSystem_5de5bf;
  return (
    <section style={{ padding: "var(--space-section) clamp(20px,5vw,64px)", background: "var(--surface-tint)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <Eyebrow rules>@lilyystudiio</Eyebrow>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(2rem,3.6vw,3rem)", letterSpacing: "-.01em", color: "var(--text-heading)", margin: "16px 0 8px" }}>
            Follow along on Instagram
          </h2>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--text-body)", margin: 0 }}>Scan the code to see our latest nail art.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <window.GlowCard as="a" href="https://instagram.com/lilyystudiio" target="_blank" rel="noopener" glowSize={280} className="lily-qr-card" style={{ display: "block", padding: 22, borderRadius: "var(--radius-lg)", background: "var(--surface-card)", boxShadow: "var(--shadow-md)", border: "1px solid var(--border-soft)", transition: "transform var(--dur-med) var(--ease-soft), box-shadow var(--dur-med) var(--ease-soft)" }}>
            <img src={window.LILY_QR} alt="Scan to follow @lilyystudiio on Instagram" style={{ display: "block", width: "min(230px,60vw)", height: "auto", mixBlendMode: "multiply" }} />
          </window.GlowCard>
          <Button variant="secondary" size="lg" icon={<Icon name="heart" size={18} />} onClick={() => window.open("https://instagram.com/lilyystudiio", "_blank")}>@lilyystudiio</Button>
        </div>
      </div>
    </section>
  );
}

function Shipping() {
  const { Eyebrow, Icon } = window.LilyNailsStudioDesignSystem_5de5bf;
  const items = [
    { icon: "package", t: "Made to order", d: "Each set is hand-crafted after you order — please allow 3–5 days for studio time before dispatch." },
    { icon: "gift", t: "Free delivery in Ahmedabad", d: "Delivered to your door in 3–5 business days at no extra cost." },
    { icon: "heart", t: "Care & wear", d: "A full prep kit is provided with every set of nails." },
  ];
  return (
    <section style={{ padding: "var(--space-section) clamp(20px,5vw,64px)", background: "var(--white-warm)" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Eyebrow rules>Shipping & Care</Eyebrow>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(2rem,3.6vw,3rem)", letterSpacing: "-.01em", color: "var(--text-heading)", margin: "16px 0 0" }}>
            Everything, made with care
          </h2>
        </div>
        <div className="lily-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "var(--space-6)" }}>
          {items.map(x => (
            <window.GlowCard key={x.t} glowSize={320} style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: "26px 28px", borderRadius: "var(--radius-lg)", background: "var(--white-pearl)", boxShadow: "var(--shadow-xs)" }}>
              <span style={{ color: "var(--accent-strong)", flexShrink: 0 }}><Icon name={x.icon} size={26} /></span>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, color: "var(--text-heading)", marginBottom: 6 }}>{x.t}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 14.5, lineHeight: 1.6, color: "var(--text-body)", textWrap: "pretty" }}>{x.d}</div>
              </div>
            </window.GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { Eyebrow, Icon } = window.LilyNailsStudioDesignSystem_5de5bf;
  return (
    <section id="contact" style={{ padding: "var(--space-section) clamp(20px,5vw,64px)", background: "var(--surface-tint)", scrollMarginTop: 80 }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <Eyebrow rules>Say Hello</Eyebrow>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1.1, color: "var(--text-heading)", margin: "16px 0 18px" }}>
          Let's design your dream set
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--fs-body)", lineHeight: 1.7, color: "var(--text-body)", margin: "0 auto 30px", maxWidth: 480, textWrap: "pretty" }}>
          Questions about sizing, custom designs, or a special occasion? Reach out on Instagram — every message reaches the studio directly.
        </p>
        <div style={{ display: "inline-flex", flexDirection: "column", gap: 14, alignItems: "flex-start", textAlign: "left" }}>
          {[["mail", "lilyystudiio@gmail.com"], ["heart", "@lilyystudiio"], ["package", "Free delivery in Ahmedabad"]].map(([ic, tx]) => (
            <div key={tx} style={{ display: "flex", gap: 12, alignItems: "center", color: "var(--text-body)", fontFamily: "var(--font-body)", fontSize: 15 }}>
              <span style={{ color: "var(--accent-strong)", display: "flex" }}><Icon name={ic} size={20} /></span>{tx}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Instagram = Instagram;
window.Shipping = Shipping;
window.Contact = Contact;
