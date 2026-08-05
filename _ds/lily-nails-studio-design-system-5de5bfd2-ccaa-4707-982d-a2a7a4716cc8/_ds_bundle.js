/* @ds-bundle: {"format":4,"namespace":"LilyNailsStudioDesignSystem_5de5bf","components":[{"name":"RibbonDivider","sourcePath":"components/brand/RibbonDivider.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"NewsletterForm","sourcePath":"components/forms/NewsletterForm.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"},{"name":"HeartFilled","sourcePath":"components/icons/Icon.jsx"},{"name":"ProductCard","sourcePath":"components/product/ProductCard.jsx"}],"sourceHashes":{"components/brand/RibbonDivider.jsx":"cb92c61c7033","components/core/Badge.jsx":"2e98efe77833","components/core/Button.jsx":"48ed642c9b6e","components/core/Eyebrow.jsx":"4901a5a54507","components/core/IconButton.jsx":"3ab9bb2e0381","components/forms/Input.jsx":"09c1ba6e18f1","components/forms/NewsletterForm.jsx":"6d111d950736","components/icons/Icon.jsx":"a1d8535f9506","components/product/ProductCard.jsx":"f444f733dd61","ui_kits/website/About.jsx":"78a0602e7a83","ui_kits/website/Collection.jsx":"154c879ae94e","ui_kits/website/Footer.jsx":"ea87bc9094e4","ui_kits/website/Header.jsx":"ec2add924ccb","ui_kits/website/Hero.jsx":"636fa5d468c6"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.LilyNailsStudioDesignSystem_5de5bf = window.LilyNailsStudioDesignSystem_5de5bf || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/RibbonDivider.jsx
try { (() => {
/** Decorative ribbon/bow section divider — a hairline rule tied with a satin bow. */
function RibbonDivider({
  width = 220,
  color = "var(--pink-deep)",
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      color,
      ...style
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      height: 1,
      width,
      background: "linear-gradient(90deg,transparent,currentColor)"
    }
  }), /*#__PURE__*/React.createElement("svg", {
    width: "34",
    height: "26",
    viewBox: "0 0 34 26",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17 13c-3-5-10-8-13-5s2 8 13 5Zm0 0c3-5 10-8 13-5s-2 8-13 5Z",
    fill: "currentColor",
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "13",
    r: "2.4",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 14l-3 10 5-3 5 3-3-10",
    fill: "currentColor",
    opacity: "0.75"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      height: 1,
      width,
      background: "linear-gradient(270deg,transparent,currentColor)"
    }
  }));
}
Object.assign(__ds_scope, { RibbonDivider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/RibbonDivider.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
/** Small pill label for product cards — Handmade, Best Seller, Limited Edition, etc. */
function Badge({
  children,
  tone = "blush",
  style = {}
}) {
  const tones = {
    blush: {
      background: "var(--pink-blush)",
      color: "var(--ink-900)"
    },
    gold: {
      background: "var(--grad-champagne)",
      color: "#fff"
    },
    cream: {
      background: "var(--white-cream)",
      color: "var(--accent-strong)",
      border: "1px solid var(--pink-deep)"
    },
    ink: {
      background: "var(--ink-900)",
      color: "var(--pink-baby)"
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      fontFamily: "var(--font-body)",
      fontSize: "var(--fs-caption)",
      fontWeight: "var(--fw-medium)",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      padding: "6px 14px",
      borderRadius: "var(--radius-pill)",
      boxShadow: "var(--shadow-xs)",
      ...tones[tone],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Rounded pill button with soft pink gradient and shine-on-hover. */
function Button({
  children,
  variant = "primary",
  size = "md",
  icon = null,
  disabled = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "10px 22px",
      fontSize: "13px"
    },
    md: {
      padding: "15px 34px",
      fontSize: "14px"
    },
    lg: {
      padding: "19px 46px",
      fontSize: "15px"
    }
  };
  const base = {
    fontFamily: "var(--font-body)",
    fontWeight: "var(--fw-medium)",
    letterSpacing: "var(--ls-button)",
    textTransform: "uppercase",
    borderRadius: "var(--radius-pill)",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    position: "relative",
    overflow: "hidden",
    transition: "transform var(--dur-med) var(--ease-soft), box-shadow var(--dur-med) var(--ease-soft)",
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: "var(--grad-button)",
      color: "#fff",
      boxShadow: "var(--shadow-sm)"
    },
    secondary: {
      background: "var(--white-warm)",
      color: "var(--accent-strong)",
      boxShadow: "var(--shadow-xs)",
      border: "1px solid var(--pink-deep)"
    },
    ghost: {
      background: "transparent",
      color: "var(--text-heading)",
      border: "1px solid var(--border-strong)"
    }
  };
  const [hover, setHover] = React.useState(false);
  const glow = hover && !disabled ? {
    transform: "translateY(-2px)",
    boxShadow: variant === "primary" ? "var(--shadow-glow)" : "var(--shadow-sm)"
  } : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    style: {
      ...base,
      ...variants[variant],
      ...glow,
      ...style
    },
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 0,
      left: hover ? "120%" : "-60%",
      width: "40%",
      height: "100%",
      background: "linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent)",
      transition: "left var(--dur-slow) var(--ease-out)",
      pointerEvents: "none"
    }
  }), icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
/** Uppercase tracked eyebrow label, optionally flanked by hairlines. */
function Eyebrow({
  children,
  rules = false,
  style = {}
}) {
  const label = /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--fs-eyebrow)",
      fontWeight: "var(--fw-medium)",
      letterSpacing: "var(--ls-eyebrow)",
      textTransform: "uppercase",
      color: "var(--accent-strong)",
      whiteSpace: "nowrap"
    }
  }, children);
  if (!rules) return /*#__PURE__*/React.createElement("span", {
    style: style
  }, label);
  const rule = /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: "var(--border-strong)",
      opacity: 0.5
    }
  });
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      ...style
    }
  }, rule, label, rule);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Small circular icon button — for favorite/wishlist/bag actions. */
