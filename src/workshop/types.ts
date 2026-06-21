// ============================================================
// 扩容版 Workshop 类型定义
// ============================================================

// 用户角色
export type UserRole = 'user' | 'admin';

// 帖子状态
export type PostStatus = 'published' | 'under_review' | 'hidden';

// 举报状态
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

// 举报原因预设
export const REPORT_REASONS = [
  { id: 'spam', label: '垃圾广告' },
  { id: 'hostile', label: '不友善内容' },
  { id: 'plagiarism', label: '抄袭' },
  { id: 'inappropriate', label: '不适宜内容' },
  { id: 'other', label: '其他' }
] as const;

export type ReportReason = typeof REPORT_REASONS[number]['id'];

// 用户资料
export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

// 评论
export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: Profile;
}

// 点赞
export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

// 帖子
export interface Post {
  id: string;
  author_id: string;
  image_url: string;
  content?: string;
  tags: string[];
  status: PostStatus;
  created_at: string;
  author?: Profile;
}

// 带元数据的完整帖子
export interface PostWithMeta extends Post {
  likes_count: number;
  comments_count: number;
  is_liked_by_me: boolean;
}

// 举报
export interface Report {
  id: string;
  reporter_id: string;
  post_id?: string;
  comment_id?: string;
  reason: string;
  status: ReportStatus;
  created_at: string;
}

// 发布帖子输入
export interface PublishPostInput {
  image_url: string;
  content?: string;
  tags: string[];
}

// 发布评论输入
export interface PublishCommentInput {
  post_id: string;
  content: string;
}

// 举报输入
export interface CreateReportInput {
  post_id?: string;
  comment_id?: string;
  reason: string;
}

// Hook 返回状态
export interface WorkshopState {
  posts: PostWithMeta[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

// 点赞操作结果
export interface ToggleLikeResult {
  post_id: string;
  liked: boolean;
  new_likes_count: number;
}
