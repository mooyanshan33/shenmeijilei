import { useState, useCallback } from 'react';
import { supabase } from '@/supabase/client';
import type { Comment, PublishCommentInput } from './types';

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select(`
          *,
          author:profiles(*)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setComments((data as Comment[]) || []);
    } catch (e) {
      setIsError(true);
      setError(e instanceof Error ? e.message : '获取评论失败');
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const publishComment = useCallback(async (input: PublishCommentInput): Promise<Comment> => {
    const { data, error: insertError } = await supabase
      .from('comments')
      .insert({
        post_id: input.post_id,
        content: input.content
      })
      .select(`
        *,
        author:profiles(*)
      `)
      .single();

    if (insertError) throw new Error(insertError.message);

    setComments((prev) => [...prev, data as Comment]);
    return data as Comment;
  }, []);

  const deleteComment = useCallback(async (commentId: string) => {
    const { error: deleteError } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (deleteError) throw new Error(deleteError.message);

    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }, []);

  return {
    comments,
    isLoading,
    isError,
    error,
    fetchComments,
    publishComment,
    deleteComment
  };
}