function IconButton({
  children,
  variant = "soft",
  active = false,
  size = 44,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const variants = {
    soft: {
      background: "var(--white-warm)",
      color: active ? "var(--accent-strong)" : "var(--text-body)",
      boxShadow: "var(--shadow-xs)"
    },
    glass: {
      background: "rgba(255,255,255,.55)",
      backdropFilter: "var(--glass-blur)",
      WebkitBackdropFilter: "var(--glass-blur)",
      color: active ? "var(--accent-strong)" : "var(--text-heading)",
      border: "var(--glass-border)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    style: {
      width: size,
      height: size,
      borderRadius: "var(--radius-pill)",
      border: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "transform var(--dur-fast) var(--ease-soft), box-shadow var(--dur-med) var(--ease-soft)",
      transform: hover ? "scale(1.08)" : "scale(1)",
      boxShadow: hover ? "var(--shadow-sm)" : undefined,
      ...variants[variant],
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Soft rounded text input with pearl fill and rose-gold focus ring. */
function Input({
  label,
  type = "text",
  placeholder = "",
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      fontFamily: "var(--font-body)",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "var(--fs-caption)",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      marginBottom: 8
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    placeholder: placeholder,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: "100%",
      boxSizing: "border-box",
      padding: "15px 20px",
      fontFamily: "var(--font-body)",
      fontSize: "var(--fs-body)",
      color: "var(--text-body)",
      background: "var(--white-pearl)",
      border: `1px solid ${focus ? "var(--pink-deep)" : "var(--border-soft)"}`,
      borderRadius: "var(--radius-pill)",
      outline: "none",
      boxShadow: focus ? "0 0 0 4px rgba(244,184,206,.28)" : "none",
      transition: "border-color var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast) var(--ease-soft)"
    }
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/icons/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Thin-line premium icon set (1.5px stroke, round caps) — Lucide-derived paths,
   curated to the brief's glyphs. Renders inline so components stay self-contained. */
const PATHS = {
  heart: "M19 8.5c0 4-7 9.5-7 9.5S5 12.5 5 8.5A3.5 3.5 0 0 1 12 6a3.5 3.5 0 0 1 7 2.5Z",
  sparkles: "M12 4l1.4 3.6L17 9l-3.6 1.4L12 14l-1.4-3.6L7 9l3.6-1.4L12 4Z M18 14l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z",
  bag: "M6 8h12l-1 11H7L6 8Z M9 8V6a3 3 0 0 1 6 0v2",
  gift: "M4 11h16v9H4v-9Z M4 8h16v3H4V8Z M12 8v12 M12 8s-1.5-4-4-4-2 3 0 4h4Zm0 0s1.5-4 4-4 2 3 0 4h-4Z",
  star: "M12 4l2.2 4.9 5.3.5-4 3.6 1.2 5.2L12 15.9 7.3 18.2l1.2-5.2-4-3.6 5.3-.5L12 4Z",
  flower: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z M12 9c0-3 1.5-5 0-5s0 2 0 5Zm0 6c0 3-1.5 5 0 5s0-2 0-5Zm3-3c3 0 5-1.5 5 0s-2 0-5 0Zm-6 0c-3 0-5-1.5-5 0s2 0 5 0Z",
  package: "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z M4 7.5l8 4.5 8-4.5 M12 12v9",
  mail: "M4 6h16v12H4V6Z M4 7l8 6 8-6",
  ribbon: "M12 12a3 3 0 1 0 0-.01Z M12 11c-2-3-6-4-7-2s2 4 7 3Zm0 0c2-3 6-4 7-2s-2 4-7 3Z M11 13l-2 7 3-2 3 2-2-7",
  search: "M11 11m-6 0a6 6 0 1 0 12 0 6 6 0 1 0-12 0 M20 20l-4.3-4.3",
  chevron: "M9 6l6 6-6 6"
};
function Icon({
  name,
  size = 22,
  stroke = 1.5,
  style = {},
  ...rest
}) {
  const d = PATHS[name] || PATHS.sparkles;
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: "block",
      flexShrink: 0,
      ...style
    },
    "aria-hidden": "true"
  }, rest), d.split(" M").map((seg, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: i === 0 ? seg : "M" + seg
  })));
}

