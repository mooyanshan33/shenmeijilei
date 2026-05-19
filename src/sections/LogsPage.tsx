import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { listAestheticLogs, createAestheticLog, updateAestheticLog, deleteAestheticLog } from '@/supabase/services/logs';
import { getCurrentUser } from '@/supabase/services/auth';
import { uploadLogImage } from '@/supabase/services/storage';
import type { AestheticLog } from '@/types';

export function LogsPage() {
  const [logs, setLogs] = useState<AestheticLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<AestheticLog | null>(null);
  const [logContent, setLogContent] = useState('');
  const [logTags, setLogTags] = useState('');
  const [logDate, setLogDate] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [logImageFile, setLogImageFile] = useState<File | null>(null);
  const [logImagePreview, setLogImagePreview] = useState<string>('');
  const [logImageRemoved, setLogImageRemoved] = useState(false);
  const [logImageStatus, setLogImageStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [deleteTarget, setDeleteTarget] = useState<AestheticLog | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting' | 'error'>('idle');

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getCurrentUser();
        setCurrentUserId(user?.id ?? null);
        const data = await listAestheticLogs();
        setLogs(data);
      } catch (error) {
        console.error('Failed to load logs:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenEditor = (log?: AestheticLog) => {
    if (logImagePreview.startsWith('blob:')) URL.revokeObjectURL(logImagePreview);
    if (log) {
      setEditingLog(log);
      setLogContent(log.content);
      setLogTags(log.tags.join(', '));
      setLogDate(log.date);
      setLogImageFile(null);
      setLogImagePreview(log.imageUrl ?? '');
      setLogImageRemoved(false);
      setLogImageStatus('idle');
    } else {
      setEditingLog(null);
      setLogContent('');
      setLogTags('');
      setLogDate(new Date().toISOString().split('T')[0]);
      setLogImageFile(null);
      setLogImagePreview('');
      setLogImageRemoved(false);
      setLogImageStatus('idle');
    }
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    if (logImagePreview.startsWith('blob:')) URL.revokeObjectURL(logImagePreview);
    setIsEditorOpen(false);
    setEditingLog(null);
    setLogContent('');
    setLogTags('');
    setLogDate('');
    setLogImageFile(null);
    setLogImagePreview('');
    setLogImageRemoved(false);
    setLogImageStatus('idle');
  };

  const handleSaveLog = async () => {
    if (!logContent.trim() || !currentUserId) return;

    try {
      let imageUrlToSave: string | undefined;
      if (logImageFile) {
        setLogImageStatus('uploading');
        imageUrlToSave = await uploadLogImage(logImageFile, currentUserId);
        setLogImageStatus('idle');
      } else if (logImageRemoved) {
        imageUrlToSave = '';
      } else if (editingLog?.imageUrl) {
        imageUrlToSave = editingLog.imageUrl;
      }

      if (editingLog) {
        const updated = await updateAestheticLog(editingLog.id, {
          content: logContent,
          tags: logTags.split(',').map((t) => t.trim()).filter(Boolean),
          date: logDate,
          imageUrl: imageUrlToSave,
        });
        setLogs((prev) =>
          prev.map((log) => (log.id === editingLog.id ? updated : log))
        );
      } else {
        const newLog = await createAestheticLog({
          userId: currentUserId,
          date: logDate,
          content: logContent,
          imageUrl: imageUrlToSave,
          tags: logTags.split(',').map((t) => t.trim()).filter(Boolean),
        });
        setLogs([newLog, ...logs]);
      }
      handleCloseEditor();
    } catch (error) {
      console.error('Failed to save log:', error);
      setLogImageStatus('error');
    }
  };

  const handleRequestDelete = (log: AestheticLog) => {
    setDeleteTarget(log);
    setDeleteStatus('idle');
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteStatus('deleting');
    try {
      await deleteAestheticLog(deleteTarget.id);
      setLogs((prev) => prev.filter((x) => x.id !== deleteTarget.id));
      setDeleteTarget(null);
      setDeleteStatus('idle');
    } catch (e) {
      console.error('Failed to delete log:', e);
      setDeleteStatus('error');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天';
    } else {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const groupedLogs = logs.reduce((groups, log) => {
    const date = log.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {} as Record<string, AestheticLog[]>);

  const sortedDates = Object.keys(groupedLogs).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  const formatCreatedAt = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
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
          <h1 className="font-serif text-2xl text-foreground">美学日志</h1>
          <Button
            onClick={() => handleOpenEditor()}
            className="rounded-full px-4"
          >
            <span className="material-symbols mr-1">edit</span>
            记录
          </Button>
        </div>
      </header>

      {/* Timeline */}
      <div className="px-4 pt-6">
        {sortedDates.length > 0 ? (
          <div className="space-y-8">
              {sortedDates.map((date, dateIndex) => (
                <div key={date} className="relative">
                  {/* Date Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-serif text-lg text-foreground">{formatDate(date)}</span>
                    <span className="h-px flex-1 bg-border/70" />
                  </div>

                  {/* Logs for this date */}
                  <div className="space-y-4">
                    {groupedLogs[date].map((log, logIndex) => (
                      <article
                        key={log.id}
                        onClick={() => handleOpenEditor(log)}
                        className="glass-card overflow-hidden cursor-pointer card-hover animate-fade-in-up"
                        style={{
                          animationDelay: `${(dateIndex * 2 + logIndex) * 100}ms`,
                        }}
                      >
                        {log.imageUrl && (
                          <div className="aspect-[4/3] overflow-hidden">
                            <img
                              src={log.imageUrl}
                              alt="Log image"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="text-foreground leading-relaxed">
                                {log.content}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {log.tags.map((tag, i) => (
                                  <span
                                    key={i}
                                    className="text-xs px-2 py-1 bg-grayWhite-100 text-muted-foreground rounded-full border border-grayWhite-200/70"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              <span className="text-xs text-muted-foreground">
                                {formatCreatedAt(log.createdAt)}
                              </span>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  className="w-9 h-9 rounded-full glass-panel btn-press flex items-center justify-center"
                                  aria-label="编辑"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditor(log);
                                  }}
                                >
                                  <span className="material-symbols text-foreground text-base">edit</span>
                                </button>
                                <button
                                  type="button"
                                  className="w-9 h-9 rounded-full glass-panel btn-press flex items-center justify-center"
                                  aria-label="删除"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRequestDelete(log);
                                  }}
                                >
                                  <span className="material-symbols text-foreground text-base">delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-grayWhite-100 border border-grayWhite-200/70 flex items-center justify-center">
                  <span className="material-symbols text-foreground">menu_book</span>
                </div>
                <div className="flex-1">
                  <h2 className="font-serif text-xl text-foreground mb-2">写一篇美学日志</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    这里用于记录你对某种风格、空间、影像或作品的审美感受：把观察写下来，帮助你积累个人审美词库与灵感线索。
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3">
                <div className="glass-panel rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols text-muted-foreground text-base">edit</span>
                    <span className="text-sm text-foreground">记录内容</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    记录你当下的感受、关键词、喜欢/不喜欢的理由，以及想继续探索的方向。
                  </p>
                </div>
                <div className="glass-panel rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols text-muted-foreground text-base">sell</span>
                    <span className="text-sm text-foreground">添加标签</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    用标签把灵感归档（如：极简、光影、材质、建筑、禅意），方便以后快速检索。
                  </p>
                </div>
                <div className="glass-panel rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols text-muted-foreground text-base">calendar_today</span>
                    <span className="text-sm text-foreground">按时间回看</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    日志会按日期归档成时间线，随时回顾自己的审美变化与阶段性偏好。
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <Button
                  onClick={() => handleOpenEditor()}
                  disabled={!currentUserId}
                  className="flex-1 rounded-xl disabled:opacity-50"
                >
                  <span className="material-symbols mr-2">edit</span>
                  {currentUserId ? '开始记录' : '登录后开始记录'}
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
              <p className="text-sm">还没有日志记录</p>
              <p className="text-xs mt-1">点击右上角“记录”也可以随时新建</p>
            </div>
          </div>
        )}
      </div>

      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={handleCloseEditor}>
        <DialogContent className="glass-card border-0 max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingLog ? '编辑日志' : '新日志'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* Date Input */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                日期
              </label>
              <Input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="bg-secondary/50 border-0 rounded-xl"
              />
            </div>

            {/* Image Upload Area */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                图片（可选）
              </label>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                id="yy-log-image"
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0] ?? null;
                  if (logImagePreview.startsWith('blob:')) URL.revokeObjectURL(logImagePreview);
                  setLogImageFile(file);
                  setLogImageRemoved(false);
                  setLogImageStatus('idle');
                  if (file) {
                    setLogImagePreview(URL.createObjectURL(file));
                  } else {
                    setLogImagePreview(editingLog?.imageUrl ?? '');
                  }
                  e.currentTarget.value = '';
                }}
                disabled={!currentUserId || logImageStatus === 'uploading'}
              />

              {logImagePreview ? (
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
                    <img src={logImagePreview} alt="log" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-3">
                    <label
                      htmlFor="yy-log-image"
                      className={
                        "flex-1 h-10 px-4 inline-flex items-center justify-center rounded-xl bg-grayWhite-white text-[#1f1f1f] hover:bg-grayWhite-50 active:bg-grayWhite-100 transition-colors duration-220 ease-kimi " +
                        (!currentUserId || logImageStatus === 'uploading'
                          ? 'opacity-40 cursor-not-allowed pointer-events-none'
                          : 'cursor-pointer')
                      }
                    >
                      更换图片
                    </label>
                    <button
                      type="button"
                      className={
                        "flex-1 h-10 px-4 inline-flex items-center justify-center rounded-xl bg-grayWhite-white text-[#1f1f1f] hover:bg-grayWhite-50 active:bg-grayWhite-100 transition-colors duration-220 ease-kimi " +
                        (logImageStatus === 'uploading'
                          ? 'opacity-40 cursor-not-allowed pointer-events-none'
                          : 'cursor-pointer')
                      }
                      onClick={() => {
                        if (logImagePreview.startsWith('blob:')) URL.revokeObjectURL(logImagePreview);
                        setLogImageFile(null);
                        setLogImagePreview('');
                        setLogImageRemoved(true);
                        setLogImageStatus('idle');
                      }}
                      disabled={logImageStatus === 'uploading'}
                    >
                      移除
                    </button>
                  </div>
                  {logImageStatus === 'uploading' && (
                    <div className="text-sm text-muted-foreground">图片上传中…</div>
                  )}
                  {logImageStatus === 'error' && (
                    <div className="text-sm text-muted-foreground">图片上传失败，请重试。</div>
                  )}
                </div>
              ) : (
                <label
                  htmlFor="yy-log-image"
                  className={
                    "border-2 border-dashed border-border rounded-2xl p-6 text-center block " +
                    (!currentUserId || logImageStatus === 'uploading'
                      ? 'opacity-40 cursor-not-allowed pointer-events-none'
                      : 'cursor-pointer')
                  }
                >
                  <span className="material-symbols text-3xl text-muted-foreground mb-2 block">
                    add_photo_alternate
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {currentUserId ? '点击添加图片' : '登录后可添加图片'}
                  </p>
                </label>
              )}
            </div>

            {/* Content Input */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                内容
              </label>
              <Textarea
                placeholder="记录你的美学感悟..."
                value={logContent}
                onChange={(e) => setLogContent(e.target.value)}
                className="bg-secondary/50 border-0 rounded-xl resize-none"
                rows={5}
              />
            </div>

            {/* Tags Input */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                标签（用逗号分隔）
              </label>
              <Input
                placeholder="例如: 极简主义, 建筑, 光影"
                value={logTags}
                onChange={(e) => setLogTags(e.target.value)}
                className="bg-secondary/50 border-0 rounded-xl"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleCloseEditor}
                className="flex-1 rounded-xl"
              >
                取消
              </Button>
              <Button
                onClick={handleSaveLog}
                className="flex-1 rounded-xl"
                disabled={logImageStatus === 'uploading'}
              >
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
            <DialogTitle className="font-serif text-xl">删除这条日志？</DialogTitle>
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
