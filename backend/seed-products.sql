-- Lily Nails Studio — seed products (generated from app/data.jsx)
-- Import into your Hostinger MySQL database via phpMyAdmin → Import, or paste in the SQL tab.
-- Safe to re-run: existing ids are updated, not duplicated.

INSERT INTO products (id, name, price, active) VALUES
('royal-elegance','Royal Elegance',899,1),
('blooming-blush','Blooming in Blush',799,1),
('cherry-crush','Cherry Crush Romance',699,1),
('sage-luxe','Sage Luxe Whisper',799,1),
('navratri','Navratri Nails — Monochrome Mehndi',999,1),
('velvet-wine','Velvet Wine Blossom',599,1),
('peach-coquette','Peach Coquette Ribbon & Stars',699,1),
('polka-dot','Polka Dot',599,1),
('ice-blue-cateye','Ice Blue Magnetic Cat-Eye',599,1),
('burgundy-ribbon','Burgundy Ribbon & Polka Dot',799,1),
('lavender-elegance','Lavender Elegance',499,1),
('retro-chocolate','Retro Chocolate Checker & Floral',799,1),
('pink-cateye','Pink Cat Eye',599,1),
('brown-choco','Brown Choco',699,1),
('navratri-bow','Navratri Nails — Ribbon Charm',899,1),
('navratri-n1','Navratri Nails — Silver Filigree',699,1),
('navratri-n2','Navratri Nails — Mauve Jewel',999,1),
('navratri-n3','Navratri Nails — Golden Bloom',699,1),
('navratri-n4','Navratri Nails — Crimson Charm',999,1),
('navratri-n5','Navratri Nails — Silver Cat-Eye',999,1)
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), active = 1;
