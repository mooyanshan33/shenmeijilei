-- ============================================================
-- 完整风格数据补充
-- ============================================================
-- 使用方法：在 Supabase SQL Editor 中执行
-- ==========================================
-- 清空现有数据（可选，如果想重新开始）
-- ==========================================
-- TRUNCATE TABLE public.aesthetic_types RESTART IDENTITY;

-- ==========================================
-- 插入完整的艺术运动数据
-- ==========================================

-- 巴洛克
INSERT INTO public.aesthetic_types (name, name_en, origin, era, description, cover_image, gallery, features, related_artists, tags)
VALUES (
  '巴洛克',
  'Baroque',
  '意大利',
  '1600年代至今',
  '巴洛克艺术以戏剧性、动感与华丽装饰著称，追求强烈的情感冲击。',
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=baroque%20painting%20caravaggio%20dramatic%20light&image_size=square',
  ARRAY[
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=baroque%20architecture%20st%20peters%20basilica&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=versailles%20palace%20hall%20of%20mirrors&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bernini%20sculpture%20baroque%20dynamic&image_size=square'
  ],
  ARRAY['戏剧性光影', '动感构图', '华丽装饰', '情感张力', '宏大叙事'],
  ARRAY['卡拉瓦乔', '贝尼尼', '鲁本斯'],
  ARRAY['巴洛克', '戏剧性', '动感', '华丽', '光影', '宗教']
);

-- 洛可可
INSERT INTO public.aesthetic_types (name, name_en, origin, era, description, cover_image, gallery, features, related_artists, tags)
VALUES (
  '洛可可',
  'Rococo',
  '法国',
  '1720年代至今',
  '洛可可艺术以轻盈、精致与享乐主义为特色，是贵族优雅生活的写照。',
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=rococo%20painting%20frivolous%20elegant%20pastel&image_size=square',
  ARRAY[
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=rococo%20interior%20palace%20versailles%20france&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=rococo%20furniture%20ornate%20gilded%20wood&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=fragonard%20the%20swing%20painting&image_size=square'
  ],
  ARRAY['精致曲线', '柔和色彩', '田园主题', '享乐主义', '装饰艺术'],
  ARRAY['布歇', '弗拉戈纳尔'],
  ARRAY['洛可可', '精致', '享乐', '宫廷', '装饰', '优雅']
);

-- 新古典主义
INSERT INTO public.aesthetic_types (name, name_en, origin, era, description, cover_image, gallery, features, related_artists, tags)
VALUES (
  '新古典主义',
  'Neoclassicism',
  '欧洲/美国',
  '1750年代至今',
  '新古典主义回归希腊罗马的理性与秩序，追求庄严、简洁与永恒之美。',
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=neoclassical%20painting%20david%20oath%20horatii&image_size=square',
  ARRAY[
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=neoclassical%20architecture%20us%20capitol%20building&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=canova%20sculpture%20neoclassical%20marble&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=jacques-louis%20david%20painting%20historical&image_size=square'
  ],
  ARRAY['理性秩序', '古典主题', '简洁构图', '历史叙事', '建筑复兴'],
  ARRAY['大卫', '卡诺瓦', '安格尔'],
  ARRAY['新古典', '理性', '秩序', '罗马', '希腊', '历史']
);

-- 印象派
INSERT INTO public.aesthetic_types (name, name_en, origin, era, description, cover_image, gallery, features, related_artists, tags)
VALUES (
  '印象派',
  'Impressionism',
  '法国巴黎',
  '1860年代至今',
  '印象派捕捉瞬间的光影变化，以明亮色彩和自由笔触革新了绘画语言。',
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=impressionist%20painting%20monet%20water%20lilies&image_size=square',
  ARRAY[
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=monet%20haystacks%20different%20times%20of%20day&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=renoir%20dance%20at%20bougival%20painting&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=degas%20ballerinas%20pastel%20painting&image_size=square'
  ],
  ARRAY['光影捕捉', '明亮色彩', '自由笔触', '瞬间印象', '户外写生'],
  ARRAY['莫奈', '雷诺阿', '德加'],
  ARRAY['印象派', '光影', '色彩', '瞬间', '户外', '巴黎']
);

