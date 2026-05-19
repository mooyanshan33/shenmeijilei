import type { AestheticLog } from '@/types';
import { supabase } from '@/supabase/client';
import { mapSupabaseError } from '@/supabase/error';

const TABLE = 'aesthetic_logs';

function mapLog(item: Record<string, unknown>): AestheticLog {
  return {
    id: item.id as string,
    userId: item.user_id as string,
    date: item.date as string,
    content: item.content as string,
    imageUrl: item.image_url as string | undefined,
    tags: item.tags as string[],
    createdAt: item.created_at as string,
  };
}

export async function listAestheticLogs() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    throw new Error(mapSupabaseError(error, '获取日志列表失败'));
  }

  return (data ?? []).map(mapLog);
}

export async function createAestheticLog(
  payload: Omit<AestheticLog, 'id' | 'createdAt'>
) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      user_id: payload.userId,
      date: payload.date,
      content: payload.content,
      image_url: payload.imageUrl,
      tags: payload.tags,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(mapSupabaseError(error, '创建日志失败'));
  }

  return mapLog(data);
}

export async function updateAestheticLog(
  id: string,
  payload: Partial<Omit<AestheticLog, 'id' | 'createdAt'>>
) {
  const updateData: Record<string, unknown> = {};
  
  if (payload.userId !== undefined) updateData.user_id = payload.userId;
  if (payload.date !== undefined) updateData.date = payload.date;
  if (payload.content !== undefined) updateData.content = payload.content;
  if (payload.imageUrl !== undefined) updateData.image_url = payload.imageUrl;
  if (payload.tags !== undefined) updateData.tags = payload.tags;

  const { data, error } = await supabase
    .from(TABLE)
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(mapSupabaseError(error, '更新日志失败'));
  }

  return mapLog(data);
}

export async function deleteAestheticLog(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);

  if (error) {
    throw new Error(mapSupabaseError(error, '删除日志失败'));
  }

  return true;
}