/** Solid-fill heart for the wishlist active state. */
function HeartFilled({
  size = 22,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    style: {
      display: "block",
      ...style
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M19 8.5c0 4-7 9.5-7 9.5S5 12.5 5 8.5A3.5 3.5 0 0 1 12 6a3.5 3.5 0 0 1 7 2.5Z"
  }));
}
Object.assign(__ds_scope, { Icon, HeartFilled });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/forms/NewsletterForm.jsx
try { (() => {
/** Inline email capture — pill input joined to a gradient submit button. */
function NewsletterForm({
  placeholder = "Your email address",
  cta = "Join the List",
  onSubmit = () => {},
  style = {}
}) {
  const [val, setVal] = React.useState("");
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onSubmit(val);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      background: "var(--white-warm)",
      padding: 8,
      borderRadius: "var(--radius-pill)",
      border: `1px solid ${focus ? "var(--pink-deep)" : "var(--border-soft)"}`,
      boxShadow: focus ? "0 0 0 4px rgba(244,184,206,.25)" : "var(--shadow-xs)",
      transition: "box-shadow var(--dur-fast) var(--ease-soft), border-color var(--dur-fast) var(--ease-soft)",
      maxWidth: 460,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent)",
      paddingLeft: 12,
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "mail",
    size: 20
  })), /*#__PURE__*/React.createElement("input", {
    value: val,
    placeholder: placeholder,
    onChange: e => setVal(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "var(--font-body)",
      fontSize: "var(--fs-body)",
      color: "var(--text-body)",
      minWidth: 0
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    type: "submit",
    size: "sm"
  }, cta));
}
Object.assign(__ds_scope, { NewsletterForm });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/NewsletterForm.jsx", error: String((e && e.message) || e) }); }

