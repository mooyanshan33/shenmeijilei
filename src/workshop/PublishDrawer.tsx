import { useState, useCallback, useRef } from 'react';
import { Upload, X, ImagePlus, Tag } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { PublishPostInput } from './types';

interface PublishDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: PublishPostInput) => Promise<void>;
  onUpload: (file: File) => Promise<string>;
  isSubmitting?: boolean;
}

const MAX_CONTENT_LENGTH = 500;
const MAX_TAGS = 5;

export function PublishDrawer({
  open,
  onOpenChange,
  onSubmit,
  onUpload,
  isSubmitting = false,
}: PublishDrawerProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** 处理图片选择 */
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 校验文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 校验文件大小 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('图片大小不能超过 10MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadedUrl(null);
  }, []);

  /** 添加标签 */
  const handleAddTag = useCallback(() => {
    const trimmed = tagInput.trim().toLowerCase().replace(/^#+/, '');
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      setTagInput('');
      return;
    }
    if (tags.length >= MAX_TAGS) {
      alert(`最多只能添加 ${MAX_TAGS} 个标签`);
      return;
    }
    setTags((prev) => [...prev, trimmed]);
    setTagInput('');
  }, [tagInput, tags]);

  /** 移除标签 */
  const handleRemoveTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  /** 提交 */
  const handleSubmit = useCallback(async () => {
    if (!uploadedUrl && !imageFile) {
      alert('请先上传图片');
      return;
    }
    if (!content.trim()) {
      alert('请输入心得文字');
      return;
    }

    setIsUploading(true);
    try {
      let finalUrl = uploadedUrl;
      if (!finalUrl && imageFile) {
        finalUrl = await onUpload(imageFile);
      }

      await onSubmit({
        imageUrl: finalUrl!,
        content: content.trim(),
        tags,
      });

      // 重置表单
      setImageFile(null);
      setImagePreview(null);
      setContent('');
      setTags([]);
      setTagInput('');
      setUploadedUrl(null);
      onOpenChange(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  }, [imageFile, uploadedUrl, content, tags, onUpload, onSubmit, onOpenChange]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="px-4 pb-2">
          <DrawerTitle className="text-base font-medium">发布心得</DrawerTitle>
          <DrawerDescription className="text-xs">
            分享你的审美发现
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* 图片上传区 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              图片
            </label>
            {imagePreview ? (
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted border border-border/70">
                <img
                  src={imagePreview}
                  alt="预览"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    setUploadedUrl(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  aria-label="移除图片"
                >
                  <X className="w-4 h-4" />
                </button>
                {isSubmitting && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'w-full aspect-[4/3] rounded-lg border-2 border-dashed border-border/70',
                  'flex flex-col items-center justify-center gap-2',
                  'bg-secondary/30 hover:bg-secondary/50 transition-colors',
                  'text-muted-foreground'
                )}
              >
                <ImagePlus className="w-8 h-8" />
                <span className="text-sm">点击上传图片</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* 文字输入 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              心得
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))}
              placeholder="记录你的审美发现..."
              rows={4}
              className={cn(
                'w-full px-3 py-2 rounded-lg border border-input bg-background',
                'text-sm text-foreground placeholder:text-muted-foreground',
                'resize-none focus:outline-none focus:ring-2 focus:ring-ring/50',
                'transition-shadow duration-220'
              )}
            />
            <div className="text-right text-xs text-muted-foreground">
              {content.length}/{MAX_CONTENT_LENGTH}
            </div>
          </div>

          {/* 标签输入 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              标签 <span className="text-muted-foreground font-normal">(可选)</span>
            </label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="输入标签后回车"
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                <Tag className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      'inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full',
                      'bg-secondary text-muted-foreground'
                    )}
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-foreground transition-colors"
                      aria-label={`移除标签 ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <DrawerFooter className="px-4 pt-4 border-t border-border/50">
          <div className="flex gap-3">
            <DrawerClose asChild>
              <Button variant="secondary" className="flex-1">
                取消
              </Button>
            </DrawerClose>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (!uploadedUrl && !imageFile) || !content.trim()}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current/50 border-t-current rounded-full animate-spin mr-2" />
                  发布中...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  发布
                </>
              )}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
