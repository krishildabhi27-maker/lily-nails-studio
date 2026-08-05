# Lily Nails Studio — Design System

A premium, feminine, editorial design system for **Lily Nails Studio**, an online boutique and creative studio for handcrafted, custom-designed press-on nails. Not a salon — a dreamy luxury beauty brand built from a genuine love of nail art. The feeling to hit everywhere: *"Beautiful nails made with love."*

Reference vibe: Dior Beauty · Rhode · Glossier · Rare Beauty · LoveShackFancy · Chanel Beauty — soft luxury, coquette / balletcore / princesscore, editorial and expensive but never childish or intimidating.

## Sources
Built **from the written brand brief only** — no codebase, Figma, or asset files were provided. All tokens, components, copy, and imagery placeholders are original interpretations of that brief. There is **no supplied logo or photography** (see Caveats).

---

## CONTENT FUNDAMENTALS
How copy is written for this brand:

- **Voice:** warm, personal, a little intimate — like a founder who genuinely loves this. Second person ("you"), occasionally first person for the story ("It started with a love of…"). Never corporate.
- **Tone:** romantic, soft, confident, inviting. Aspirational but reassuring — "luxurious without being intimidating."
- **Casing:** Headlines in Title Case or sentence case set in the serif; eyebrows and buttons in UPPERCASE with wide tracking; body in sentence case.
- **Length:** short and airy. Headlines are 2–5 words ("Wear Art. Feel Beautiful."). Body copy is 1–2 sentences, generous whitespace around it.
- **Signature words:** *handcrafted, made with love, wearable art, small-batch, limited, intention, artistry, elegant, feminine.*
- **Emoji:** none. Femininity comes from type, color, and the ribbon/pearl/sparkle motifs — never emoji.
- **Terms of endearment:** used sparingly and tastefully ("Join the list, lovely"). Don't overdo it.
- **Examples:** eyebrow "HANDCRAFTED PRESS-ON NAILS"; headline "Designed like fine jewelry"; sub "Small-batch sets, each one hand-finished and released in limited quantities."; CTA "SHOP THE COLLECTION".

---

## VISUAL FOUNDATIONS

- **Color:** soft blush-pink spectrum (petal → blush → baby → cotton candy → petal-deep) on warm white / pearl surfaces. Luxe accents in rose gold and champagne gold; neutrals in nude and soft beige. **Ink is warm plum-brown, never pure black.** Max 1–2 background tones per view (warm white + one pink or tint). Strictly avoid neon/hot pink, bright purple, dark colors, harsh black, heavy shadows.
- **Type:** display = **Cormorant Garamond** (high-fashion editorial serif, often italic for emphasis); body/UI = **Jost** (clean geometric sans, rounded, easy to read). A decorative script (**Ballet**) is available for rare flourishes only. Big editorial size contrast — large serif headlines against small, wide-tracked uppercase eyebrows.
- **Spacing & layout:** 4px base scale, but used *generously* — large spacious sections (`--space-section` ≈ 72–144px), lots of breathing room, `max-width` ~1200px containers. Asymmetrical two-column hero and about layouts. Nothing crowded.
- **Backgrounds:** soft multi-stop gradients (hero wash, blush, champagne) and flat warm-white/tint fills. No photographic full-bleed by default (photography drops into rounded frames). Subtle radial gloss highlights inside image frames. No busy patterns/textures.
- **Corners:** everything rounded — cards `--radius-lg` (28px), image frames `--radius-xl` (40px), buttons/inputs/badges fully pill.
- **Shadows:** soft, diffuse, **pink-tinted** (rgba plum), never grey/black. Scale xs→lg plus a `--shadow-glow` for button hover. No hard edges.
- **Cards:** warm-white fill, generous rounding, soft pink shadow, thin/no border. Hover lifts the card (`translateY(-6px)`) and deepens the shadow; product images zoom (`scale(1.06)`).
- **Borders:** hairline, low-contrast (`--border-soft` on pink, `--border-strong` for outlines). Used sparingly.
- **Transparency & blur:** glassmorphism for floating UI over imagery and the sticky header (`--glass-blur` = saturate + 16px blur, translucent white, thin white border). Use when an element floats over photography or the page scrolls.
- **Animation:** subtle and premium. Fade/rise-in on scroll (IntersectionObserver, 0.8s), floating bows & sparkles around the hero (`floaty` keyframe, alternating), soft hover lifts, button shine sweep, image zoom. Easing `--ease-soft`/`--ease-out`; durations 180/340/640ms. Never bouncy or distracting.
- **Hover states:** lift + shadow deepen for cards/buttons; scale(1.08) for icon buttons; gradient glow for primary buttons; image zoom for product photos.
- **Press/active:** gentle — rely on the button's natural feel; no harsh color inversion.
- **Imagery vibe (when added):** bright natural light, minimal backgrounds, white marble, silk ribbons, pearls, florals, luxury packaging, close-up nail shots. Warm, airy, Pinterest-worthy. Placed in rounded frames with soft shadow.