-- 后印象派
INSERT INTO public.aesthetic_types (name, name_en, origin, era, description, cover_image, gallery, features, related_artists, tags)
VALUES (
  '后印象派',
  'Post-Impressionism',
  '法国',
  '1880年代至今',
  '后印象派在印象派基础上更强调主观情感与形式结构，开启现代艺术之门。',
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=vangogh%20starry%20night%20painting&image_size=square',
  ARRAY[
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cezanne%20still%20life%20apples%20oranges&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gauguin%20tahitian%20women%20painting&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=vangogh%20sunflowers%20painting&image_size=square'
  ],
  ARRAY['主观色彩', '形式结构', '情感表达', '象征意味', '个人风格'],
  ARRAY['梵高', '塞尚', '高更'],
  ARRAY['后印象派', '梵高', '塞尚', '高更', '色彩', '情感']
);

-- 表现主义
INSERT INTO public.aesthetic_types (name, name_en, origin, era, description, cover_image, gallery, features, related_artists, tags)
VALUES (
  '表现主义',
  'Expressionism',
  '德国/奥地利',
  '1905年代至今',
  '表现主义以强烈的色彩与扭曲的形式表达内心的焦虑与情感爆发。',
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=edvard%20munch%20the%20scream%20painting&image_size=square',
  ARRAY[
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=kirchner%20berlin%20street%20scene%20expressionist&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=escher%20woodcut%20expressionist&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=wassily%20kandinsky%20abstract%20expressionist&image_size=square'
  ],
  ARRAY['扭曲形式', '强烈色彩', '情感爆发', '社会批判', '内心世界'],
  ARRAY['蒙克', '基希纳', '康定斯基'],
  ARRAY['表现主义', '焦虑', '扭曲', '色彩', '情感', '德国']
);

-- 野兽派
INSERT INTO public.aesthetic_types (name, name_en, origin, era, description, cover_image, gallery, features, related_artists, tags)
VALUES (
  '野兽派',
  'Fauvism',
  '法国',
  '1905年代至今',
  '野兽派以狂野大胆的色彩运用著称，色彩脱离写实成为独立的情感表达。',
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=matisse%20the%20dance%20painting%20fauvist&image_size=square',
  ARRAY[
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=matisse%20woman%20with%20hat%20fauvist%20colors&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=derain%20london%20bridge%20fauvist&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=vlaminck%20landscape%20wild%20colors&image_size=square'
  ],
  ARRAY['大胆色彩', '平涂色彩', '简化形式', '情感色彩', '视觉冲击'],
  ARRAY['马蒂斯', '德兰', '弗拉芒克'],
  ARRAY['野兽派', '色彩', '马蒂斯', '狂野', '大胆', '前卫']
);

-- 立体主义
INSERT INTO public.aesthetic_types (name, name_en, origin, era, description, cover_image, gallery, features, related_artists, tags)
VALUES (
  '立体主义',
  'Cubism',
  '法国巴黎',
  '1907年代至今',
  '立体主义拆解物体为几何碎片，从多个视角同时展现，颠覆传统透视。',
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=picasso%20les%20demoiselles%20avignon%20cubist&image_size=square',
  ARRAY[
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=braque%20analytical%20cubist%20still%20life&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=picasso%20portrait%20of%20dora%20maar%20cubist&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=juan%20gris%20synthetic%20cubism&image_size=square'
  ],
  ARRAY['几何分解', '多重视角', '平面化', '拼贴技法', '分析/综合立体主义'],
  ARRAY['毕加索', '布拉克', '胡安·格里斯'],
  ARRAY['立体主义', '毕加索', '几何', '解构', '多视角', '拼贴']
);

-- 未来主义
INSERT INTO public.aesthetic_types (name, name_en, origin, era, description, cover_image, gallery, features, related_artists, tags)
VALUES (
  '未来主义',
  'Futurism',
  '意大利',
  '1909年代至今',
  '未来主义赞美速度、机器与暴力，主张彻底抛弃传统，拥抱现代性。',
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=boccioni%20unique%20forms%20of%20continuity%20space&image_size=square',
  ARRAY[
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=carra%20futurist%20painting%20speed&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=futurist%20typography%20design%20manifesto&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=balilla%20pratella%20futurist%20music&image_size=square'
  ],
  ARRAY['速度动感', '机器美学', '动态模糊', '视觉碎片', '反叛传统'],
  ARRAY['马里内蒂', '波丘尼', '卡拉'],
  ARRAY['未来主义', '速度', '机器', '现代性', '反叛', '意大利']
);

