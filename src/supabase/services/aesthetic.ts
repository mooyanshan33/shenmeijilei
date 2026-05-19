import type { AestheticType, AestheticCategory, AestheticVideo } from '@/types';
import { supabase } from '@/supabase/client';
import { mapSupabaseError } from '@/supabase/error';

const TYPES_TABLE = 'aesthetic_types';
const CATEGORIES_TABLE = 'aesthetic_categories';
const VIDEOS_TABLE = 'aesthetic_videos';

function mapAestheticType(item: Record<string, unknown>): AestheticType {
  return {
    id: item.id as string,
    name: item.name as string,
    nameEn: item.name_en as string,
    origin: item.origin as string,
    era: item.era as string,
    description: item.description as string,
    features: item.features as string[],
    coverImage: item.cover_image as string,
    gallery: item.gallery as string[],
    relatedArtists: item.related_artists as string[],
    tags: item.tags as string[],
  };
}

function mapAestheticCategory(item: Record<string, unknown>): AestheticCategory {
  return {
    id: item.id as string,
    name: item.name as string,
    icon: item.icon as string | undefined,
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
    .or(`name.ilike.%${normalizedQuery}%,name_en.ilike.%${normalizedQuery}%,description.ilike.%${normalizedQuery}%,tags.cs.{${normalizedQuery}}`);

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
