import React, { useState } from 'react';
import { Shield, Users, Image, MessageSquare, Flag, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminPosts } from './AdminPosts';
import { AdminComments } from './AdminComments';
import { AdminReports } from './AdminReports';
import { AdminUsers } from './AdminUsers';
import { useAuth } from '../workshop/useAuth';

type AdminTab = 'posts' | 'comments' | 'reports' | 'users';

export function AdminPanel() {
  const { user, isAdmin, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('posts');
  const [isOpen, setIsOpen] = useState(false);

  // 权限检查
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <Shield className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-medium text-foreground mb-2">请先登录</h2>
        <p className="text-muted-foreground">你需要登录后才能访问管理后台</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <Shield className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-xl font-medium text-foreground mb-2">权限不足</h2>
        <p className="text-muted-foreground">你没有访问管理后台的权限</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="glass-panel sticky top-0 z-50 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <Shield className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-medium">管理后台</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {user?.name || '管理员'}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 标签切换 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <TabButton
            active={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
            icon={<Image className="w-4 h-4" />}
            label="帖子管理"
          />
          <TabButton
            active={activeTab === 'comments'}
            onClick={() => setActiveTab('comments')}
            icon={<MessageSquare className="w-4 h-4" />}
            label="评论管理"
          />
          <TabButton
            active={activeTab === 'reports'}
            onClick={() => setActiveTab('reports')}
            icon={<Flag className="w-4 h-4" />}
            label="举报管理"
          />
          <TabButton
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
            icon={<Users className="w-4 h-4" />}
            label="用户管理"
          />
        </div>

        {/* 内容区域 */}
        <div className="animate-in fade-in duration-300">
          {activeTab === 'posts' && <AdminPosts />}
          {activeTab === 'comments' && <AdminComments />}
          {activeTab === 'reports' && <AdminReports />}
          {activeTab === 'users' && <AdminUsers />}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      )}
    >
      {icon}
      {label}
    </button>
  );
}
