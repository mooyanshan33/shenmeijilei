import { useState, useCallback } from 'react';
import { supabase } from '@/supabase/client';
import type {
  PostWithMeta,
  PublishPostInput,
  ToggleLikeResult,
  CreateReportInput
} from './types';
import { useAuth } from './useAuth';

// ==========================================
// 辅助函数
// ==========================================
function mapPostWithMeta(
  item: Record<string, unknown>,
  currentUserId: string | null
): PostWithMeta {
  const likes = (item.likes as unknown[]) || [];
  const comments = (item.comments as unknown[]) || [];
  const isLikedByMe = currentUserId
    ? likes.some((like: any) => like.user_id === currentUserId)
    : false;

  return {
    id: item.id as string,
    author_id: item.author_id as string,
    image_url: item.image_url as string,
    content: item.content as string | undefined,
    tags: (item.tags as string[]) || [],
    status: (item.status as 'published' | 'under_review' | 'hidden') || 'published',
    created_at: item.created_at as string,
    author: item.author as any,
    likes_count: likes.length,
    comments_count: comments.length,
    is_liked_by_me: isLikedByMe
  };
}

// ==========================================
// Hook
// ==========================================
export function useWorkshop() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(*),
          likes(*),
          comments(id)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        // 数据库未就绪时使用示例帖预览，不阻断界面
        console.warn('[Workshop] 远程帖子加载失败，使用示例数据:', fetchError.message);
        setPosts([]);
        return;
      }

      const mappedPosts = (data || []).map((item) =>
        mapPostWithMeta(item, user?.id || null)
      );

      setPosts(mappedPosts);
    } catch (e) {
      console.warn('[Workshop] 远程帖子加载异常，使用示例数据:', e);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const publishPost = useCallback(
    async (input: PublishPostInput): Promise<PostWithMeta> => {
      if (!isAuthenticated || !user) {
        throw new Error('请先登录');
      }

      const { data, error: insertError } = await supabase
        .from('posts')
        .insert({
          author_id: user.id,
          image_url: input.image_url,
          content: input.content,
          tags: input.tags,
          status: 'published'
        })
        .select(`
          *,
          author:profiles(*),
          likes(*),
          comments(id)
        `)
        .single();

      if (insertError) throw new Error(insertError.message);

      const newPost = mapPostWithMeta(data, user.id);
      setPosts((prev) => [newPost, ...prev]);
      return newPost;
    },
    [isAuthenticated, user]
  );

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    if (!isAuthenticated || !user) {
      throw new Error('请先登录');
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('workshop_images')
      .upload(path, file, { upsert: false });

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage
      .from('workshop_images')
      .getPublicUrl(path);

    return data.publicUrl;
  }, [isAuthenticated, user]);

  const toggleLike = useCallback(
    async (postId: string): Promise<ToggleLikeResult> => {
      if (!isAuthenticated || !user) {
        throw new Error('请先登录');
      }

      // 1. 乐观更新
      const currentPost = posts.find((p) => p.id === postId);
      if (!currentPost) throw new Error('帖子不存在');

      const wasLiked = currentPost.is_liked_by_me;
      const newLikesCount = wasLiked
        ? currentPost.likes_count - 1
        : currentPost.likes_count + 1;

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                is_liked_by_me: !wasLiked,
                likes_count: newLikesCount
              }
            : p
        )
      );

      try {
        // 2. 执行数据库操作
        if (wasLiked) {
          const { error: deleteError } = await supabase
            .from('likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', user.id);

          if (deleteError) throw deleteError;
        } else {
          const { error: insertError } = await supabase
            .from('likes')
            .insert({
              post_id: postId,
              user_id: user.id
            });

          if (insertError) throw insertError;
        }

        return {
          post_id: postId,
          liked: !wasLiked,
          new_likes_count: newLikesCount
        };
      } catch (e) {
        // 3. 失败时回滚
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  is_liked_by_me: wasLiked,
                  likes_count: currentPost.likes_count
                }
              : p
          )
        );
        throw e;
      }
    },
    [isAuthenticated, user, posts]
  );

  const deletePost = useCallback(
    async (postId: string) => {
      if (!isAuthenticated) {
        throw new Error('请先登录');
      }

      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (deleteError) throw new Error(deleteError.message);

      setPosts((prev) => prev.filter((p) => p.id !== postId));
    },
    [isAuthenticated]
  );

  const hidePost = useCallback(
    async (postId: string) => {
      const { error: updateError } = await supabase
        .from('posts')
        .update({ status: 'hidden' })
        .eq('id', postId);

      if (updateError) throw new Error(updateError.message);

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, status: 'hidden' } : p
        )
      );
    },
    []
  );

  const createReport = useCallback(
    async (input: CreateReportInput) => {
      if (!isAuthenticated || !user) {
        throw new Error('请先登录');
      }

      const { error: insertError } = await supabase
        .from('reports')
        .insert({
          reporter_id: user.id,
          post_id: input.post_id,
          comment_id: input.comment_id,
          reason: input.reason,
          status: 'pending'
        });

      if (insertError) throw new Error(insertError.message);
    },
    [isAuthenticated, user]
  );

  return {
    posts,
    isLoading,
    isError,
    error,
    fetchPosts,
    publishPost,
    uploadImage,
    toggleLike,
    deletePost,
    hidePost,
    createReport
  };
}
