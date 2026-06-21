// Color Palette Interface
export interface ColorPalette {
  name: string;
  hex: string;
}

// Timeline Entry Interface
export interface TimelineEntry {
  year: string;
  event: string;
}

// Representative Artist Interface
export interface RepresentativeArtist {
  id: string;
  name: string;
  nationality: string;
  lifespan: string;
  imageUrl?: string;
}

// Representative Work Interface
export interface RepresentativeWork {
  id: string;
  title: string;
  artist: string;
  year: string;
  imageUrl?: string;
}

// Enhanced Aesthetic Type Definition
export interface AestheticType {
  id: string;
  nameCn: string;
  nameEn: string;
  coverImage: string;
  galleryImages: string[];
  summary: string;
  origin: string;
  history: string;
  keyFeatures: string[];
  colorPalette: ColorPalette[];
  keywords: string[];
  representativeArtists: RepresentativeArtist[];
  representativeWorks: RepresentativeWork[];
  relatedAesthetics: string[];
  timeline: TimelineEntry[];
  popularityScore: number;
  communityPostsCount: number;
  categoryId: string;
  subcategoryId?: string;
  moodTags: string[];
  era: string;
  region: string;
}

// Subcategory Interface
export interface AestheticSubcategory {
  id: string;
  name: string;
  nameEn: string;
  icon?: string;
  aesthetics: string[];
}

// Category Interface
export interface AestheticCategory {
  id: string;
  name: string;
  nameEn: string;
  icon?: string;
  subcategories: AestheticSubcategory[];
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
  aestheticId?: string;
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
  favoriteAesthetics: string[];
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
  aestheticId?: string;
}

// Navigation Tab Type
export type TabType = 'explore' | 'contributions' | 'logs' | 'profile';

// Theme Type
export type ThemeType = 'light' | 'dark';

// Search Filter Interface
export interface SearchFilter {
  query?: string;
  categoryId?: string;
  subcategoryId?: string;
  mood?: string[];
  era?: string;
  region?: string;
  colors?: string[];
}

// Mood Option Interface
export interface MoodOption {
  id: string;
  name: string;
  nameEn: string;
  icon?: string;
  color: string;
}

// Color Exploration Option Interface
export interface ColorExplorationOption {
  id: string;
  name: string;
  hex: string;
}
