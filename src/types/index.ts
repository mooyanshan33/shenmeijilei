// Aesthetic Type Definition
export interface AestheticType {
  id: string;
  name: string;
  nameEn: string;
  origin: string;
  era: string;
  description: string;
  features: string[];
  coverImage: string;
  gallery: string[];
  relatedArtists: string[];
  tags?: string[];
}

// User Contribution Definition
export interface Contribution {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  imageUrl: string;
  caption: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
  comments: number;
  createdAt: string;
}

export interface ContributionComment {
  id: string;
  contributionId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

// Aesthetic Log Definition
export interface AestheticLog {
  id: string;
  userId: string;
  date: string;
  content: string;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
}

// User Profile Definition
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  logCount: number;
  contributionCount: number;
  favoriteCount: number;
}

// Aesthetic Category Definition
export interface AestheticCategory {
  id: string;
  name: string;
  icon?: string;
}

// Aesthetic Video Definition
export interface AestheticVideo {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  views: string;
  author: string;
  category: string;
}

// Navigation Tab Type
export type TabType = 'explore' | 'contributions' | 'logs' | 'profile';

// Theme Type
export type ThemeType = 'light' | 'dark';