---

## ICONOGRAPHY
- **System:** a curated thin-line icon set (1.5px stroke, round caps, `viewBox 0 0 24 24`) exposed via the `Icon` component. Glyphs: heart, sparkles, bag, gift, star, flower, package, mail, ribbon, search, chevron — plus `HeartFilled` for the wishlist active state.
- **Source & substitution:** paths are **Lucide-derived** (ISC-licensed), chosen to match the brief's requested glyph list and premium thin-line style. If the brand adopts a licensed icon set later, swap the paths inside `components/icons/Icon.jsx`. *(Flagged substitution.)*
- **Color:** inherit via `currentColor` — set `color` on the parent (usually rose-gold).
- **Emoji / unicode as icons:** never. Icons are always the line set or `RibbonDivider`'s inline bow.
- **Decorative glyph:** the satin **bow** in `RibbonDivider` is the one intentionally hand-drawn SVG (a brand motif, not an icon).

---

## Components
Reusable primitives (`window.LilyNailsStudioDesignSystem_5de5bf.*`):

- **Button** — pill CTA, `primary` / `secondary` / `ghost`, sizes sm/md/lg, shine sweep + glow on hover.
- **IconButton** — circular action, `soft` / `glass`, `active` toggle (wishlist).
- **Badge** — uppercase status pill: `blush` / `gold` / `cream` / `ink`.
- **Eyebrow** — rose-gold tracked kicker, optional flanking rules.
- **Icon** / **HeartFilled** — thin-line glyph set.
- **Input** — pill text field, pearl fill, pink focus glow.
- **NewsletterForm** — mail icon + input + submit in one rounded shell.
- **ProductCard** — luxury collection card: 4:5 image, glass wishlist heart, badge, hover lift/zoom, Quick View.
- **RibbonDivider** — signature satin-bow section break.

## UI Kits
- **`ui_kits/website/`** — luxury marketing homepage: sticky glass header, editorial hero with floating bows, featured collection grid, brand story/about, newsletter + footer. `index.html` is interactive (wishlist toggles, scroll reveals) and is a Starting Point.

## Index / manifest (root)
- `styles.css` — the one entry consumers link (`@import`s all tokens + fonts).
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `fonts.css`.
- `components/` — `core/`, `icons/`, `forms/`, `product/`, `brand/` (each: `.jsx` + `.d.ts` + `.prompt.md` + one `@dsCard` HTML).
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Effects).
- `ui_kits/website/` — homepage kit.
- `thumbnail.html` — homepage tile. `SKILL.md` — portable Agent Skill wrapper.

## Intentional additions
- **Icon / HeartFilled** — no glyph set was supplied; added a Lucide-derived thin-line set because the brief explicitly requires premium line icons.
- **RibbonDivider / Eyebrow** — brand-motif primitives added to express the coquette/editorial direction the brief centers on.

## Caveats
- **No logo supplied** — the wordmark "Lily *Nails*" is rendered in Cormorant Garamond wherever a mark would go. No logo was drawn. Provide a real logo to replace it.
- **No photography** — product/lifestyle images are blush/champagne gradient placeholders. Drop real editorial nail photography into `ProductCard image` and the hero/about frames.
- **Fonts are Google Fonts substitutes** (Cormorant Garamond, Jost, Ballet) loaded via `@import`, not licensed brand files. Swap the `@font-face`/`@import` in `tokens/fonts.css` if the brand has its own faces.
