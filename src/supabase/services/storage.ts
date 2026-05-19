import { supabase } from '@/supabase/client';
import { mapSupabaseError } from '@/supabase/error';

const DEFAULT_BUCKET = 'contribution-images';
const AVATAR_BUCKET = 'avatars';
const LOG_BUCKET = 'log-images';

export async function uploadContributionImage(file: File, userId: string) {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(DEFAULT_BUCKET)
    .upload(path, file, { upsert: false });

  if (error) {
    throw new Error(mapSupabaseError(error, '上传图片失败'));
  }

  const { data } = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadAvatarImage(file: File, userId: string) {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${userId}/${Date.now()}.${ext}`;

  const primary = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, { upsert: false });

  if (primary.error) {
    const fallback = await supabase.storage
      .from(DEFAULT_BUCKET)
      .upload(`avatars/${path}`, file, { upsert: false });

    if (fallback.error) {
      throw new Error(mapSupabaseError(primary.error, '上传头像失败'));
    }

    const { data } = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(`avatars/${path}`);
    return data.publicUrl;
  }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadLogImage(file: File, userId: string) {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${userId}/${Date.now()}.${ext}`;

  const primary = await supabase.storage
    .from(LOG_BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type || undefined });

  if (primary.error) {
    const fallback = await supabase.storage
      .from(DEFAULT_BUCKET)
      .upload(`logs/${path}`, file, { upsert: false, contentType: file.type || undefined });

    if (fallback.error) {
      throw new Error(mapSupabaseError(primary.error, '上传图片失败'));
    }

    const { data } = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(`logs/${path}`);
    return data.publicUrl;
  }

  const { data } = supabase.storage.from(LOG_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
