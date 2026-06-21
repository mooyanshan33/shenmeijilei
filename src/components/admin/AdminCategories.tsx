import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Category {
  id: string;
  name: string;
  name_en: string;
  icon?: string;
}

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  name_en: string;
  icon?: string;
}

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const [catResult, subcatResult] = await Promise.all([
        supabase.from('aesthetic_categories').select('*').order('name'),
        supabase.from('aesthetic_subcategories').select('*').order('name'),
      ]);

      if (catResult.error) throw catResult.error;
      if (subcatResult.error) throw subcatResult.error;

      setCategories(catResult.data || []);
      setSubcategories(subcatResult.data || []);
    } catch (error) {
      console.error('获取分类失败:', error);
      toast.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  }

  async function saveCategory(category: Partial<Category>) {
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('aesthetic_categories')
          .update({ ...category, updated_at: new Date().toISOString() })
          .eq('id', editingCategory.id);
        if (error) throw error;
        toast.success('更新成功');
      } else {
        const { error } = await supabase
          .from('aesthetic_categories')
          .insert(category);
        if (error) throw error;
        toast.success('创建成功');
      }

      setShowCategoryForm(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('保存失败:', error);
      toast.error('保存失败');
    }
  }

  async function saveSubcategory(subcategory: Partial<Subcategory>) {
    try {
      if (editingSubcategory) {
        const { error } = await supabase
          .from('aesthetic_subcategories')
          .update({ ...subcategory, updated_at: new Date().toISOString() })
          .eq('id', editingSubcategory.id);
        if (error) throw error;
        toast.success('更新成功');
      } else {
        const { error } = await supabase
          .from('aesthetic_subcategories')
          .insert(subcategory);
        if (error) throw error;
        toast.success('创建成功');
      }

      setShowSubcategoryForm(false);
      setEditingSubcategory(null);
      fetchCategories();
    } catch (error) {
      console.error('保存失败:', error);
      toast.error('保存失败');
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm('确定要删除这个分类吗？相关子分类也会被影响。')) return;

    try {
      const { error } = await supabase
        .from('aesthetic_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success('删除成功');
    } catch (error) {
      console.error('删除失败:', error);
      toast.error('删除失败');
    }
  }

  async function deleteSubcategory(id: string) {
    if (!confirm('确定要删除这个子分类吗？')) return;

    try {
      const { error } = await supabase
        .from('aesthetic_subcategories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubcategories(prev => prev.filter(s => s.id !== id));
      toast.success('删除成功');
    } catch (error) {
      console.error('删除失败:', error);
      toast.error('删除失败');
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-4 border border-border rounded-lg space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (showCategoryForm || showSubcategoryForm) {
    return (
      <CategoryForm
        category={editingCategory}
        subcategory={editingSubcategory}
        categories={categories}
        onSave={(data) => {
          if (editingSubcategory || 'category_id' in data) {
            saveSubcategory(data as Partial<Subcategory>);
          } else {
            saveCategory(data as Partial<Category>);
          }
        }}
        onCancel={() => {
          setShowCategoryForm(false);
          setShowSubcategoryForm(false);
          setEditingCategory(null);
          setEditingSubcategory(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* 分类管理 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">分类管理</h2>
          <button
            onClick={() => setShowCategoryForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加分类
          </button>
        </div>

        <div className="space-y-3">
          {categories.map(category => (
            <div key={category.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-foreground">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.name_en}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setShowCategoryForm(true);
                    }}
                    className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 子分类列表 */}
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">子分类</span>
                  <button
                    onClick={() => {
                      setEditingSubcategory({ id: '', category_id: category.id, name: '', name_en: '' });
                      setShowSubcategoryForm(true);
                    }}
                    className="text-xs px-3 py-1 bg-secondary rounded hover:bg-secondary/80 transition-colors"
                  >
                    + 添加
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {subcategories
                    .filter(s => s.category_id === category.id)
                    .map(subcategory => (
                      <div key={subcategory.id} className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-sm">
                        <span>{subcategory.name}</span>
                        <button
                          onClick={() => {
                            setEditingSubcategory(subcategory);
                            setShowSubcategoryForm(true);
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deleteSubcategory(subcategory.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryForm({
  category,
  subcategory,
  categories,
  onSave,
  onCancel
}: {
  category?: Category | null;
  subcategory?: Subcategory | null;
  categories: Category[];
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(() => {
    if (subcategory) {
      return { category_id: subcategory.category_id, name: subcategory.name, name_en: subcategory.name_en };
    }
    if (category) {
      return { id: category.id, name: category.name, name_en: category.name_en };
    }
    return { id: '', name: '', name_en: '' };
  });

  const isSubcategory = !!subcategory || 'category_id' in formData;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-semibold">
        {isSubcategory ? (subcategory ? '编辑子分类' : '创建子分类') : (category ? '编辑分类' : '创建分类')}
      </h2>

      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
        {isSubcategory ? (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">所属分类</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              required
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">ID</label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="例如：classical"
              disabled={!!category}
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">中文名称</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">英文名称</label>
          <input
            type="text"
            value={formData.name_en}
            onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

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
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
}
