import React, { useState } from 'react';
import { Shield, Database, Users, Image, MessageSquare, ArrowLeft } from 'lucide-react';
import { AdminAesthetics } from './AdminAesthetics';
import { AdminCategories } from './AdminCategories';
import { AdminUsers } from '../admin/AdminUsers';
import { AdminPosts } from '../admin/AdminPosts';
import { AdminComments } from '../admin/AdminComments';
import { useAuth } from '../../workshop/useAuth';

type AdminTab = 'aesthetics' | 'categories' | 'users' | 'posts' | 'comments';

export function DataAdminPanel() {
  const { user, isAdmin, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('aesthetics');

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
        <p className="text-muted-foreground">你需要登录后才能访问数据管理后台</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <Shield className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-xl font-medium text-foreground mb-2">权限不足</h2>
        <p className="text-muted-foreground">你没有访问数据管理后台的权限</p>
      </div>
    );
  }

  const tabs = [
    { id: 'aesthetics', label: '美学数据', icon: <Database className="w-4 h-4" /> },
    { id: 'categories', label: '分类管理', icon: <Image className="w-4 h-4" /> },
    { id: 'users', label: '用户管理', icon: <Users className="w-4 h-4" /> },
    { id: 'posts', label: '投稿管理', icon: <Image className="w-4 h-4" /> },
    { id: 'comments', label: '评论管理', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="glass-panel sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <h1 className="text-lg font-medium">数据管理后台</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            当前用户：{user?.username || '管理员'}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 标签切换 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="animate-in fade-in duration-300">
          {activeTab === 'aesthetics' && <AdminAesthetics />}
          {activeTab === 'categories' && <AdminCategories />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'posts' && <AdminPosts />}
          {activeTab === 'comments' && <AdminComments />}
        </div>
      </div>
    </div>
  );
}