// components/product/ProductCard.jsx
try { (() => {
/** Luxury product card — large rounded image, floating wishlist, badge, name, price, quick view on hover. */
function ProductCard({
  name = "Ballet Blush",
  price = "$32",
  badge = null,
  badgeTone = "blush",
  image = null,
  wished = false,
  onWish = () => {},
  onQuickView = () => {},
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: "100%",
      background: "var(--surface-card)",
      borderRadius: "var(--radius-lg)",
      padding: "14px 14px 22px",
      boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
      transform: hover ? "translateY(-6px)" : "none",
      transition: "transform var(--dur-med) var(--ease-soft), box-shadow var(--dur-med) var(--ease-soft)",
      fontFamily: "var(--font-body)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      aspectRatio: "4 / 5",
      background: image ? undefined : "var(--grad-blush)"
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transform: hover ? "scale(1.06)" : "scale(1)",
      transition: "transform var(--dur-slow) var(--ease-out)"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      placeItems: "center",
      height: "100%",
      color: "rgba(255,255,255,.8)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "sparkles",
    size: 40,
    stroke: 1
  })), badge && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 12,
      left: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: badgeTone
  }, badge)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 12,
      right: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    variant: "glass",
    active: wished,
    onClick: onWish,
    "aria-label": "Add to wishlist"
  }, wished ? /*#__PURE__*/React.createElement(__ds_scope.HeartFilled, {
    size: 20
  }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "heart",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 12,
      right: 12,
      bottom: 12,
      opacity: hover ? 1 : 0,
      transform: hover ? "translateY(0)" : "translateY(10px)",
      transition: "opacity var(--dur-med) var(--ease-soft), transform var(--dur-med) var(--ease-soft)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onQuickView,
    style: {
      width: "100%",
      padding: "12px",
      border: "none",
      borderRadius: "var(--radius-pill)",
      background: "rgba(255,255,255,.75)",
      backdropFilter: "var(--glass-blur)",
      WebkitBackdropFilter: "var(--glass-blur)",
      fontFamily: "var(--font-body)",
      fontSize: "13px",
      fontWeight: "var(--fw-medium)",
      letterSpacing: "var(--ls-button)",
      textTransform: "uppercase",
      color: "var(--text-heading)",
      cursor: "pointer"
    }
  }, "Quick View"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginTop: 18,
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-display)",
      fontWeight: "var(--fw-medium)",
      fontSize: "var(--fs-h4)",
      color: "var(--text-heading)",
      lineHeight: 1.1
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--fs-body)",
      color: "var(--accent-strong)",
      fontWeight: "var(--fw-medium)",
      whiteSpace: "nowrap"
    }
  }, price)));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/ProductCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/About.jsx
