// Blush spotlight card — the cursor-tracking glow interaction, retuned to the
// Lily Nails palette (soft pink / rose-gold, no neon, no dark backdrop).
(function () {
  const CSS = `
  .lily-glow{position:relative;isolation:isolate}
  .lily-glow::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:1.5px;
    background:radial-gradient(var(--glow-size,240px) var(--glow-size,240px) at var(--gx,50%) var(--gy,0%),
      var(--rose-gold,#c8879a),transparent 70%);
    -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite:xor;mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    mask-composite:exclude;opacity:0;transition:opacity var(--dur-med,.34s) var(--ease-soft,ease);pointer-events:none;z-index:2}
  .lily-glow::after{content:"";position:absolute;inset:0;border-radius:inherit;
    background:radial-gradient(var(--glow-size,240px) var(--glow-size,240px) at var(--gx,50%) var(--gy,0%),
      var(--pink-100,#ffe6f0),transparent 60%);
    opacity:0;transition:opacity var(--dur-med,.34s) var(--ease-soft,ease);pointer-events:none;z-index:0;mix-blend-mode:multiply}
  .lily-glow:hover::before{opacity:.9}
  .lily-glow:hover::after{opacity:.55}
  .lily-glow>*{position:relative;z-index:1}`;
  const s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s);

  function GlowCard({ children, className = "", style = {}, glowSize = 240, as = "div", ...rest }) {
    const ref = React.useRef(null);
    const onMove = React.useCallback((e) => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--gx", (e.clientX - r.left) + "px");
      el.style.setProperty("--gy", (e.clientY - r.top) + "px");
    }, []);
    return React.createElement(as, {
      ref, onPointerMove: onMove,
      className: ("lily-glow " + className).trim(),
      style: { "--glow-size": glowSize + "px", ...style },
      ...rest,
    }, children);
  }
  window.GlowCard = GlowCard;
})();
