import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Flag,
  Heart,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getGalleryImageUrl } from '@/lib/gallery';
import { cn } from '@/lib/utils';
import { isSamplePostId } from './samplePosts';
import type { Comment, PostWithMeta } from './types';

// ─── Mock 评论数据 ───────────────────────────────────────────────

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    post_id: 'sample-1',
    author_id: 'mate-2',
    content: '这个色调太治愈了，纤维的层次感把握得真好。',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    author: {
      id: 'mate-2',
      username: '陈墨白',
      avatar_url: getGalleryImageUrl('dark-light-gray.png'),
      role: 'user',
      created_at: '',
    },
  },
  {
    id: 'c2',
    post_id: 'sample-1',
    author_id: 'mate-3',
    content: '想请教一下这种柔光是怎么处理的？',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    author: {
      id: 'mate-3',
      username: '苏晚棠',
      avatar_url: getGalleryImageUrl('cyberpunk-2.png'),
      role: 'user',
      created_at: '',
    },
  },
  {
    id: 'c3',
    post_id: 'sample-1',
    author_id: 'mate-4',
    content: '已收藏，准备下次策展参考 🌿',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    author: {
      id: 'mate-4',
      username: '顾清和',
      avatar_url: getGalleryImageUrl('matcha.jpg'),
      role: 'user',
      created_at: '',
    },
  },
];

export const MOCK_POST_FOR_PREVIEW: PostWithMeta = {
  id: 'preview-post',
  author_id: 'mate-1',
  image_url: getGalleryImageUrl('matcha.jpg'),
  content:
    '晨雾里的抹茶色调，像一块被时间浸润过的织物。纤维的纹理在柔光下若隐若现，每一根丝线都在低声讲述着手作的温度。\n\n今天想把这种「慢美学」分享给同好们——不追求完美的对称，而是在不完美里找到呼吸的节奏。',
  tags: ['纤维艺术', '自然主义', '手作'],
  status: 'published',
  created_at: new Date(Date.now() - 86400000).toISOString(),
  author: {
    id: 'mate-1',
    username: '林知夏',
    avatar_url: getGalleryImageUrl('light-gray.png'),
    role: 'user',
    created_at: '',
  },
  likes_count: 128,
  comments_count: 12,
  is_liked_by_me: false,
};

// ─── Helpers ─────────────────────────────────────────────────────

function formatExactTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

function formatRelativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}天前`;
  if (hours > 0) return `${hours}小时前`;
  if (mins > 0) return `${mins}分钟前`;
  return '刚刚';
}

const cardClass =
  'rounded-2xl shadow-sm bg-white/90 dark:bg-[#1c1c1e]/90 dark:border dark:border-white/10 backdrop-blur-sm';

const REPORT_REASONS = [
  { id: 'spam', label: '垃圾广告' },
  { id: 'plagiarism', label: '涉嫌抄袭/侵权' },
  { id: 'hostile', label: '不友善内容' },
  { id: 'other', label: '其他' },
] as const;

// ─── Props ───────────────────────────────────────────────────────

export interface PostDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: PostWithMeta | null;
  source?: string;
  comments?: Comment[];
  onLike?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onSubmitComment?: (content: string) => Promise<void>;
}

// ─── Component ───────────────────────────────────────────────────

export function PostDetailModal({
  open,
  onOpenChange,
  post,
  source = '创意工坊',
  comments: commentsProp,
  onLike,
  onShare,
  onReport,
  onSubmitComment,
}: PostDetailModalProps) {
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  // Share
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);

  // Report
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  useEffect(() => {
    setPortalTarget(document.querySelector<HTMLElement>('.phone-container') ?? document.body);
  }, []);

  useEffect(() => {
    if (!post) return;
    setLiked(post.is_liked_by_me);
    setLikeCount(post.likes_count);
    setLocalComments(
      commentsProp ?? (isSamplePostId(post.id) || post.id === 'preview-post' ? MOCK_COMMENTS : [])
    );
  }, [post, commentsProp]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const displayComments = commentsProp ?? localComments;
  const commentTotal = post?.comments_count ?? displayComments.length;

  const handleClose = () => onOpenChange(false);

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    onLike?.();
  };

  const handleShare = () => {
    onShare?.();
    setShareDrawerOpen(true);
  };

  const handleOpenReport = () => {
    setReportDialogOpen(true);
  };

  const handleReportSubmit = async () => {
    if (!reportReason) return;
    setReportSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('已收到您的反馈，社区管家将尽快核实。');
    onReport?.();
    setReportDialogOpen(false);
    setReportReason('');
    setReportSubmitting(false);
  };

  const handleShareAction = (action: () => void) => {
    action();
    setShareDrawerOpen(false);
  };

  const handleSubmitComment = async () => {
    const text = commentInput.trim();
    if (!text || !post) return;

    setIsSubmitting(true);
    try {
      if (onSubmitComment) {
        await onSubmitComment(text);
      } else {
        setLocalComments((prev) => [
          ...prev,
          {
            id: `local-${Date.now()}`,
            post_id: post.id,
            author_id: 'me',
            content: text,
            created_at: new Date().toISOString(),
            author: {
              id: 'me',
              username: '我',
              avatar_url: getGalleryImageUrl('light-gray.png'),
              role: 'user',
              created_at: '',
            },
          },
        ]);
      }
      setCommentInput('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contentParagraphs = useMemo(
    () => (post?.content ? post.content.split('\n').filter(Boolean) : []),
    [post?.content]
  );

  const shareOptions = [
    {
      emoji: '🔗',
      label: '复制链接',
      action: () => {
        const url = post ? `${window.location.origin}/post/${post.id}` : '';
        void navigator.clipboard.writeText(url).catch(() => {});
        toast.success('链接已复制');
      },
    },
    {
      emoji: '⬇️',
      label: '保存海报',
      action: () => {
        toast.success('分享准备就绪');
      },
    },
    {
      emoji: '💬',
      label: '分享至微信',
      action: () => {
        toast.success('分享准备就绪');
      },
    },
  ];

  if (!portalTarget || !post) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-[80] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Glass backdrop */}
          <motion.div
            className="absolute inset-0 bg-zinc-100/40 dark:bg-zinc-900/60 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            aria-hidden
          />

          {/* Scrollable content layer */}
          <motion.div
            className="relative flex flex-col h-full min-h-0"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Top actions — outside cards */}
            <div className="shrink-0 flex items-center justify-between px-5 pt-5 pb-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:bg-white/80 dark:hover:bg-white/15 transition-colors shadow-sm"
                aria-label="关闭"
              >
                <ChevronDown className="w-5 h-5" strokeWidth={2} />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-10 h-10 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:bg-white/80 dark:hover:bg-white/15 transition-colors shadow-sm"
                    aria-label="更多操作"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem onClick={handleShare}>分享链接</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleOpenReport}>举报内容</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Scroll area */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-28 no-scrollbar">
              <div className="flex flex-col gap-4 max-w-lg mx-auto">
                {/* Author card */}
                <div className={cn(cardClass, 'p-4')}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="w-11 h-11 rounded-xl shrink-0">
                        <AvatarImage
                          src={post.author?.avatar_url}
                          alt={post.author?.username}
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-xl bg-zinc-100 text-zinc-500 text-sm">
                          {post.author?.username?.slice(0, 1) ?? '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {post.author?.username ?? '匿名用户'}
                        </p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          {formatExactTime(post.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-semibold tabular-nums">{likeCount}</span>
                    </div>
                  </div>
                </div>

                {/* Main content card */}
                <div className={cn(cardClass, 'p-5')}>
                  {contentParagraphs.length > 0 ? (
                    <div className="space-y-4">
                      {contentParagraphs.map((para, i) => (
                        <p
                          key={i}
                          className="text-[15px] leading-relaxed text-zinc-800 dark:text-zinc-200"
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400 italic">暂无文字描述</p>
                  )}

                  {post.image_url && (
                    <div className="mt-5 space-y-3">
                      <img
                        src={post.image_url}
                        alt=""
                        className="w-full rounded-xl object-cover aspect-[4/3]"
                      />
                    </div>
                  )}

                  {post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] text-zinc-500 dark:text-zinc-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-xs text-zinc-400">
                      来自 {source} · {formatShortDate(post.created_at)}
                    </p>

                    <div className="flex items-center gap-1">
                      {[
                        {
                          icon: Heart,
                          label: '喜欢',
                          active: liked,
                          onClick: handleLike,
                        },
                        {
                          icon: MessageCircle,
                          label: '评论',
                          onClick: () => {
                            document.getElementById('post-comment-input')?.focus();
                          },
                        },
                        { icon: Share2, label: '分享', onClick: handleShare },
                        { icon: Flag, label: '举报', onClick: handleOpenReport },
                      ].map(({ icon: Icon, label, active, onClick }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={onClick}
                          className={cn(
                            'w-9 h-9 rounded-full flex items-center justify-center transition-colors',
                            'text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100/80 dark:hover:bg-white/5',
                            active && 'text-red-500 hover:text-red-500'
                          )}
                          aria-label={label}
                        >
                          <Icon className={cn('w-4 h-4', active && 'fill-current')} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comments section */}
                <div className={cn(cardClass, 'p-5')}>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                    共 {commentTotal} 条评论
                  </h3>

                  {displayComments.length === 0 ? (
                    <p className="text-xs text-zinc-400 py-6 text-center">
                      还没有评论，来抢沙发吧
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {displayComments.map((comment) => (
                        <li
                          key={comment.id}
                          className="rounded-xl bg-zinc-50/80 dark:bg-white/5 p-3.5"
                        >
                          <div className="flex gap-3">
                            <Avatar className="w-8 h-8 rounded-lg shrink-0">
                              <AvatarImage
                                src={comment.author?.avatar_url}
                                className="object-cover"
                              />
                              <AvatarFallback className="rounded-lg text-xs">
                                {comment.author?.username?.slice(0, 1) ?? '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                                  {comment.author?.username ?? '用户'}
                                </span>
                                <span className="text-[10px] text-zinc-400 shrink-0">
                                  {formatRelativeTime(comment.created_at)}
                                </span>
                              </div>
                              <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky comment input */}
            <div className="shrink-0 absolute bottom-0 left-0 right-0 px-5 pb-5 pt-2 pointer-events-none">
              <div className="max-w-lg mx-auto pointer-events-auto">
                <div className="flex items-center gap-2 rounded-full bg-white/70 dark:bg-[#1c1c1e]/80 backdrop-blur-md px-4 py-2.5 shadow-lg border border-white/40 dark:border-white/10">
                  <input
                    id="post-comment-input"
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        void handleSubmitComment();
                      }
                    }}
                    placeholder="写下你的想法…"
                    className="flex-1 bg-transparent text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 outline-none min-w-0"
                  />
                  <button
                    type="button"
                    onClick={() => void handleSubmitComment()}
                    disabled={!commentInput.trim() || isSubmitting}
                    className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center disabled:opacity-40 transition-opacity shrink-0"
                    aria-label="发送"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Share Drawer ──────────────────────────────────── */}
          <AnimatePresence>
            {shareDrawerOpen && (
              <motion.div
                className="absolute inset-0 z-[90] flex flex-col justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                  onClick={() => setShareDrawerOpen(false)}
                />
                <motion.div
                  className="relative w-full rounded-t-2xl bg-white pb-8 pt-3 shadow-xl"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                >
                  <div className="mx-auto mb-5 h-1 w-9 rounded-full bg-zinc-300" />
                  <div className="flex gap-6 overflow-x-auto px-6 no-scrollbar">
                    {shareOptions.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => handleShareAction(option.action)}
                        className="flex flex-col items-center gap-2 shrink-0"
                      >
                        <span className="flex items-center justify-center w-14 h-14 rounded-full bg-zinc-100 text-xl">
                          {option.emoji}
                        </span>
                        <span className="text-xs text-zinc-500 whitespace-nowrap">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Report Dialog ─────────────────────────────────── */}
          <AnimatePresence>
            {reportDialogOpen && (
              <motion.div
                className="absolute inset-0 z-[90] flex items-center justify-center p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                  onClick={() => {
                    if (!reportSubmitting) setReportDialogOpen(false);
                  }}
                />
                <motion.div
                  className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <h2 className="text-lg font-bold text-zinc-900 text-center mb-4">
                    报告此内容
                  </h2>

                  <RadioGroup
                    value={reportReason}
                    onValueChange={setReportReason}
                    className="flex flex-col"
                  >
                    {REPORT_REASONS.map((reason) => (
                      <label
                        key={reason.id}
                        className={cn(
                          'flex items-center gap-3 py-3 border-b border-zinc-100 cursor-pointer',
                          reportReason === reason.id && 'text-zinc-900'
                        )}
                      >
                        <RadioGroupItem value={reason.id} id={`report-${reason.id}`} />
                        <span className="text-sm text-zinc-500">{reason.label}</span>
                      </label>
                    ))}
                  </RadioGroup>

                  <div className="flex items-center justify-between mt-5 gap-3">
                    <button
                      type="button"
                      onClick={() => setReportDialogOpen(false)}
                      disabled={reportSubmitting}
                      className="text-sm text-zinc-500 px-4 py-2.5 rounded-xl hover:bg-zinc-50 transition-colors disabled:opacity-50"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={handleReportSubmit}
                      disabled={!reportReason || reportSubmitting}
                      className={cn(
                        'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all',
                        'bg-zinc-900 text-white',
                        'disabled:opacity-40 disabled:cursor-not-allowed',
                        'hover:bg-zinc-800 active:scale-[0.97]'
                      )}
                    >
                      {reportSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      {reportSubmitting ? '提交中…' : '提交举报'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    portalTarget
  );
}