try { (() => {
function About() {
  const {
    Eyebrow,
    Button,
    Icon
  } = window.LilyNailsStudioDesignSystem_5de5bf;
  const points = [{
    icon: "ribbon",
    t: "Handcrafted",
    d: "Every set is finished by hand — no mass production, ever."
  }, {
    icon: "sparkles",
    t: "Made with love",
    d: "A passion project born from a genuine obsession with nail art."
  }, {
    icon: "gift",
    t: "Quality over quantity",
    d: "Small, limited releases so each design stays special."
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--space-section) clamp(20px,5vw,64px)",
      background: "var(--surface-tint)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1080,
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: ".95fr 1.05fr",
      gap: "clamp(32px,6vw,80px)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "1/1",
      borderRadius: "var(--radius-xl)",
      background: "var(--grad-champagne)",
      boxShadow: "var(--shadow-md)",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontStyle: "italic",
      color: "rgba(255,255,255,.9)",
      fontSize: 20
    }
  }, "Studio portrait")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Our Story"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 500,
      fontSize: "clamp(2rem,4vw,3rem)",
      lineHeight: 1.1,
      color: "var(--text-heading)",
      margin: "16px 0 20px"
    }
  }, "It started with a love of beautiful nails"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--fs-body-lg)",
      lineHeight: 1.7,
      color: "var(--text-body)",
      margin: "0 0 30px"
    }
  }, "Lily Nails Studio isn't a salon \u2014 it's a little creative studio built entirely out of passion. Every collection is designed with patience, artistry, and an almost obsessive attention to detail, so that wearing them feels like wearing a tiny piece of art."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 18,
      marginBottom: 32
    }
  }, points.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.t,
    style: {
      display: "flex",
      gap: 16,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--accent-strong)",
      flexShrink: 0,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: p.icon,
    size: 24
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      color: "var(--text-heading)",
      fontSize: 16
    }
  }, p.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      color: "var(--text-body)",
      fontSize: 15,
      lineHeight: 1.5
    }
  }, p.d))))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Read the Full Story"))));
}
window.About = About;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/About.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Collection.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionHead({
  eyebrow,
  title,
  sub
}) {
  const {
    Eyebrow
  } = window.LilyNailsStudioDesignSystem_5de5bf;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      maxWidth: 620,
      margin: "0 auto 48px"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    rules: true
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 500,
      fontSize: "clamp(2.2rem,4vw,3.25rem)",
      letterSpacing: "-.01em",
      color: "var(--text-heading)",
      margin: "16px 0 0"
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--fs-body)",
      lineHeight: 1.6,
      color: "var(--text-body)",
      margin: "14px 0 0"
    }
  }, sub));
}
function Collection() {
  const {
    ProductCard,
    RibbonDivider
  } = window.LilyNailsStudioDesignSystem_5de5bf;
  const [w, setW] = React.useState({});
  const t = k => setW(s => ({
    ...s,
    [k]: !s[k]
  }));
  const items = [{
    name: "Ballet Blush",
    price: "$34",
    badge: "Best Seller",
    badgeTone: "gold"
  }, {
    name: "Pearl Coquette",
    price: "$38",
    badge: "Limited Edition",
    badgeTone: "blush"
  }, {
    name: "Champagne Kiss",
    price: "$36",
    badge: "New Collection",
    badgeTone: "cream"
  }, {
    name: "Rosewater",
    price: "$32",
    badge: "Handmade",
    badgeTone: "blush"
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--space-section) clamp(20px,5vw,64px)",
      background: "var(--white-warm)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Featured Collection",
    title: "Designed like fine jewelry",
    sub: "Small-batch sets, each one hand-finished and released in limited quantities."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: "var(--space-6)"
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement(ProductCard, _extends({
    key: i
  }, it, {
    wished: w[i],
    onWish: () => t(i)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 64
    }
  }, /*#__PURE__*/React.createElement(RibbonDivider, {
    width: 200
  }))));
}
window.SectionHead = SectionHead;
window.Collection = Collection;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Collection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
function Footer() {
  const {
    NewsletterForm,
    Icon,
    RibbonDivider
  } = window.LilyNailsStudioDesignSystem_5de5bf;
  const cols = [{
    h: "Shop",
    links: ["Best Sellers", "New Arrivals", "Limited Edition", "Custom Sets", "Gift Cards"]
  }, {
    h: "Studio",
    links: ["Our Story", "Care Instructions", "Why Press-On", "Gallery", "Contact"]
  }, {
    h: "Help",
    links: ["Shipping", "Returns", "Sizing Guide", "FAQ"]
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--white-warm)",
      borderTop: "1px solid var(--border-soft)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--grad-blush)",
      padding: "clamp(48px,7vw,84px) clamp(20px,5vw,64px)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: "var(--font-display)",
      fontStyle: "italic",
      fontWeight: 500,
      fontSize: "clamp(1.9rem,3.5vw,2.6rem)",
      color: "var(--text-heading)",
      margin: "0 0 10px"
    }
  }, "Join the list, lovely"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      color: "var(--text-body)",
      margin: "0 0 26px"
    }
  }, "Early access to new drops, restocks & studio secrets."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(NewsletterForm, {
    cta: "Join"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: "0 auto",
      padding: "clamp(48px,6vw,72px) clamp(20px,5vw,64px) 32px",
      display: "grid",
      gridTemplateColumns: "1.4fr repeat(3,1fr)",
      gap: "clamp(24px,5vw,56px)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 26,
      fontWeight: 600,
      color: "var(--text-heading)"
    }
  }, "Lily ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: "italic",
      color: "var(--accent-strong)"
    }
  }, "Nails")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      color: "var(--text-muted)",
      fontSize: 14,
      lineHeight: 1.6,
      maxWidth: 240,
      margin: "12px 0 18px"
    }
  }, "Handcrafted press-on nails, made with love in small batches."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      color: "var(--accent-strong)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "inherit"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 20
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "inherit"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "heart",
    size: 20
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "inherit"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "star",
    size: 20
  })))), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 12,
      letterSpacing: "var(--ls-eyebrow)",
      textTransform: "uppercase",
      color: "var(--accent-strong)",
      marginBottom: 16
    }
  }, c.h), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 10
    }
  }, c.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      fontFamily: "var(--font-body)",
      fontSize: 14,
      color: "var(--text-body)",
      textDecoration: "none"
    }
  }, l)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1120,
      margin: "0 auto",
      padding: "0 clamp(20px,5vw,64px) 40px"
    }
  }, /*#__PURE__*/React.createElement(RibbonDivider, {
    width: 140
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontFamily: "var(--font-body)",
      fontSize: 12.5,
      color: "var(--text-muted)",
      marginTop: 20
    }
  }, "\xA9 2026 Lily Nails Studio \xB7 Made with love")));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
