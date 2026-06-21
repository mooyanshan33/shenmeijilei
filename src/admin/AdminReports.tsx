import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { Check, X, Eye, AlertTriangle, Flag } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Report {
  id: string;
  reporter_id: string;
  post_id?: string;
  comment_id?: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
  reporter?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  post?: {
    id: string;
    image_url: string;
    content?: string;
    author_id: string;
  };
  comment?: {
    id: string;
    content: string;
    author_id: string;
  };
}

export function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          reporter:reporter_id (id, username, avatar_url),
          post:post_id (id, image_url, content, author_id),
          comment:comment_id (id, content, author_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data as Report[]);
    } catch (error) {
      console.error('获取举报失败:', error);
      toast.error('获取举报失败');
    } finally {
      setLoading(false);
    }
  }

  async function updateReportStatus(reportId: string, newStatus: 'resolved' | 'dismissed') {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: newStatus })
        .eq('id', reportId);

      if (error) throw error;

      setReports(prev => prev.map(report =>
        report.id === reportId ? { ...report, status: newStatus } : report
      ));

      toast.success(`举报已标记为${newStatus === 'resolved' ? '已处理' : '已驳回'}`);
    } catch (error) {
      console.error('更新举报失败:', error);
      toast.error('更新失败');
    }
  }

  async function takeAction(report: Report) {
    if (report.post) {
      // 处理帖子 - 隐藏它
      await supabase
        .from('posts')
        .update({ status: 'hidden' })
        .eq('id', report.post.id);

      toast.success('帖子已隐藏');
    }

    if (report.comment) {
      // 处理评论 - 删除它
      await supabase
        .from('comments')
        .delete()
        .eq('id', report.comment.id);

      toast.success('评论已删除');
    }

    // 标记举报为已解决
    await updateReportStatus(report.id, 'resolved');
  }

  const filteredReports = reports.filter(report =>
    filterStatus === 'all' || report.status === filterStatus
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-5 w-48" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 筛选 */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">筛选状态:</span>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">所有</option>
          <option value="pending">待处理</option>
          <option value="resolved">已解决</option>
          <option value="dismissed">已驳回</option>
        </select>
      </div>

      {/* 举报列表 */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            没有举报记录
          </div>
        ) : (
          filteredReports.map(report => (
            <div
              key={report.id}
              className={cn(
                'p-4 border rounded-lg transition-colors',
                report.status === 'pending' ? 'border-yellow-400 bg-yellow-50/30' : 'border-border',
                'hover:bg-card'
              )}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={report.reporter?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt={report.reporter?.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      {report.reporter?.username || '匿名用户'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(report.created_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  'px-3 py-1 text-xs rounded-full font-medium',
                  report.status === 'pending' && 'bg-yellow-100 text-yellow-700',
                  report.status === 'resolved' && 'bg-green-100 text-green-700',
                  report.status === 'dismissed' && 'bg-gray-100 text-gray-700'
                )}>
                  {getStatusText(report.status)}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flag className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">举报原因:</span>
                </div>
                <p className="text-sm text-foreground/80 bg-secondary/50 p-3 rounded-lg">
                  {report.reason}
                </p>
              </div>

              {/* 举报内容预览 */}
              {report.post && (
                <div className="mb-4 p-3 border border-border rounded-lg">
                  <div className="text-xs text-muted-foreground mb-2">被举报的帖子:</div>
                  <div className="flex gap-3">
                    <img
                      src={report.post.image_url}
                      alt="帖子"
                      className="w-20 h-20 object-cover rounded"
                    />
                    {report.post.content && (
                      <p className="text-sm text-foreground/80 line-clamp-3">
                        {report.post.content}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {report.comment && (
                <div className="mb-4 p-3 border border-border rounded-lg">
                  <div className="text-xs text-muted-foreground mb-2">被举报的评论:</div>
                  <p className="text-sm text-foreground/80">
                    {report.comment.content}
                  </p>
                </div>
              )}

              {/* 操作按钮 */}
              {report.status === 'pending' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => takeAction(report)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    处理并下架
                  </button>
                  <button
                    onClick={() => updateReportStatus(report.id, 'resolved')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    <Check className="w-4 h-4" />
                    标记已解决
                  </button>
                  <button
                    onClick={() => updateReportStatus(report.id, 'dismissed')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    驳回
                  </button>
                </div>
              )}
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
    pending: '待处理',
    resolved: '已解决',
    dismissed: '已驳回'
  };
  return map[status] || status;
}
