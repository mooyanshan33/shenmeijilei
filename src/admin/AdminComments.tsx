import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { Trash2, MessageSquare, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  post?: {
    id: string;
    image_url: string;
  };
}

export function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:author_id (id, username, avatar_url),
          post:post_id (id, image_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data as Comment[]);
    } catch (error) {
      console.error('获取评论失败:', error);
      toast.error('获取评论失败');
    } finally {
      setLoading(false);
    }
  }

  async function deleteComment(commentId: string) {
    if (!confirm('确定要删除这条评论吗？')) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast.success('评论已删除');
    } catch (error) {
      console.error('删除评论失败:', error);
      toast.error('删除失败');
    }
  }

  const filteredComments = comments.filter(comment =>
    comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.author?.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4 p-4 border border-border rounded-lg">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="搜索评论..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* 评论列表 */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            没有找到评论
          </div>
        ) : (
          filteredComments.map(comment => (
            <div key={comment.id} className="flex gap-4 p-4 border border-border rounded-lg hover:bg-card transition-colors">
              <img
                src={comment.author?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt={comment.author?.username}
                className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
              />
              {comment.post && (
                <img
                  src={comment.post.image_url}
                  alt="相关帖子"
                  className="w-12 h-12 rounded-lg flex-shrink-0 object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">
                      {comment.author?.username || '匿名用户'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(comment.created_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    删除
                  </button>
                </div>
                <p className="text-sm text-foreground/80 mt-2">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