function Header() {
  const {
    Icon,
    IconButton
  } = window.LilyNailsStudioDesignSystem_5de5bf;
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const el = document.getElementById("kit-scroll") || window;
    const on = () => setScrolled((document.getElementById("kit-scroll")?.scrollTop || window.scrollY) > 20);
    el.addEventListener("scroll", on);
    return () => el.removeEventListener("scroll", on);
  }, []);
  const links = ["Collections", "Best Sellers", "New Arrivals", "About", "Gallery"];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "18px clamp(20px,5vw,64px)",
      background: scrolled ? "rgba(255,253,253,.8)" : "transparent",
      backdropFilter: scrolled ? "var(--glass-blur)" : "none",
      WebkitBackdropFilter: scrolled ? "var(--glass-blur)" : "none",
      borderBottom: scrolled ? "1px solid var(--border-soft)" : "1px solid transparent",
      transition: "all var(--dur-med) var(--ease-soft)"
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 30,
      flex: 1
    }
  }, links.slice(0, 3).map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: navLink
  }, l))), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 26,
      fontWeight: 600,
      letterSpacing: "-.01em",
      color: "var(--text-heading)",
      textDecoration: "none",
      whiteSpace: "nowrap"
    }
  }, "Lily ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: "italic",
      color: "var(--accent-strong)"
    }
  }, "Nails")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      ...navLink,
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 20
  })), /*#__PURE__*/React.createElement(IconButton, {
    variant: "soft"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "heart",
    size: 20
  })), /*#__PURE__*/React.createElement(IconButton, {
    variant: "soft"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bag",
    size: 20
  }))));
}
const navLink = {
  fontFamily: "var(--font-body)",
  fontSize: 14,
  letterSpacing: ".02em",
  color: "var(--text-body)",
  textDecoration: "none"
};
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
function FloatBits() {
  // floating bows / sparkles / pearls around the hero
  const {
    Icon
  } = window.LilyNailsStudioDesignSystem_5de5bf;
  const bits = [{
    name: "ribbon",
    top: "12%",
    left: "8%",
    size: 30,
    dur: 7,
    color: "var(--pink-deep)"
  }, {
    name: "sparkles",
    top: "22%",
    right: "12%",
    size: 26,
    dur: 5,
    color: "var(--champagne-deep)"
  }, {
    name: "heart",
    top: "68%",
    left: "14%",
    size: 22,
    dur: 6,
    color: "var(--rose-gold)"
  }, {
    name: "flower",
    top: "74%",
    right: "18%",
    size: 28,
    dur: 8,
    color: "var(--pink-deep)"
  }, {
    name: "star",
    top: "40%",
    left: "4%",
    size: 18,
    dur: 6.5,
    color: "var(--champagne-deep)"
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, bits.map((b, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: "absolute",
      top: b.top,
      left: b.left,
      right: b.right,
      color: b.color,
      opacity: .8,
      animation: `floaty ${b.dur}s var(--ease-soft) ${i * 0.4}s infinite alternate`,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: b.name,
    size: b.size
  }))));
}
function Hero() {
  const {
    Button,
    Eyebrow
  } = window.LilyNailsStudioDesignSystem_5de5bf;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      overflow: "hidden",
      background: "var(--grad-hero)",
      padding: "clamp(60px,9vw,120px) clamp(20px,5vw,64px) clamp(80px,10vw,140px)"
    }
  }, /*#__PURE__*/React.createElement(FloatBits, null), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1.05fr .95fr",
      gap: "clamp(32px,5vw,72px)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Handcrafted Press-On Nails"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 500,
      fontSize: "clamp(3.2rem,7vw,6rem)",
      lineHeight: 1.02,
      letterSpacing: "-.01em",
      color: "var(--text-heading)",
      margin: "18px 0 0"
    }
  }, "Wear Art.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: "italic",
      color: "var(--accent-strong)"
    }
  }, "Feel Beautiful.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--fs-body-lg)",
      lineHeight: 1.6,
      color: "var(--text-body)",
      maxWidth: 440,
      margin: "26px 0 34px"
    }
  }, "Every set is designed and hand-finished with intention \u2014 wearable art made with genuine love, so you feel confident, elegant, and unmistakably you."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg"
  }, "Shop the Collection"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg"
  }, "Our Story"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "4/5",
      borderRadius: "var(--radius-xl)",
      background: "var(--grad-blush)",
      boxShadow: "var(--shadow-lg)",
      overflow: "hidden",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(circle at 30% 25%,rgba(255,255,255,.6),transparent 60%)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontStyle: "italic",
      fontSize: 22,
      color: "rgba(255,255,255,.9)",
      textAlign: "center",
      padding: 24
    }
  }, "Editorial nail", /*#__PURE__*/React.createElement("br", null), "photography"))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

__ds_ns.RibbonDivider = __ds_scope.RibbonDivider;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.NewsletterForm = __ds_scope.NewsletterForm;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.HeartFilled = __ds_scope.HeartFilled;

__ds_ns.ProductCard = __ds_scope.ProductCard;

})();
