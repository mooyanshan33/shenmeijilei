-- ============================================================
-- 互联网美学数据补充
-- ============================================================
-- 使用方法：在 Supabase SQL Editor 中执行

-- 蒸汽波
INSERT INTO public.aesthetic_types (name, name_en, origin, era, description, cover_image, gallery, features, related_artists, tags)
VALUES (
  '蒸汽波',
  'Vaporwave',
  '互联网',
  '2010年代至今',
  '蒸汽波将80/90年代消费文化、日本City Pop与古希腊美学拼贴成怀旧梦境。',
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=vaporwave%20aesthetic%20palm%20tree%20sunset&image_size=square',
  ARRAY[
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=macintosh%20plus%20floral%20shoppe%20cover&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=vaporwave%20sculpture%20statue%20greek%20glitch&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=vaporwave%20mall%20interior%2090s%20aesthetic&image_size=square'
  ],
  ARRAY['复古科技', '希腊雕塑', '日文元素', '渐变色彩', '赛博怀旧'],
  ARRAY['Macintosh Plus', 'Vektroid'],
  ARRAY['蒸汽波', '复古', '赛博', '80年代', '日本', '雕塑']
);

-- 合成波
INSERT INTO public.aesthetic_types (name, name_en, origin, era, description, cover_image, gallery, features, related_artists, tags)
VALUES (
  '合成波',
  'Synthwave',
  '互联网',
  '2010年代至今',
  '合成波将80年代合成器音乐、赛博朋克视觉与怀旧未来主义融为一体。',
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=synthwave%2080s%20retro%20sunset%20neon%20grid&image_size=square',
  ARRAY[
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=outrun%20retrowave%20neon%20grid%20horizon&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=synthwave%20testarossa%20car%20retro&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=new%20retro%20wave%20album%20cover&image_size=square'
  ],
  ARRAY['80年代复古', '霓虹灯光', '网格地平线', '未来怀旧', '电子音乐'],
  ARRAY['New Retro Wave', 'Carpenter Brut'],
  ARRAY['合成波', '80年代', '霓虹', '赛博', '怀旧', '未来']
);
