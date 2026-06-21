import { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from './useAuth';
import type { PostWithMeta } from './types';

interface PostCardProps {
  post: PostWithMeta;
  onLike: (postId: string) => Promise<void>;
  onComment: () => void;
  onDelete: (postId: string) => Promise<void>;
  onHide: (postId: string) => Promise<void>;
  onReport: (postId: string) => void;
  className?: string;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 7) {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  }
  if (diffDays > 0) return `${diffDays}天前`;
  if (diffHours > 0) return `${diffHours}小时前`;
  if (diffMins > 0) return `${diffMins}分钟前`;
  return '刚刚';
}

export function PostCard({
  post,
  onLike,
  onComment,
  onDelete,
  onHide,
  onReport,
  className
}: PostCardProps) {
  const { user, isAdmin } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isAuthor = user?.id === post.author_id;

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await onLike(post.id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('确定要删除这篇帖子吗？')) {
      await onDelete(post.id);
    }
  };

  const handleHide = async () => {
    if (confirm('确定要隐藏这篇帖子吗？')) {
      await onHide(post.id);
    }
  };

  // 如果帖子被隐藏且不是作者或管理员，不显示
  if (post.status === 'hidden' && !isAuthor && !isAdmin) {
    return null;
  }

  return (
    <article
      className={cn(
        'bg-card rounded-lg border border-border/70 overflow-hidden relative',
        post.status === 'hidden' && 'opacity-60',
        className
      )}
    >
      {post.status === 'hidden' && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
          已隐藏
        </div>
      )}

      {/* 图片 */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {!imgError ? (
          <img
            src={post.image_url}
            alt="帖子图片"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            图片加载失败
          </div>
        )}
      </div>

      {/* 内容区 */}
      <div className="p-4 space-y-3">
        {/* 文字内容 */}
        {post.content && (
          <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
            {post.content}
          </p>
        )}

        {/* 标签 */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  'bg-secondary text-muted-foreground',
                  'dark:bg-secondary/80 dark:text-muted-foreground/90'
                )}
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 底部互动栏 */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-4">
            {/* 点赞按钮 */}
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-220',
                'hover:bg-secondary/80 active:scale-95',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                post.is_liked_by_me && 'text-red-500'
              )}
              aria-label={post.is_liked_by_me ? '取消点赞' : '点赞'}
            >
              <Heart
                className={cn(
                  'w-4 h-4 transition-transform duration-220',
                  post.is_liked_by_me && 'fill-current scale-110'
                )}
              />
              <span className="text-xs tabular-nums">{post.likes_count}</span>
            </button>

            {/* 评论按钮 */}
            <button
              onClick={onComment}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-220',
                'hover:bg-secondary/80 active:scale-95'
              )}
              aria-label="评论"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs tabular-nums">{post.comments_count}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* 时间 */}
            <time className="text-xs text-muted-foreground">
              {formatRelativeTime(post.created_at)}
            </time>

            {/* 更多菜单 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthor && (
                  <DropdownMenuItem onClick={handleDelete} className="text-red-500">
                    删除
                  </DropdownMenuItem>
                )}
                {isAdmin && (
                  <DropdownMenuItem onClick={handleHide}>
                    隐藏帖子
                  </DropdownMenuItem>
                )}
                {!isAuthor && (
                  <DropdownMenuItem onClick={() => onReport(post.id)}>
                    举报
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </article>
  );
}
