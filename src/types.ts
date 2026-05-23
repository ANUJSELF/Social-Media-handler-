export interface Scene {
  sceneNumber: number;
  visualPrompt: string;
  dialogue: string;
  voiceoverText: string;
  duration: number; // in seconds
  imageUrl?: string;
  captionEnglish?: string;
  captionHindi?: string;
  captionBilingual?: string;
}

export interface VideoIdea {
  id: string;
  title: string;
  niche: string;
  hook: string;
  targetAudience: string;
  vibe: 'energetic' | 'informative' | 'calm' | 'cinematic' | 'mysterious';
  durationSeconds: number;
  status: 'pending' | 'scripted' | 'generated' | 'posted';
  createdAt: string;
}

export interface VideoScript {
  id: string;
  ideaId: string;
  title: string;
  voiceName: string; // 'Kore' | 'Zephyr' | 'Puck' etc.
  scenes: Scene[];
  createdAt: string;
  completed: boolean;
  videoAssetUrl?: string; // compiled video simulation properties
}

export interface PlatformMetric {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  watchTimeHours?: number;
}

export interface DemographicItem {
  label: string;
  value: number;
}

export interface SocialPostCustomMetrics {
  language: string;
  hashtags: string[];
  retentionCurve: number[]; // e.g. [100, 85, 70, 55, 45]
  demographics: {
    age: DemographicItem[];
    gender: DemographicItem[];
    countries: DemographicItem[];
  };
}

export interface SocialPost {
  id: string;
  scriptId: string;
  title: string;
  niche: string;
  postedAt: string;
  youtube?: PlatformMetric;
  instagram?: PlatformMetric;
  thumbnailUrl: string;
  videoAssetUrl?: string; // url to simulated compiled video
  analytics?: SocialPostCustomMetrics; // advanced analytics extension
}

export interface AutomationSettings {
  autoPilotEnabled: boolean;
  postTime: string; // "08:30"
  selectedNiche: string;
  youtubeConnected: boolean;
  instagramConnected: boolean;
  youtubeChannelName: string;
  instagramUsername: string;
  contentLanguage: 'english' | 'hindi' | 'bilingual_hinglish' | 'spanish' | 'japanese';
  styleTheme: 'standard' | 'anime_naruto' | 'neon_cyberpunk' | 'vibrant_comic' | 'science_editorial';
  youtubeClientId?: string;
  youtubeClientSecret?: string;
  instagramAccessToken?: string;
  instagramPassword?: string;
  targetFormat?: 'shorts' | 'long_form_7min' | 'both';
  dailyInstaPostsCount?: number;
  customHashtags?: string;
  autoUploadToPlatforms?: boolean;
}

export interface AutomationLog {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}
