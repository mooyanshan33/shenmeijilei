import { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, X, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useComments } from './useComments';
import { ReportDialog } from './ReportDialog';
import type { PostWithMeta, Comment } from './types';

interface CommentDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: PostWithMeta;
  onReport: (data: { reason: string; post_id?: string; comment_id?: string }) => Promise<void>;
}

// 相对时间格式化
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

function CommentItem({
  comment,
  postAuthorId,
  onReport,
  onDelete
}: {
  comment: Comment;
  postAuthorId: string;
  onReport: (commentId: string) => void;
  onDelete: (commentId: string) => Promise<void>;
}) {
  const { user, isAdmin } = useAuth();
  const isAuthor = user?.id === comment.author_id;
  const isPostAuthor = comment.author_id === postAuthorId;

  const handleDelete = async () => {
    try {
      await onDelete(comment.id);
      toast.success('评论已删除');
    } catch (e) {
      toast.error('删除失败');
    }
  };

  return (
    <div className="flex gap-3 py-3 border-b border-border/30 last:border-0">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage src={comment.author?.avatar_url || ''} />
        <AvatarFallback>
          {comment.author?.username?.[0]?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{comment.author?.username}</span>
            {isPostAuthor && (
              <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                作者
              </span>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(isAuthor || isAdmin) && (
                <DropdownMenuItem onClick={handleDelete} className="text-red-500">
                  删除评论
                </DropdownMenuItem>
              )}
              {!isAuthor && (
                <DropdownMenuItem onClick={() => onReport(comment.id)}>
                  举报
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-foreground/80 mt-1">{comment.content}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatRelativeTime(comment.created_at)}
        </p>
      </div>
    </div>
  );
}

export function CommentDrawer({
  open,
  onOpenChange,
  post,
  onReport,
}: CommentDrawerProps) {
  const { user, isAuthenticated } = useAuth();
  const { comments, isLoading, fetchComments, publishComment, deleteComment } = useComments(post.id);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'comment'; id: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open, fetchComments]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      toast.error('请先登录');
      return;
    }
    if (!commentInput.trim()) return;

    setIsSubmitting(true);
    try {
      await publishComment({
        post_id: post.id,
        content: commentInput.trim()
      });
      setCommentInput('');
      toast.success('评论已发送');
    } catch (e) {
      toast.error('评论发布失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = (commentId: string) => {
    setReportTarget({ type: 'comment', id: commentId });
    setReportDialogOpen(true);
  };

  const handleConfirmReport = async (data: { reason: string; post_id?: string; comment_id?: string }) => {
    await onReport(data);
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="flex flex-row items-center justify-between pb-2">
            <DrawerTitle className="text-base">评论 ({comments.length})</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <div
            ref={scrollRef}
            className="px-4 overflow-y-auto max-h-[60vh]"
          >
            {isLoading ? (
              <div className="space-y-4 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 bg-muted rounded" />
                      <div className="h-4 w-full bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground text-sm">还没有评论，快来抢沙发吧</p>
              </div>
            ) : (
              <div>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    postAuthorId={post.author_id}
                    onReport={handleReport}
                    onDelete={deleteComment}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={user?.avatar_url || ''} />
                <AvatarFallback>
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Input
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="说点什么..."
                  disabled={isSubmitting}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitComment();
                    }
                  }}
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={!commentInput.trim() || isSubmitting}
                  className="shrink-0"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 border-2 border-current/50 border-t-current rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {reportTarget && (
        <ReportDialog
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
          targetType={reportTarget.type}
          targetId={reportTarget.id}
          onReport={handleConfirmReport}
        />
      )}
    </>
  );
}
