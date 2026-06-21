-- ==========================================
-- 审美分类数据插入脚本
-- ==========================================

-- 清空现有数据（可选）
-- DELETE FROM aesthetic_types;
-- DELETE FROM aesthetic_subcategories;
-- DELETE FROM aesthetic_categories;

-- 插入分类
INSERT INTO aesthetic_categories (id, name, name_en) VALUES
('classical', '经典美学', 'Classical Aesthetics'),
('art-movements', '艺术运动', 'Art Movements'),
('design-interior', '设计与空间', 'Design & Interior'),
('internet', '互联网美学', 'Internet Aesthetics'),
('mood-scene', '情绪与场景', 'Mood & Scene'),
('eastern-regional', '东方与地域', 'Eastern & Regional')
ON CONFLICT (id) DO NOTHING;

-- 插入子分类
INSERT INTO aesthetic_subcategories (id, category_id, name, name_en) VALUES
-- 经典美学
('classical-core', 'classical', '西方古典', 'Western Classical'),
('eastern-classical', 'classical', '东方古典', 'Eastern Classical'),
-- 艺术运动
('historical-art', 'art-movements', '历史艺术', 'Historical Art'),
('modern-art', 'art-movements', '现代艺术', 'Modern Art'),
('contemporary-art', 'art-movements', '当代艺术', 'Contemporary Art'),
-- 设计与空间
('architecture', 'design-interior', '建筑设计', 'Architecture'),
('graphic-design', 'design-interior', '平面设计', 'Graphic Design'),
-- 互联网美学
('retro-tech', 'internet', '复古科技', 'Retro Tech'),
('y2k', 'internet', 'Y2K体系', 'Y2K'),
('retro-internet', 'internet', '互联网怀旧', 'Internet Nostalgia'),
('dream-weird', 'internet', '梦境怪异', 'Dream & Weird'),
('nature-core', 'internet', '自然系', 'Nature Cores'),
('academic', 'internet', '学院系', 'Academic'),
('feminine', 'internet', '少女系', 'Feminine'),
('street-youth', 'internet', '街头青年', 'Street & Youth'),
('futurist', 'internet', '未来主义', 'Futurist'),
-- 情绪与场景
('mood', 'mood-scene', '情绪', 'Mood'),
('scene', 'mood-scene', '场景', 'Scene'),
('time-season', 'mood-scene', '时间季节', 'Time & Season'),
-- 东方与地域
('chinese', 'eastern-regional', '中国', 'Chinese'),
('japanese', 'eastern-regional', '日本', 'Japanese'),
('korean', 'eastern-regional', '韩国', 'Korean'),
('western-regional', 'eastern-regional', '西方地域', 'Western Regional')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 完成！现在运行数据导入脚本（在 Node.js 中）
-- ==========================================
