import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { Trash2, Eye, MoreVertical, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Post {
  id: string;
  author_id: string;
  image_url: string;
  content?: string;
  tags: string[];
  status: 'published' | 'hidden' | 'under_review';
  created_at: string;
  author?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'hidden' | 'under_review'>('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:author_id (id, username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data as Post[]);
    } catch (error) {
      console.error('获取帖子失败:', error);
      toast.error('获取帖子失败');
    } finally {
      setLoading(false);
    }
  }

  async function togglePostStatus(postId: string, newStatus: 'published' | 'hidden' | 'under_review') {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ status: newStatus })
        .eq('id', postId);

      if (error) throw error;

      setPosts(prev => prev.map(post =>
        post.id === postId ? { ...post, status: newStatus } : post
      ));

      toast.success(`帖子状态已更新为: ${getStatusText(newStatus)}`);
    } catch (error) {
      console.error('更新帖子失败:', error);
      toast.error('更新失败');
    }
  }

  async function deletePost(postId: string) {
    if (!confirm('确定要删除这个帖子吗？此操作不可撤销！')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(prev => prev.filter(post => post.id !== postId));
      toast.success('帖子已删除');
    } catch (error) {
      console.error('删除帖子失败:', error);
      toast.error('删除失败');
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.author?.username.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4 p-4 border border-border rounded-lg">
            <Skeleton className="w-24 h-24 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 顶部筛选 */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索帖子..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">所有状态</option>
          <option value="published">已发布</option>
          <option value="hidden">已隐藏</option>
          <option value="under_review">审核中</option>
        </select>
      </div>

      {/* 帖子列表 */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            没有找到帖子
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="flex gap-4 p-4 border border-border rounded-lg hover:bg-card transition-colors">
              <img
                src={post.image_url}
                alt="帖子图片"
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">
                      {post.author?.username || '匿名用户'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.created_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <span className={cn(
                    'px-2 py-1 text-xs rounded-full',
                    post.status === 'published' && 'bg-green-100 text-green-700',
                    post.status === 'hidden' && 'bg-red-100 text-red-700',
                    post.status === 'under_review' && 'bg-yellow-100 text-yellow-700'
                  )}>
                    {getStatusText(post.status)}
                  </span>
                </div>
                {post.content && (
                  <p className="text-sm text-foreground/80 mt-2 line-clamp-2">
                    {post.content}
                  </p>
                )}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-secondary text-muted-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3">
                  {post.status !== 'published' && (
                    <button
                      onClick={() => togglePostStatus(post.id, 'published')}
                      className="text-xs px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      发布
                    </button>
                  )}
                  {post.status !== 'hidden' && (
                    <button
                      onClick={() => togglePostStatus(post.id, 'hidden')}
                      className="text-xs px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                    >
                      隐藏
                    </button>
                  )}
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    published: '已发布',
    hidden: '已隐藏',
    under_review: '审核中'
  };
  return map[status] || status;
}
