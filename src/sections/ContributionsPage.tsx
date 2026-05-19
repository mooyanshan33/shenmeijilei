import { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { listContributions, createContribution, toggleLike, listLikedContributionIds, listContributionComments, createContributionComment, deleteContribution, updateContribution } from '@/supabase/services/contribution';
import { getCurrentUser } from '@/supabase/services/auth';
import { getCurrentProfile, getProfileById } from '@/supabase/services/profile';
import { uploadContributionImage } from '@/supabase/services/storage';
import { getOrCreateLocalAvatar, avatarUrlFromSeed } from '@/lib/avatars';
import type { Contribution, UserProfile } from '@/types';

export function ContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [newPostFile, setNewPostFile] = useState<File | null>(null);
  const [newPostPreview, setNewPostPreview] = useState<string>('');
  const [isPosting, setIsPosting] = useState(false);
  const [animatingLike, setAnimatingLike] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('美学探索者');
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string>(() => getOrCreateLocalAvatar());
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [activeContribution, setActiveContribution] = useState<Contribution | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [comments, setComments] = useState<Array<{ id: string; userId: string; userName: string; userAvatar: string; content: string; createdAt: string }>>([]);
  const [commentError, setCommentError] = useState<string>('');
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [viewUserId, setViewUserId] = useState<string>('');
  const [viewUserName, setViewUserName] = useState<string>('');
  const [viewUserAvatar, setViewUserAvatar] = useState<string>('');
  const [viewProfile, setViewProfile] = useState<UserProfile | null>(null);
  const [viewProfileStatus, setViewProfileStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingContribution, setEditingContribution] = useState<Contribution | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editTags, setEditTags] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Contribution | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting' | 'error'>('idle');

  useEffect(() => {
    return () => {
      if (newPostPreview.startsWith('blob:')) URL.revokeObjectURL(newPostPreview);
    };
  }, [newPostPreview]);

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getCurrentUser();
        setCurrentUserId(user?.id ?? null);
        if (!user?.id) {
          setContributions([]);
          return;
        }

        try {
          const profile = await getCurrentProfile(user.id);
          setCurrentUserName(profile.name || '美学探索者');
          setCurrentUserAvatar(profile.avatar || avatarUrlFromSeed(user.id));
        } catch {
          setCurrentUserName(user.email ?? '美学探索者');
          setCurrentUserAvatar(avatarUrlFromSeed(user.id));
        }

        let data: Contribution[] = [];
        try {
          data = await listContributions();
        } catch {
          data = [];
        }

        try {
          const likedIds = await listLikedContributionIds(user.id);
            setContributions(
              data.map((x) => ({
                ...x,
                isLiked: likedIds.has(x.id),
              }))
            );
        } catch {
          setContributions(data);
        }
      } catch (error) {
        console.error('Failed to load contributions:', error);
        setContributions([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const viewUserPosts = useMemo(() => {
    if (!viewUserId) return [];
    return contributions.filter((x) => x.userId === viewUserId);
  }, [contributions, viewUserId]);

  const openUserProfile = async (userId: string, userName: string, userAvatar: string) => {
    const id = userId?.trim();
    if (!id) return;
    setViewUserId(id);
    setViewUserName(userName);
    setViewUserAvatar(userAvatar);
    setViewProfile(null);
    setViewProfileStatus('idle');
    setIsUserProfileOpen(true);
    if (!currentUserId) return;
    setViewProfileStatus('loading');
    try {
      const p = await getProfileById(id);
      setViewProfile(p);
      setViewProfileStatus('idle');
    } catch {
      setViewProfileStatus('error');
    }
  };

  const handleLike = async (contributionId: string) => {
    if (!currentUserId) {
      console.warn('请先登录后再操作');
      return;
    }

    setAnimatingLike(contributionId);

    try {
      const result = await toggleLike(contributionId, currentUserId);
      
      setContributions((prev) =>
        prev.map((item) =>
          item.id === contributionId
            ? { ...item, isLiked: result.liked, likes: result.likes }
            : item
        )
      );
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setTimeout(() => setAnimatingLike(null), 300);
    }
  };

  const handlePost = async () => {
    if (!newPostCaption.trim() || !currentUserId || !newPostFile) return;

    try {
      setIsPosting(true);
      const imageUrl = await uploadContributionImage(newPostFile, currentUserId);
      const newPost = await createContribution({
        userId: currentUserId,
        userName: currentUserName,
        userAvatar: currentUserAvatar,
        imageUrl,
        caption: newPostCaption,
        tags: newPostTags.split(',').map((tag) => tag.trim()).filter(Boolean),
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
      });

      setContributions([newPost, ...contributions]);
      setNewPostCaption('');
      setNewPostTags('');
      setNewPostFile(null);
      setNewPostPreview('');
      setIsPostDialogOpen(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  };

  const canPost = useMemo(() => {
    return !!currentUserId && !!newPostFile && !!newPostCaption.trim() && !isPosting;
  }, [currentUserId, newPostFile, newPostCaption, isPosting]);

  const openComments = async (contribution: Contribution) => {
    setActiveContribution(contribution);
    setIsCommentsOpen(true);
    setCommentInput('');
    setCommentError('');
    setCommentLoading(true);
    try {
      const data = await listContributionComments(contribution.id);
      setComments(
        data.map((x) => ({
          id: x.id,
          userId: x.userId,
          userName: x.userName,
          userAvatar: x.userAvatar,
          content: x.content,
          createdAt: x.createdAt,
        }))
      );
    } catch (error) {
      console.error('Failed to load comments:', error);
      setComments([]);
      setCommentError('评论功能暂不可用');
    } finally {
      setCommentLoading(false);
    }
  };

  const submitComment = async () => {
    if (!activeContribution || !currentUserId) return;
    const content = commentInput.trim();
    if (!content) return;

    setCommentLoading(true);
    setCommentError('');
    try {
      const created = await createContributionComment({
        contributionId: activeContribution.id,
        userId: currentUserId,
        userName: currentUserName,
        userAvatar: currentUserAvatar,
        content,
      });
      setComments((prev) => [
        ...prev,
        {
          id: created.id,
          userId: created.userId,
          userName: created.userName,
          userAvatar: created.userAvatar,
          content: created.content,
          createdAt: created.createdAt,
        },
      ]);
      setCommentInput('');
      setContributions((prev) =>
        prev.map((x) =>
          x.id === activeContribution.id ? { ...x, comments: x.comments + 1 } : x
        )
      );
    } catch (error) {
      console.error('Failed to create comment:', error);
      setCommentError('发表评论失败');
    } finally {
      setCommentLoading(false);
    }
  };

  const shareContribution = async (contribution: Contribution) => {
    const url = contribution.imageUrl;
    const text = `${contribution.userName}：${contribution.caption}`;
    const shareData = { title: '美学分享', text, url };

    try {
      const nav = navigator as unknown as { share?: (data: unknown) => Promise<void> };
      if (nav.share) {
        await nav.share(shareData);
        return;
      }
    } catch {
      void 0;
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
    } catch {
      void 0;
    }
  };

  const handleOpenEdit = (contribution: Contribution) => {
    setEditingContribution(contribution);
    setEditCaption(contribution.caption);
    setEditTags(contribution.tags.join(', '));
    setIsEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditDialogOpen(false);
    setEditingContribution(null);
    setEditCaption('');
    setEditTags('');
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!editingContribution || !currentUserId) return;
    if (!editCaption.trim()) return;

    try {
      setIsEditing(true);
      const updated = await updateContribution(editingContribution.id, currentUserId, {
        caption: editCaption,
        tags: editTags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setContributions((prev) =>
        prev.map((x) => (x.id === updated.id ? { ...updated, isLiked: x.isLiked } : x))
      );
      handleCloseEdit();
    } catch (error) {
      console.error('Failed to update contribution:', error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleRequestDelete = (contribution: Contribution) => {
    setDeleteTarget(contribution);
    setDeleteStatus('idle');
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !currentUserId) return;
    setDeleteStatus('deleting');
    try {
      await deleteContribution(deleteTarget.id, currentUserId);
      setContributions((prev) => prev.filter((x) => x.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeleteStatus('idle');
    } catch (error) {
      console.error('Failed to delete contribution:', error);
      setDeleteStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-full pb-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 glass-panel px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl text-foreground">创意工坊</h1>
          <Button
            onClick={() => setIsPostDialogOpen(true)}
            className="rounded-full px-4"
          >
            <span className="material-symbols mr-1">add</span>
            发布
          </Button>
        </div>
      </header>

      {/* Contributions Grid */}
      <div className="px-4 pt-4">
        {contributions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <span className="material-symbols text-5xl mb-4">photo_library</span>
            <p className="text-base">还没有分享内容</p>
            <p className="text-sm mt-1">点击右上角发布你的第一条美学分享</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {contributions.map((contribution, index) => (
              <article
                key={contribution.id}
                className="glass-card overflow-hidden card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
              {/* User Info */}
              <div className="flex items-center gap-3 p-4 pb-2">
                <button
                  type="button"
                  className="flex-shrink-0"
                  onClick={() => openUserProfile(contribution.userId, contribution.userName, contribution.userAvatar)}
                >
                  <img
                    src={contribution.userAvatar}
                    alt={contribution.userName}
                    className="w-10 h-10 rounded-full bg-secondary"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{contribution.userName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(contribution.createdAt)}</p>
                </div>
                {currentUserId === contribution.userId && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      className="w-9 h-9 rounded-full glass-panel btn-press flex items-center justify-center"
                      aria-label="编辑"
                      onClick={() => handleOpenEdit(contribution)}
                    >
                      <span className="material-symbols text-foreground text-base">edit</span>
                    </button>
                    <button
                      type="button"
                      className="w-9 h-9 rounded-full glass-panel btn-press flex items-center justify-center"
                      aria-label="删除"
                      onClick={() => handleRequestDelete(contribution)}
                    >
                      <span className="material-symbols text-foreground text-base">delete</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={contribution.imageUrl}
                  alt={contribution.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Actions */}
                <div className="flex items-center gap-4 mb-3">
                  <button
                    onClick={() => handleLike(contribution.id)}
                    className={`flex items-center gap-1.5 transition-all duration-300 ${
                      contribution.isLiked ? 'text-red-500' : 'text-muted-foreground'
                    } ${animatingLike === contribution.id ? 'animate-heart-beat' : ''}`}
                  >
                    <span
                      className={`material-symbols text-2xl ${
                        contribution.isLiked ? 'material-symbols-filled' : ''
                      }`}
                      style={{
                        fontVariationSettings: contribution.isLiked
                          ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                          : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                      }}
                    >
                      favorite
                    </span>
                    <span className="text-sm">{contribution.likes}</span>
                  </button>

                  <button
                    className="flex items-center gap-1.5 text-muted-foreground"
                    onClick={() => openComments(contribution)}
                  >
                    <span className="material-symbols text-2xl">chat_bubble</span>
                    <span className="text-sm">{contribution.comments}</span>
                  </button>

                  <button
                    className="flex items-center gap-1.5 text-muted-foreground ml-auto"
                    onClick={() => shareContribution(contribution)}
                  >
                    <span className="material-symbols text-2xl">share</span>
                  </button>
                </div>

                {/* Caption */}
                <p className="text-foreground mb-2">{contribution.caption}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {contribution.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isUserProfileOpen} onOpenChange={setIsUserProfileOpen}>
        <DialogContent className="glass-card border-0 max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">TA 的主页</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <img src={viewProfile?.avatar || viewUserAvatar} alt={viewProfile?.name || viewUserName} className="w-14 h-14 rounded-full bg-secondary object-cover" />
              <div className="min-w-0 flex-1">
                <div className="text-base text-foreground font-medium truncate">
                  {viewProfile?.name || viewUserName || '未命名用户'}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {viewProfileStatus === 'loading'
                    ? '加载中…'
                    : viewProfile?.bio
                      ? viewProfile.bio
                      : currentUserId
                        ? '暂无简介'
                        : '登录后可查看更多信息'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="glass-panel rounded-2xl p-3 text-center">
                <div className="font-serif text-lg text-foreground">{viewProfile?.contributionCount ?? viewUserPosts.length}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">贡献</div>
              </div>
              <div className="glass-panel rounded-2xl p-3 text-center">
                <div className="font-serif text-lg text-foreground">{viewProfile?.logCount ?? 0}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">日志</div>
              </div>
              <div className="glass-panel rounded-2xl p-3 text-center">
                <div className="font-serif text-lg text-foreground">{viewProfile?.favoriteCount ?? 0}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">收藏</div>
              </div>
            </div>

            {viewProfileStatus === 'error' && (
              <div className="text-sm text-muted-foreground">暂时无法加载更多资料。</div>
            )}

            <div className="space-y-2">
              <div className="section-kicker">
                <span>Posts</span>
                <span className="soft-divider" />
              </div>
              {viewUserPosts.length === 0 ? (
                <div className="text-sm text-muted-foreground">暂无公开作品</div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {viewUserPosts.slice(0, 9).map((p) => (
                    <div key={p.id} className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
                      <img src={p.imageUrl} alt={p.caption} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              className="w-full bg-[#535353] text-[#B9B9B9] hover:bg-[#535353] btn-press rounded-xl"
              onClick={() => setIsUserProfileOpen(false)}
            >
              关闭
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Post Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="glass-card border-0 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">分享你的发现</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-border rounded-2xl p-4 text-center">
              {newPostPreview ? (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <img
                    src={newPostPreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    className="absolute top-2 right-2 w-9 h-9 rounded-full glass-panel btn-press flex items-center justify-center"
                    onClick={() => {
                      setNewPostFile(null);
                      setNewPostPreview('');
                    }}
                    aria-label="移除图片"
                  >
                    <span className="material-symbols text-foreground">close</span>
                  </button>
                </div>
              ) : (
                <>
                  <span className="material-symbols text-4xl text-muted-foreground mb-2">
                    add_photo_alternate
                  </span>
                  <p className="text-sm text-muted-foreground mb-3">选择一张图片</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-sm text-muted-foreground file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:bg-secondary/60 file:text-foreground"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      if (newPostPreview.startsWith('blob:')) URL.revokeObjectURL(newPostPreview);
                      setNewPostFile(file);
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setNewPostPreview(url);
                      } else {
                        setNewPostPreview('');
                      }
                    }}
                  />
                </>
              )}
            </div>

            {/* Caption Input */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                描述
              </label>
              <Textarea
                placeholder="分享你的美学感悟..."
                value={newPostCaption}
                onChange={(e) => setNewPostCaption(e.target.value)}
                className="bg-secondary/50 border-0 rounded-xl resize-none"
                rows={3}
              />
            </div>

            {/* Tags Input */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                标签（用逗号分隔）
              </label>
              <Input
                placeholder="例如: 极简主义, 建筑, 光影"
                value={newPostTags}
                onChange={(e) => setNewPostTags(e.target.value)}
                className="bg-secondary/50 border-0 rounded-xl"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handlePost}
              disabled={!canPost}
              className="w-full btn-press disabled:opacity-50"
            >
              {isPosting ? '发布中...' : '发布'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
        <DialogContent className="glass-card border-0 max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">评论</DialogTitle>
          </DialogHeader>

          <div className="pt-2 space-y-3">
            {activeContribution && (
              <div className="glass-panel rounded-2xl p-3">
                <button
                  type="button"
                  className="w-full flex items-center gap-2 text-left"
                  onClick={() =>
                    openUserProfile(
                      activeContribution.userId,
                      activeContribution.userName,
                      activeContribution.userAvatar
                    )
                  }
                >
                  <img
                    src={activeContribution.userAvatar}
                    alt={activeContribution.userName}
                    className="w-7 h-7 rounded-full bg-secondary"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground truncate">{activeContribution.userName}</p>
                    <p className="text-xs text-muted-foreground truncate">{activeContribution.caption}</p>
                  </div>
                  <span className="material-symbols text-muted-foreground">chevron_right</span>
                </button>
              </div>
            )}

            {commentError && (
              <div className="text-sm text-muted-foreground">{commentError}</div>
            )}

            {commentLoading ? (
              <div className="min-h-[120px] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-border border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <div className="text-sm text-muted-foreground">暂无评论</div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-3">
                      <button
                        type="button"
                        className="flex-shrink-0"
                        onClick={() => openUserProfile(c.userId, c.userName, c.userAvatar)}
                      >
                        <img
                          src={c.userAvatar}
                          alt={c.userName}
                          className="w-8 h-8 rounded-full bg-secondary"
                        />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground">{c.userName}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</span>
                        </div>
                        <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{c.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="pt-2 space-y-2">
              <Input
                placeholder={currentUserId ? '写下你的评论...' : '登录后可评论'}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                disabled={!currentUserId || !!commentError}
                className="bg-secondary/50 border-0 rounded-xl"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitComment();
                }}
              />
              <Button
                onClick={submitComment}
                disabled={!currentUserId || !commentInput.trim() || commentLoading || !!commentError}
                className="w-full btn-press disabled:opacity-50"
              >
                发送
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-card border-0 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">编辑分享</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* Image Preview */}
            {editingContribution && (
              <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                <img
                  src={editingContribution.imageUrl}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Caption Input */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                描述
              </label>
              <Textarea
                placeholder="分享你的美学感悟..."
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                className="bg-secondary/50 border-0 rounded-xl resize-none"
                rows={3}
              />
            </div>

            {/* Tags Input */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                标签（用逗号分隔）
              </label>
              <Input
                placeholder="例如: 极简主义, 建筑, 光影"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                className="bg-secondary/50 border-0 rounded-xl"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleCloseEdit}
                className="flex-1 rounded-xl"
                disabled={isEditing}
              >
                取消
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={!editCaption.trim() || isEditing}
                className="flex-1 rounded-xl btn-press disabled:opacity-50"
              >
                {isEditing ? '保存中...' : '保存'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(v) => {
          if (!v) {
            setDeleteTarget(null);
            setDeleteStatus('idle');
          }
        }}
      >
        <DialogContent className="glass-card border-0 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">删除这条分享？</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              删除后无法恢复。
            </p>
            {deleteStatus === 'error' && (
              <p className="text-sm text-muted-foreground">删除失败，请稍后重试。</p>
            )}
            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteStatus === 'deleting'}
              >
                取消
              </Button>
              <Button
                className="flex-1 bg-[#535353] text-[#B9B9B9] hover:bg-[#535353] btn-press rounded-xl disabled:opacity-50"
                onClick={handleConfirmDelete}
                disabled={deleteStatus === 'deleting'}
              >
                {deleteStatus === 'deleting' ? '删除中...' : '删除'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
