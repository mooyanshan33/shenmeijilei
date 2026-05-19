import type { UserProfile } from '@/types';
import { supabase } from '@/supabase/client';
import { mapSupabaseError } from '@/supabase/error';
import { avatarUrlFromSeed } from '@/lib/avatars';

const TABLE = 'profiles';

export async function getProfileById(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(mapSupabaseError(error, '获取用户资料失败'));
  }

  return {
    id: data.id,
    name: data.name,
    avatar: data.avatar && String(data.avatar).trim() ? String(data.avatar) : avatarUrlFromSeed(userId),
    bio: data.bio ?? '',
    logCount: data.log_count ?? 0,
    contributionCount: data.contribution_count ?? 0,
    favoriteCount: data.favorite_count ?? 0,
  };
}

export async function getCurrentProfile(userId: string): Promise<UserProfile> {
  return getProfileById(userId);
}

export async function updateProfile(
  userId: string,
  payload: Partial<Pick<UserProfile, 'name' | 'avatar' | 'bio'>>
) {
  const updateData: Record<string, unknown> = {};
  if (payload.name !== undefined) updateData.name = payload.name;
  if (payload.avatar !== undefined) updateData.avatar = payload.avatar;
  if (payload.bio !== undefined) updateData.bio = payload.bio;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from(TABLE)
    .update(updateData)
    .eq('id', userId)
    .select('*')
    .single();

  if (error) {
    throw new Error(mapSupabaseError(error, '更新用户资料失败'));
  }

  return {
    id: data.id,
    name: data.name,
    avatar: data.avatar ?? '',
    bio: data.bio ?? '',
    logCount: data.log_count ?? 0,
    contributionCount: data.contribution_count ?? 0,
    favoriteCount: data.favorite_count ?? 0,
  } as UserProfile;
}
