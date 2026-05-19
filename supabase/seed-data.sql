-- ========================================
-- 审美积累 App - 初始数据
-- ========================================

-- ========================================
-- 1. 插入分类数据
-- ========================================
INSERT INTO aesthetic_categories (id, name, icon) VALUES
  ('1', '核类美学', 'radioactive'),
  ('2', '互联网美学', 'language'),
  ('3', '海洋学术', 'water'),
  ('4', '蒸汽朋克', 'settings'),
  ('5', '复古未来', 'rocket_launch'),
  ('6', '极简主义', 'check_box_outline_blank')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 2. 插入审美类型数据
-- ========================================
INSERT INTO aesthetic_types (id, name, name_en, origin, era, description, features, cover_image, gallery, related_artists, tags) VALUES
  ('1', '侘寂', 'Wabi-Sabi', '日本', '15世纪至今', 
   '侘寂是日本传统美学中最具代表性的概念之一，强调在不完美中寻找美，接受生命的无常和缺陷。它欣赏朴素、谦逊、不对称、粗糙或不规则的美，认为真正的美存在于朴素和谦逊之中。',
   ARRAY['接受不完美与无常', '欣赏自然老化过程', '简约而朴素的设计', '不对称的构图', '天然材料的使用'],
   '/aesthetic-wabi-sabi.jpg',
   ARRAY['/aesthetic-wabi-sabi.jpg'],
   ARRAY['千利休', '柳宗悦'],
   ARRAY['日本', '传统', '朴素']
  ),
  ('2', '极简主义', 'Minimalism', '西方', '1960年代至今',
   '极简主义是一种将设计元素简化到最基本形式的艺术风格。它强调"少即是多"，通过去除多余的装饰，让观者专注于作品的本质和核心内容。极简主义追求纯粹、简洁和秩序。',
   ARRAY['简洁的几何形状', '大量留白空间', '有限的色彩 palette', '功能性优先', '去除多余装饰'],
   '/aesthetic-minimalism.jpg',
   ARRAY['/aesthetic-minimalism.jpg'],
   ARRAY['Donald Judd', 'Dan Flavin'],
   ARRAY['简约', '现代', '几何']
  ),
  ('3', '赛博朋克', 'Cyberpunk', '科幻文学', '1980年代至今',
   '赛博朋克是一种融合高科技与低端生活的科幻美学风格。它以霓虹灯光、雨夜城市、人工智能和虚拟现实为视觉特征，探讨科技发展对社会和人性的影响。视觉风格通常充满未来感和颓废感。',
   ARRAY['霓虹灯光与暗色调对比', '高科技与废墟并存', '雨夜城市景观', '人机融合元素', '反乌托邦氛围'],
   '/picture/赛博朋克1.png',
   ARRAY['/picture/赛博朋克1.png', '/picture/赛博朋克2.png'],
   ARRAY['Syd Mead', 'Simon Stålenhag'],
   ARRAY['科幻', '霓虹', '未来']
  ),
  ('4', '新中式', 'Neo-Chinese', '中国', '21世纪',
   '新中式是将传统中式元素与现代设计理念相结合的美学风格。它保留了中国传统文化的精髓，如山水意境、对称布局、木质结构，同时融入现代简约的设计语言，创造出既有东方韵味又符合现代审美的空间。',
   ARRAY['传统与现代的融合', '中式元素的现代化演绎', '自然材质的运用', '意境营造', '对称与平衡'],
   '/aesthetic-neo-chinese.jpg',
   ARRAY['/aesthetic-neo-chinese.jpg'],
   ARRAY['贝聿铭', '马岩松'],
   ARRAY['中国', '传统', '现代']
  ),
  ('5', '波普艺术', 'Pop Art', '英国/美国', '1950-1970年代',
   '波普艺术是一种源于大众文化的艺术运动，它将广告、漫画和日常物品等流行文化元素融入艺术创作。波普艺术以鲜艳的色彩、大胆的图形和重复的元素为特征，挑战传统艺术的精英主义。',
   ARRAY['鲜艳的原色运用', '大众文化图像', '重复与复制', '漫画风格元素', '商业艺术手法'],
   '/aesthetic-pop-art.jpg',
   ARRAY['/aesthetic-pop-art.jpg'],
   ARRAY['Andy Warhol', 'Roy Lichtenstein'],
   ARRAY['流行', '鲜艳', '大众']
  ),
  ('6', '装饰艺术', 'Art Deco', '法国', '1920-1940年代',
   '装饰艺术是一种充满魅力和奢华感的设计风格，以其几何形状、对称图案和豪华材质著称。它代表了现代性与传统的结合，在20世纪初的建筑、家具和时尚领域产生了深远影响。',
   ARRAY['几何图案与对称', '金色与黑色的搭配', '太阳放射状图案', '奢华材质的使用', '流线型设计'],
   '/aesthetic-art-deco.jpg',
   ARRAY['/aesthetic-art-deco.jpg'],
   ARRAY['Erté', 'Tamara de Lempicka'],
   ARRAY['奢华', '几何', '复古']
  )
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 3. 插入视频数据
-- ========================================
INSERT INTO aesthetic_videos (id, title, thumbnail, video_url, duration, views, author, category) VALUES
  ('1', '什么是"核类美学"？从 Weirdcore 到 Dreamcore 的视觉奇观',
   'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
   '#', '12:45', '12.5万', '美学研究室', '核类美学'),
  ('2', '海洋学术美学：深海、神话与维多利亚时代的科学探索',
   'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&auto=format&fit=crop&q=60',
   '#', '08:20', '8.3万', '艺术漫谈', '海洋学术'),
  ('3', '互联网美学史：从 Windows 95 到 Vaporwave 的视觉演变',
   'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60',
   '#', '15:10', '20.1万', '数字考古学家', '互联网美学')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 完成提示
-- ========================================
SELECT '✅ Initial data inserted successfully!' AS message;
