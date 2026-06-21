import type {
  AestheticType,
  AestheticCategory,
  AestheticVideo,
  ColorPalette,
  RepresentativeArtist,
  RepresentativeWork,
  TimelineEntry,
} from '@/types';
import { supabase } from '@/supabase/client';
import { mapSupabaseError } from '@/supabase/error';
import { resolveStorageImageUrl } from '@/lib/gallery';

const TYPES_TABLE = 'aesthetic_types';
const CATEGORIES_TABLE = 'aesthetic_categories';
const VIDEOS_TABLE = 'aesthetic_videos';

function mapAestheticType(item: Record<string, unknown>): AestheticType {
  return {
    id: item.id as string,
    nameCn: (item.name_cn ?? item.name) as string,
    nameEn: item.name_en as string,
    coverImage: resolveStorageImageUrl(item.cover_image as string),
    galleryImages: ((item.gallery_images ?? item.gallery ?? []) as string[]).map(resolveStorageImageUrl),
    summary: (item.summary ?? item.description ?? '') as string,
    origin: (item.origin ?? '') as string,
    history: (item.history ?? '') as string,
    keyFeatures: (item.key_features ?? item.features ?? []) as string[],
    colorPalette: (item.color_palette ?? []) as ColorPalette[],
    keywords: (item.keywords ?? item.tags ?? []) as string[],
    representativeArtists: (item.representative_artists ?? []) as RepresentativeArtist[],
    representativeWorks: (item.representative_works ?? []) as RepresentativeWork[],
    relatedAesthetics: (item.related_aesthetics ?? []) as string[],
    timeline: (item.timeline ?? []) as TimelineEntry[],
    popularityScore: (item.popularity_score ?? 0) as number,
    communityPostsCount: (item.community_posts_count ?? 0) as number,
    categoryId: (item.category_id ?? '') as string,
    subcategoryId: item.subcategory_id as string | undefined,
    moodTags: (item.mood_tags ?? []) as string[],
    era: (item.era ?? '') as string,
    region: (item.region ?? '') as string,
  };
}

function mapAestheticCategory(item: Record<string, unknown>): AestheticCategory {
  return {
    id: item.id as string,
    name: item.name as string,
    nameEn: (item.name_en ?? item.name) as string,
    icon: item.icon as string | undefined,
    subcategories: [],
  };
}

function mapAestheticVideo(item: Record<string, unknown>): AestheticVideo {
  return {
    id: item.id as string,
    title: item.title as string,
    thumbnail: item.thumbnail as string,
    videoUrl: item.video_url as string,
    duration: item.duration as string,
    views: item.views as string,
    author: item.author as string,
    category: item.category as string,
  };
}

export async function listAestheticTypes() {
  const { data, error } = await supabase
    .from(TYPES_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(mapSupabaseError(error, '获取审美类型失败'));
  }

  return (data ?? []).map(mapAestheticType);
}

export async function searchAestheticTypes(query: string) {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) {
    return listAestheticTypes();
  }

  const { data, error } = await supabase
    .from(TYPES_TABLE)
    .select('*')
    .or(`name_cn.ilike.%${normalizedQuery}%,name_en.ilike.%${normalizedQuery}%,summary.ilike.%${normalizedQuery}%,keywords.cs.{${normalizedQuery}}`);

  if (error) {
    throw new Error(mapSupabaseError(error, '搜索审美类型失败'));
  }

  return (data ?? []).map(mapAestheticType);
}

export async function listAestheticCategories() {
  const { data, error } = await supabase
    .from(CATEGORIES_TABLE)
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    throw new Error(mapSupabaseError(error, '获取分类失败'));
  }

  return (data ?? []).map(mapAestheticCategory);
}

export async function listAestheticVideos() {
  const { data, error } = await supabase
    .from(VIDEOS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(mapSupabaseError(error, '获取视频失败'));
  }

  return (data ?? []).map(mapAestheticVideo);
}

export async function getAestheticTypeById(id: string) {
  const { data, error } = await supabase
    .from(TYPES_TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(mapSupabaseError(error, '获取审美类型详情失败'));
  }

  return mapAestheticType(data);
}
