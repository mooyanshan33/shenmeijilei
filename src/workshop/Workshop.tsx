import { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  Heart,
  MessageSquarePlus,
  MoreHorizontal,
  Play,
  Plus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { getGalleryImageUrl } from '@/lib/gallery';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AuthProvider, useAuth } from './useAuth';
import { useWorkshop } from './useWorkshop';
import { PublishDrawer } from './PublishDrawer';
import { PostDetailModal } from './PostDetailModal';
import { ReportDialog } from './ReportDialog';
import { SAMPLE_POSTS, isSamplePostId, type SamplePost } from './samplePosts';
import type { PostWithMeta } from './types';

// ─── Types & Mock Data ───────────────────────────────────────────

type WorkshopTab = 'works' | 'daily' | 'collections' | 'likes';

interface FeedItem {
  id: string;
  imageUrl: string;
  tags: string[];
  date: string;
  likes: number;
  plays: number;
  isLiked: boolean;
  category: WorkshopTab;
  post?: PostWithMeta;
}

interface MateItem {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  online: boolean;
  timestamp: string;
}

const TABS: { id: WorkshopTab; label: string }[] = [
  { id: 'works', label: 'Works' },
  { id: 'daily', label: 'Daily' },
  { id: 'collections', label: 'Collections' },
  { id: 'likes', label: 'Likes' },
];

const MOCK_MATES: MateItem[] = [
  {
    id: 'mate-1',
    name: '林知夏',
    bio: '用色彩记录日常里的微小诗意',
    avatar: getGalleryImageUrl('light-gray.png'),
    online: true,
    timestamp: '2m ago',
  },
  {
    id: 'mate-2',
    name: '陈墨白',
    bio: '陶瓷与织物之间的边界探索者',
    avatar: getGalleryImageUrl('dark-light-gray.png'),
    online: true,
    timestamp: '14m ago',
  },
  {
    id: 'mate-3',
    name: '苏晚棠',
    bio: '策展笔记 · 每周更新',
    avatar: getGalleryImageUrl('cyberpunk-2.png'),
    online: false,
    timestamp: '1h ago',
  },
  {
    id: 'mate-4',
    name: '顾清和',
    bio: '抽象构成与东方美学的对话',
    avatar: getGalleryImageUrl('matcha.jpg'),
    online: false,
    timestamp: '3h ago',
  },
];

function formatCompactDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function sampleToFeedItem(post: SamplePost): FeedItem {
  return {
    id: post.id,
    imageUrl: post.image_url,
    tags: post.tags,
    date: formatCompactDate(post.created_at),
    likes: post.likes_count,
    plays: post.comments_count,
    isLiked: post.is_liked_by_me,
    category: post.category,
    post,
  };
}

function postToFeedItem(post: PostWithMeta): FeedItem {
  return {
    id: post.id,
    imageUrl: post.image_url,
    tags: post.tags.length > 0 ? post.tags : ['未分类'],
    date: formatCompactDate(post.created_at),
    likes: post.likes_count,
    plays: post.comments_count,
    isLiked: post.is_liked_by_me,
    category: 'works',
    post,
  };
}

// ─── Sub-components ──────────────────────────────────────────────

function TabBar({
  activeTab,
  onChange,
}: {
  activeTab: WorkshopTab;
  onChange: (tab: WorkshopTab) => void;
}) {
  return (
    <nav className="flex items-center gap-6 overflow-x-auto no-scrollbar">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'shrink-0 flex items-center gap-1 pb-1 text-sm font-medium tracking-wide transition-colors',
              isActive
                ? 'text-zinc-900 border-b-2 border-black'
                : 'text-zinc-400 border-b-2 border-transparent'
            )}
          >
            {tab.label}
            {isActive && <ChevronDown className="w-3 h-3" strokeWidth={2.5} />}
          </button>
        );
      })}
    </nav>
  );
}

