import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

interface AestheticEditorProps {
  aesthetic?: any | null;
  onSave: () => void;
  onCancel: () => void;
}

export function AestheticEditor({ aesthetic, onSave, onCancel }: AestheticEditorProps) {
  const [formData, setFormData] = useState({
    id: '',
    category_id: '',
    subcategory_id: '',
    name_cn: '',
    name_en: '',
    cover_image: '',
    gallery_images: [] as string[],
    summary: '',
    origin: '',
    history: '',
    key_features: [] as string[],
    keywords: [] as string[],
    popularity_score: 0,
    mood_tags: [] as string[],
    era: '',
    region: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  useEffect(() => {
    if (aesthetic) {
      setFormData({
        id: aesthetic.id,
        category_id: aesthetic.category_id || '',
        subcategory_id: aesthetic.subcategory_id || '',
        name_cn: aesthetic.name_cn || '',
        name_en: aesthetic.name_en || '',
        cover_image: aesthetic.cover_image || '',
        gallery_images: aesthetic.gallery_images || [],
        summary: aesthetic.summary || '',
        origin: aesthetic.origin || '',
        history: aesthetic.history || '',
        key_features: aesthetic.key_features || [],
        keywords: aesthetic.keywords || [],
        popularity_score: aesthetic.popularity_score || 0,
        mood_tags: aesthetic.mood_tags || [],
        era: aesthetic.era || '',
        region: aesthetic.region || '',
        is_active: aesthetic.is_active ?? true,
      });
    }

    // 加载分类数据
    fetchCategories();
  }, [aesthetic]);

  async function fetchCategories() {
    const { data: catData } = await supabase.from('aesthetic_categories').select('*');
    const { data: subcatData } = await supabase.from('aesthetic_subcategories').select('*');
    setCategories(catData || []);
    setSubcategories(subcatData || []);
  }

  const handleArrayInput = (field: string, value: string) => {
    const items = value.split(',').map(s => s.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (aesthetic) {
        // 更新
        const { error } = await supabase
          .from('aesthetic_types')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', formData.id);

        if (error) throw error;
        toast.success('更新成功');
      } else {
        // 创建
        if (!formData.id) {
          toast.error('请输入美学ID');
          return;
        }

        const { error } = await supabase
          .from('aesthetic_types')
          .insert(formData);

        if (error) throw error;
        toast.success('创建成功');
      }

      onSave();
    } catch (error) {
      console.error('保存失败:', error);
      toast.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 顶部导航 */}
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </button>
        <h2 className="text-xl font-semibold">
          {aesthetic ? '编辑美学' : '创建新美学'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">基本信息</h3>

            {!aesthetic && (
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.id}
                  onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="例如：minimalism"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                中文名称 *
              </label>
              <input
                type="text"
                required
                value={formData.name_cn}
                onChange={(e) => setFormData(prev => ({ ...prev, name_cn: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                英文名称 *
              </label>
              <input
                type="text"
                required
                value={formData.name_en}
                onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  分类
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">选择分类</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  子分类
                </label>
                <select
                  value={formData.subcategory_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, subcategory_id: e.target.value }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">选择子分类</option>
                  {subcategories.filter(s => s.category_id === formData.category_id).map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                封面图片 URL *
              </label>
              <input
                type="text"
                required
                value={formData.cover_image}
                onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* 详细信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">详细信息</h3>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                简介 *
              </label>
              <textarea
                required
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                起源
              </label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                关键词 (用逗号分隔)
              </label>
              <input
                type="text"
                value={formData.keywords.join(', ')}
                onChange={(e) => handleArrayInput('keywords', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  流行度
                </label>
                <input
                  type="number"
                  value={formData.popularity_score}
                  onChange={(e) => setFormData(prev => ({ ...prev, popularity_score: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-muted-foreground">启用</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 历史和特征 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              历史
            </label>
            <textarea
              value={formData.history}
              onChange={(e) => setFormData(prev => ({ ...prev, history: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              关键特征 (用逗号分隔)
            </label>
            <textarea
              value={formData.key_features.join(', ')}
              onChange={(e) => handleArrayInput('key_features', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
}
