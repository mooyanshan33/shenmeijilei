import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { Shield, Users, Search, Crown, User } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  role: 'user' | 'admin';
  created_at: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data as Profile[]);
    } catch (error) {
      console.error('获取用户失败:', error);
      toast.error('获取用户失败');
    } finally {
      setLoading(false);
    }
  }

  async function toggleUserRole(userId: string, newRole: 'user' | 'admin') {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast.success(`用户角色已更新为: ${newRole === 'admin' ? '管理员' : '普通用户'}`);
    } catch (error) {
      console.error('更新用户失败:', error);
      toast.error('更新失败');
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4 p-4 border border-border rounded-lg">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
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
            placeholder="搜索用户..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as any)}
          className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">所有角色</option>
          <option value="user">普通用户</option>
          <option value="admin">管理员</option>
        </select>
      </div>

      {/* 用户列表 */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            没有找到用户
          </div>
        ) : (
          filteredUsers.map(user => (
            <div key={user.id} className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-card transition-colors">
              <img
                src={user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{user.username}</p>
                  {user.role === 'admin' && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                      <Crown className="w-3 h-3" />
                      管理员
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  加入于 {new Date(user.created_at).toLocaleDateString('zh-CN')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {user.role === 'admin' ? (
                  <button
                    onClick={() => toggleUserRole(user.id, 'user')}
                    className="text-xs px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-1"
                  >
                    <User className="w-3 h-3" />
                    降级用户
                  </button>
                ) : (
                  <button
                    onClick={() => toggleUserRole(user.id, 'admin')}
                    className="text-xs px-3 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors flex items-center gap-1"
                  >
                    <Shield className="w-3 h-3" />
                    提升管理员
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