function FeedCard({
  item,
  onLike,
  onOpen,
  onDelete,
  onHide,
  onReport,
  isAuthor,
  isAdmin,
}: {
  item: FeedItem;
  onLike: () => void;
  onOpen: () => void;
  onDelete: () => void;
  onHide: () => void;
  onReport: () => void;
  isAuthor: boolean;
  isAdmin: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const post = item.post;

  if (post?.status === 'hidden' && !isAuthor && !isAdmin) return null;

  return (
    <article className="group">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left"
        aria-label="查看作品"
      >
        <div className="relative overflow-hidden rounded-sm bg-zinc-100">
          {!imgError ? (
            <img
              src={item.imageUrl}
              alt={item.tags[0] ?? '作品'}
              className="w-full aspect-[4/3] object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full aspect-[4/3] flex items-center justify-center text-xs text-zinc-400">
              图片加载失败
            </div>
          )}
          {post?.status === 'hidden' && (
            <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5">
              已隐藏
            </span>
          )}
        </div>
      </button>

      <div className="mt-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] leading-snug text-zinc-900 truncate">
            {item.tags.map((tag) => `#${tag}`).join('  ')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-zinc-500 tabular-nums">{item.date}</span>
          <button
            type="button"
            onClick={onOpen}
            className="text-zinc-500 hover:text-zinc-900 transition-colors"
            aria-label="播放"
          >
            <Play className="w-3 h-3 fill-current" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className={cn(
              'flex items-center gap-0.5 text-zinc-500 hover:text-zinc-900 transition-colors',
              item.isLiked && 'text-zinc-900'
            )}
            aria-label={item.isLiked ? '取消喜欢' : '喜欢'}
          >
            <Heart className={cn('w-3 h-3', item.isLiked && 'fill-current')} />
            <span className="text-[10px] tabular-nums">{item.likes}</span>
          </button>

          {post && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="text-zinc-400 hover:text-zinc-900 transition-colors"
                  aria-label="更多"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-sm">
                {isAuthor && (
                  <DropdownMenuItem onClick={onDelete} className="text-red-600 text-sm">
                    删除
                  </DropdownMenuItem>
                )}
                {isAdmin && (
                  <DropdownMenuItem onClick={onHide} className="text-sm">
                    隐藏帖子
                  </DropdownMenuItem>
                )}
                {!isAuthor && (
                  <DropdownMenuItem onClick={onReport} className="text-sm">
                    举报
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </article>
  );
}

function MatesSection({ mates }: { mates: MateItem[] }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="pt-10">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 mb-5 group"
      >
        <h2 className="text-lg font-bold text-zinc-900 tracking-tight">活跃同好</h2>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-zinc-400 transition-transform duration-200',
            expanded && 'rotate-180'
          )}
        />
      </button>

      {expanded && (
        <ul className="space-y-5">
          {mates.map((mate) => (
            <li key={mate.id} className="flex items-center gap-3">
              <div className="relative shrink-0">
                <Avatar className="w-11 h-11 rounded-md">
                  <AvatarImage src={mate.avatar} alt={mate.name} className="object-cover" />
                  <AvatarFallback className="rounded-md bg-zinc-100 text-zinc-500 text-xs">
                    {mate.name.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                {mate.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 bg-white px-0.5">
                    <span className="block text-[8px] font-semibold text-emerald-600 leading-none tracking-tighter">
                      Online
                    </span>
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-zinc-900 truncate">{mate.name}</p>
                <p className="text-xs text-zinc-400 truncate mt-0.5">{mate.bio}</p>
              </div>

              <span className="text-[10px] text-zinc-400 shrink-0 tabular-nums">
                {mate.timestamp}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FeedSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="w-full aspect-[4/3] rounded-sm" />
          <div className="mt-2 flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Content ──────────────────────────────────────────────────

function WorkshopContent() {
  const {
    posts,
    isLoading,
    fetchPosts,
    publishPost,
    uploadImage,
    toggleLike,
    deletePost,
    hidePost,
    createReport,
  } = useWorkshop();

  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<WorkshopTab>('works');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostWithMeta | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'post' | 'comment'; id: string } | null>(
    null
  );
  const [sampleLikeState, setSampleLikeState] = useState<
    Record<string, { isLiked: boolean; likes: number }>
  >({});

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const feedItems = useMemo(() => {
    const sampleItems = SAMPLE_POSTS.map((post) => {
      const override = sampleLikeState[post.id];
      const item = sampleToFeedItem(post);
      if (override) {
        return { ...item, isLiked: override.isLiked, likes: override.likes };
      }
      return item;
    });

    const realItems = posts
      .filter((post) => !isSamplePostId(post.id))
      .map(postToFeedItem);

    const merged = [...sampleItems, ...realItems];

    if (activeTab === 'likes') {
      return merged.filter((item) => item.isLiked);
    }
    if (activeTab === 'works') {
      return merged.filter((item) => item.category === 'works' || !isSamplePostId(item.id));
    }
    return merged.filter((item) => item.category === activeTab);
  }, [posts, activeTab, sampleLikeState]);

  const handleLike = async (item: FeedItem) => {
    if (isSamplePostId(item.id)) {
      setSampleLikeState((prev) => {
        const current = prev[item.id] ?? { isLiked: item.isLiked, likes: item.likes };
        const nextLiked = !current.isLiked;
        return {
          ...prev,
          [item.id]: {
            isLiked: nextLiked,
            likes: current.likes + (nextLiked ? 1 : -1),
          },
        };
      });
      return;
    }
    if (!item.post) return;
    try {
      await toggleLike(item.post.id);
    } catch {
      toast.error('操作失败，请重试');
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('确定要删除这篇帖子吗？')) return;
    try {
      await deletePost(postId);
      toast.success('帖子已删除');
    } catch {
      toast.error('删除失败');
    }
  };

  const handleHide = async (postId: string) => {
    if (!confirm('确定要隐藏这篇帖子吗？')) return;
    try {
      await hidePost(postId);
      toast.success('帖子已隐藏');
    } catch {
      toast.error('操作失败');
    }
  };

  const handleReportPost = (postId: string) => {
    setReportTarget({ type: 'post', id: postId });
    setReportDialogOpen(true);
  };

  const handleConfirmReport = async (data: {
    reason: string;
    post_id?: string;
    comment_id?: string;
  }) => {
    try {
      await createReport(data);
    } catch {
      toast.error('举报失败');
      throw new Error('report failed');
    }
  };

  const handlePublish = async (input: { imageUrl: string; content: string; tags: string[] }) => {
    setIsSubmitting(true);
    try {
      await publishPost({
        image_url: input.imageUrl,
        content: input.content,
        tags: input.tags,
      });
      toast.success('发布成功');
    } catch {
      toast.error('发布失败');
      throw new Error('publish failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenPost = (item: FeedItem) => {
    if (item.post) {
      setSelectedPost(item.post);
      setDetailOpen(true);
    }
  };

  return (
    <div className="min-h-full bg-white text-zinc-900 relative">
      <ScrollArea className="h-full">
        <div className="px-5 pt-8 pb-28 relative">
          {/* Header */}
          <header className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                创意工坊
              </h1>
              <p className="text-[11px] text-zinc-400 tracking-[0.2em] uppercase mt-1">
                Workshop
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="mt-1 text-zinc-900 hover:text-zinc-500 transition-colors"
              aria-label="发布"
            >
              <MessageSquarePlus className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </header>

          {/* Tabs */}
          <div className="mb-8">
            <TabBar activeTab={activeTab} onChange={setActiveTab} />
          </div>

          {!isLoading && posts.length === 0 && (
            <p className="text-[11px] text-zinc-400 mb-6 tracking-wide">
              预览模式 · 展示示例帖子
            </p>
          )}

          {/* Grid Feed */}
          {isLoading && posts.length === 0 && feedItems.length === 0 ? (
            <FeedSkeleton />
          ) : feedItems.length === 0 ? (
            <div className="py-12">
              <p className="text-sm font-bold text-zinc-900">暂无内容</p>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                这个分类下还没有作品，试试其他 Tab 或发布第一条灵感。
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {feedItems.map((item) => (
                <FeedCard
                  key={item.id}
                  item={item}
                  onLike={() => handleLike(item)}
                  onOpen={() => handleOpenPost(item)}
                  onDelete={() => item.post && handleDelete(item.post.id)}
                  onHide={() => item.post && handleHide(item.post.id)}
                  onReport={() => item.post && handleReportPost(item.post.id)}
                  isAuthor={!!item.post && user?.id === item.post.author_id}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}

          {/* Mates */}
          <MatesSection mates={MOCK_MATES} />

          {/* FAB */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="fixed bottom-[100px] sm:bottom-24 right-5 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-95 transition-all"
            aria-label="发布心得"
          >
            <Plus className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </ScrollArea>

      <PublishDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSubmit={handlePublish}
        onUpload={uploadImage}
        isSubmitting={isSubmitting}
      />

      {selectedPost && (
        <PostDetailModal
          open={detailOpen}
          onOpenChange={setDetailOpen}
          post={selectedPost}
          source="创意工坊"
          onLike={() => {
            const item = feedItems.find((f) => f.post?.id === selectedPost.id);
            if (item) void handleLike(item);
          }}
          onReport={() => handleReportPost(selectedPost.id)}
        />
      )}

      {reportTarget && (
        <ReportDialog
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
          targetType={reportTarget.type}
          targetId={reportTarget.id}
          onReport={handleConfirmReport}
        />
      )}
    </div>
  );
}

export function Workshop() {
  return (
    <AuthProvider>
      <WorkshopContent />
    </AuthProvider>
  );
}
