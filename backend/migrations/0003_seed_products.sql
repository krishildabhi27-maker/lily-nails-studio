-- Seed — products price list. Prices in WHOLE rupees, ids must match the frontend
-- app/data.jsx product ids exactly. Upsert so re-running updates prices in place.
insert into public.products (id, name, price, active) values
  ('royal-elegance',   'Royal Elegance',                     899, true),
  ('blooming-blush',   'Blooming in Blush',                  799, true),
  ('sage-luxe',        'Sage Luxe Whisper',                  799, true),
  ('cherry-crush',     'Cherry Crush Romance',               699, true),
  ('velvet-wine',      'Velvet Wine Blossom',                599, true),
  ('peach-coquette',   'Peach Coquette Ribbon & Stars',      699, true),
  ('polka-dot',        'Polka Dot',                          599, true),
  ('ice-blue-cateye',  'Ice Blue Magnetic Cat-Eye',          599, true),
  ('burgundy-ribbon',  'Burgundy Ribbon & Polka Dot',        799, true),
  ('lavender-elegance','Lavender Elegance',                  499, true),
  ('retro-chocolate',  'Retro Chocolate Checker & Floral',   799, true),
  ('pink-cateye',      'Pink Cat Eye',                       599, true),
  ('brown-choco',      'Brown Choco',                        699, true),
  -- Navratri collection
  ('navratri',         'Navratri Nails — Monochrome Mehndi',  999, true),
  ('navratri-bow',     'Navratri Nails — Ribbon Charm',       899, true),
  ('navratri-n1',      'Navratri Nails — Silver Filigree',    699, true),
  ('navratri-n2',      'Navratri Nails — Mauve Jewel',        999, true),
  ('navratri-n3',      'Navratri Nails — Golden Bloom',       699, true),
  ('navratri-n4',      'Navratri Nails — Crimson Charm',      999, true),
  ('navratri-n5',      'Navratri Nails — Silver Cat-Eye',     999, true)
on conflict (id) do update
  set name = excluded.name, price = excluded.price, active = excluded.active;
