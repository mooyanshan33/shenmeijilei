import type { Contribution, ContributionComment } from '@/types';
import { supabase } from '@/supabase/client';
import { mapSupabaseError } from '@/supabase/error';

const TABLE = 'contributions';
const LIKES_TABLE = 'likes';
const COMMENTS_TABLE = 'contribution_comments';

function mapContribution(item: Record<string, unknown>): Contribution {
  return {
    id: item.id as string,
    userId: item.user_id as string,
    userName: item.user_name as string,
    userAvatar: item.user_avatar as string,
    imageUrl: item.image_url as string,
    caption: item.caption as string,
    tags: item.tags as string[],
    likes: item.likes as number,
    isLiked: false,
    comments: item.comments as number,
    createdAt: item.created_at as string,
  };
}

export async function listContributions() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(mapSupabaseError(error, '获取投稿列表失败'));
  }

  return (data ?? []).map(mapContribution);
}

export async function createContribution(
  payload: Omit<Contribution, 'id' | 'isLiked'>
) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      user_id: payload.userId,
      user_name: payload.userName,
      user_avatar: payload.userAvatar,
      image_url: payload.imageUrl,
      caption: payload.caption,
      tags: payload.tags,
      likes: payload.likes,
      comments: payload.comments,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(mapSupabaseError(error, '创建投稿失败'));
  }

  return mapContribution(data);
}

export async function toggleLike(contributionId: string, userId: string) {
  const { data: existingLike, error: fetchError } = await supabase
    .from(LIKES_TABLE)
    .select('id')
    .eq('contribution_id', contributionId)
    .eq('user_id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error(mapSupabaseError(fetchError, '查询点赞失败'));
  }

  if (existingLike) {
    const { error } = await supabase
      .from(LIKES_TABLE)
      .delete()
      .eq('id', existingLike.id);

    if (error) {
      throw new Error(mapSupabaseError(error, '取消点赞失败'));
    }

    const { data: updated } = await supabase
      .from(TABLE)
      .select('likes')
      .eq('id', contributionId)
      .single();

    return { liked: false, likes: updated?.likes ?? 0 };
  } else {
    const { error } = await supabase.from(LIKES_TABLE).insert({
      contribution_id: contributionId,
      user_id: userId,
    });

    if (error) {
      throw new Error(mapSupabaseError(error, '点赞失败'));
    }

    const { data: updated } = await supabase
      .from(TABLE)
      .select('likes')
      .eq('id', contributionId)
      .single();

    return { liked: true, likes: updated?.likes ?? 0 };
  }
}

export async function listLikedContributionIds(userId: string) {
  const { data, error } = await supabase
    .from(LIKES_TABLE)
    .select('contribution_id')
    .eq('user_id', userId);

  if (error) {
    throw new Error(mapSupabaseError(error, '获取点赞列表失败'));
  }

  return new Set<string>((data ?? []).map((x) => x.contribution_id as string));
}

function mapComment(item: Record<string, unknown>): ContributionComment {
  return {
    id: item.id as string,
    contributionId: item.contribution_id as string,
    userId: item.user_id as string,
    userName: item.user_name as string,
    userAvatar: (item.user_avatar as string) ?? '',
    content: item.content as string,
    createdAt: item.created_at as string,
  };
}

export async function listContributionComments(contributionId: string) {
  const { data, error } = await supabase
    .from(COMMENTS_TABLE)
    .select('*')
    .eq('contribution_id', contributionId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(mapSupabaseError(error, '获取评论失败'));
  }

  return (data ?? []).map(mapComment);
}

export async function createContributionComment(payload: {
  contributionId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
}) {
  const { data, error } = await supabase
    .from(COMMENTS_TABLE)
    .insert({
      contribution_id: payload.contributionId,
      user_id: payload.userId,
      user_name: payload.userName,
      user_avatar: payload.userAvatar,
      content: payload.content,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(mapSupabaseError(error, '发表评论失败'));
  }

  return mapComment(data);
}

export async function deleteContributionComment(commentId: string, userId: string) {
  const { error } = await supabase
    .from(COMMENTS_TABLE)
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(mapSupabaseError(error, '删除评论失败'));
  }
}

export async function deleteContribution(contributionId: string, userId: string) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', contributionId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(mapSupabaseError(error, '删除投稿失败'));
  }
}

export async function updateContribution(
  contributionId: string,
  userId: string,
  payload: Partial<Pick<Contribution, 'caption' | 'tags'>>
) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      caption: payload.caption,
      tags: payload.tags,
    })
    .eq('id', contributionId)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) {
    throw new Error(mapSupabaseError(error, '更新投稿失败'));
  }

  return mapContribution(data);
}