-- 达达主义
INSERT INTO public.aesthetic_types (name, name_en, origin, era, description, cover_image, gallery, features, related_artists, tags)
VALUES (
  '达达主义',
  'Dadaism',
  '瑞士苏黎世',
  '1916年代至今',
  '达达主义以反艺术、反理性、反美学的姿态，挑战所有既定规则。',
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=marcel%20duchamp%20fountain%20readymade&image_size=square',
  ARRAY[
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dada%20photomontage%20hannah%20hoch&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=duchamp%20bicycle%20wheel%20readymade&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=tristan%20tzara%20dada%20manifesto&image_size=square'
  ],
  ARRAY['反艺术', '现成品', '拼贴', '随机', '挑衅', '虚无'],
  ARRAY['杜尚', '查拉', '汉娜·霍赫'],
  ARRAY['达达', '反艺术', '现成品', '杜尚', '随机', '挑衅']
);

-- 超现实主义
INSERT INTO public.aesthetic_types (name, name_en, origin, era, description, cover_image, gallery, features, related_artists, tags)
VALUES (
  '超现实主义',
  'Surrealism',
  '法国巴黎',
  '1924年代至今',
  '超现实主义探索梦境与潜意识，创造理性之外的奇妙视觉世界。',
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dali%20persistence%20of%20memory%20melting%20clocks&image_size=square',
  ARRAY[
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=magritte%20son%20of%20man%20apple%20painting&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=max%20ernst%20surrealist%20collage&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=breton%20surrealism%20manifesto&image_size=square'
  ],
  ARRAY['梦境元素', '潜意识', '自动写作', '奇妙组合', '错视绘画'],
  ARRAY['达利', '马格利特', '恩斯特'],
  ARRAY['超现实', '梦境', '潜意识', '达利', '马格利特', '奇妙']
);

-- 包豪斯
INSERT INTO public.aesthetic_types (name, name_en, origin, era, description, cover_image, gallery, features, related_artists, tags)
VALUES (
  '包豪斯',
  'Bauhaus',
  '德国魏玛',
  '1919年代至今',
  '包豪斯主张艺术与技术结合，追求功能主义与简洁形式，影响了整个现代设计。',
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bauhaus%20building%20gropius%20dessau&image_size=square',
  ARRAY[
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=wasilly%20kandinsky%20bauhaus%20abstract&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=marianne%20brandt%20bauhaus%20teapot&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=laszlo%20moholy-nagy%20photogram&image_size=square'
  ],
  ARRAY['功能主义', '几何形式', '基础课程', '工业设计', '国际风格'],
  ARRAY['格罗皮乌斯', '康定斯基', '密斯·凡·德·罗'],
  ARRAY['包豪斯', '功能', '几何', '设计', '现代', '建筑']
);

-- 极简主义
INSERT INTO public.aesthetic_types (name, name_en, origin, era, description, cover_image, gallery, features, related_artists, tags)
VALUES (
  '极简主义',
  'Minimalism',
  '美国纽约',
  '1960年代至今',
  '极简主义去除一切非必要元素，以纯粹的几何形式探索物的本质。',
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=donald%20judd%20minimalist%20sculpture&image_size=square',
  ARRAY[
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=ag%20martin%20minimalist%20painting&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=judd%20box%20sculptures%20specific%20objects&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dan%20flavin%20fluorescent%20light%20installation&image_size=square'
  ],
  ARRAY['几何极简', '重复序列', '工业材料', '空间探索', '非表达性'],
  ARRAY['贾德', '弗莱文', '安德烈'],
  ARRAY['极简', '几何', '重复', '工业', '客观', '极少']
);

-- 波普艺术
INSERT INTO public.aesthetic_types (name, name_en, origin, era, description, cover_image, gallery, features, related_artists, tags)
VALUES (
  '波普艺术',
  'Pop Art',
  '英国/美国',
  '1950年代至今',
  '波普艺术拥抱大众文化，将消费品、名人、漫画转化为艺术作品。',
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=andy%20warhol%20campbells%20soup%20cans&image_size=square',
  ARRAY[
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=roy%20lichtenstein%20comic%20book%20style%20painting&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=andy%20warhol%20marilyn%20monroe%20silkscreen&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=claes%20oldenburg%20soft%20sculpture&image_size=square'
  ],
  ARRAY['大众文化', '复制技法', '名人肖像', '日常物品', '商业美学'],
  ARRAY['沃霍尔', '利希滕斯坦', '奥登堡'],
  ARRAY['波普', '沃霍尔', '消费', '大众', '复制', '名人']
);
