import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { AestheticEditor } from './AestheticEditor';

interface AestheticType {
  id: string;
  name_cn: string;
  name_en: string;
  category_id?: string;
  subcategory_id?: string;
  cover_image: string;
  gallery_images?: string[];
  summary: string;
  origin?: string;
  history?: string;
  key_features?: string[];
  keywords?: string[];
  popularity_score?: number;
  community_posts_count?: number;
  mood_tags?: string[];
  era?: string;
  region?: string;
  is_active?: boolean;
}

export function AdminAesthetics() {
  const [aesthetics, setAesthetics] = useState<AestheticType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingAesthetic, setEditingAesthetic] = useState<AestheticType | null>(null);

  useEffect(() => {
    fetchAesthetics();
  }, []);

  async function fetchAesthetics() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('aesthetic_types')
        .select('*')
        .order('name_cn');

      if (error) throw error;
      setAesthetics(data || []);
    } catch (error) {
      console.error('获取美学数据失败:', error);
      toast.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  }

  async function deleteAesthetic(id: string) {
    if (!confirm('确定要删除这个美学类型吗？此操作不可撤销！')) return;

    try {
      const { error } = await supabase
        .from('aesthetic_types')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAesthetics(prev => prev.filter(a => a.id !== id));
      toast.success('删除成功');
    } catch (error) {
      console.error('删除失败:', error);
      toast.error('删除失败');
    }
  }

  async function toggleActive(id: string, current: boolean) {
    try {
      const { error } = await supabase
        .from('aesthetic_types')
        .update({ is_active: !current })
        .eq('id', id);

      if (error) throw error;

      setAesthetics(prev =>
        prev.map(a => a.id === id ? { ...a, is_active: !current } : a)
      );
      toast.success('状态已更新');
    } catch (error) {
      console.error('更新失败:', error);
      toast.error('更新失败');
    }
  }

  const filteredAesthetics = aesthetics.filter(a =>
    a.name_cn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4 p-4 border border-border rounded-lg">
            <Skeleton className="w-24 h-24 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (showEditor) {
    return (
      <AestheticEditor
        aesthetic={editingAesthetic}
        onSave={() => {
          setShowEditor(false);
          setEditingAesthetic(null);
          fetchAesthetics();
        }}
        onCancel={() => {
          setShowEditor(false);
          setEditingAesthetic(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索美学类型..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={() => {
            setEditingAesthetic(null);
            setShowEditor(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加新美学
        </button>
      </div>

      {/* 美学列表 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">预览</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">名称</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">分类</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">流行度</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">状态</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredAesthetics.map(aesthetic => (
              <tr key={aesthetic.id} className="border-b border-border hover:bg-muted/50">
                <td className="py-4 px-4">
                  <img
                    src={aesthetic.cover_image}
                    alt={aesthetic.name_cn}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium text-foreground">{aesthetic.name_cn}</div>
                  <div className="text-sm text-muted-foreground">{aesthetic.name_en}</div>
                </td>
                <td className="py-4 px-4 text-sm text-muted-foreground">
                  {aesthetic.category_id || '-'}
                </td>
                <td className="py-4 px-4 text-sm text-muted-foreground">
                  {aesthetic.popularity_score || 0}
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => toggleActive(aesthetic.id, aesthetic.is_active ?? true)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      aesthetic.is_active ?? true
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {aesthetic.is_active ?? true ? '启用' : '禁用'}
                  </button>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingAesthetic(aesthetic);
                        setShowEditor(true);
                      }}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteAesthetic(aesthetic.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAesthetics.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery ? '没有找到匹配的结果' : '暂无美学数据'}
        </div>
      )}
    </div>
  );
}
