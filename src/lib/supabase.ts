import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for better type safety
export type Database = {
  public: {
    Tables: {
      creators: {
        Row: {
          id: string;
          profile_pic: string | null;
          username: string;
          username_tag: string | null;
          bio: string | null;
          location: string | null;
          email: string | null;
          followers: number;
          followers_change: number | null;
          followers_change_type: 'positive' | 'negative' | null;
          engagement: number;
          engagement_change: number | null;
          engagement_change_type: 'positive' | 'negative' | null;
          avg_views: number;
          avg_views_change: number | null;
          avg_views_change_type: 'positive' | 'negative' | null;
          avg_likes: number | null;
          avg_likes_change: number | null;
          avg_likes_change_type: 'positive' | 'negative' | null;
          avg_comments: number | null;
          avg_comments_change: number | null;
          avg_comments_change_type: 'positive' | 'negative' | null;
          buzz_score: number;
          niches: string[];
          hashtags: string[] | null;
          thumbnails: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_pic?: string | null;
          username: string;
          username_tag?: string | null;
          bio?: string | null;
          location?: string | null;
          email?: string | null;
          followers: number;
          followers_change?: number | null;
          followers_change_type?: 'positive' | 'negative' | null;
          engagement: number;
          engagement_change?: number | null;
          engagement_change_type?: 'positive' | 'negative' | null;
          avg_views: number;
          avg_views_change?: number | null;
          avg_views_change_type?: 'positive' | 'negative' | null;
          avg_likes?: number | null;
          avg_likes_change?: number | null;
          avg_likes_change_type?: 'positive' | 'negative' | null;
          avg_comments?: number | null;
          avg_comments_change?: number | null;
          avg_comments_change_type?: 'positive' | 'negative' | null;
          buzz_score: number;
          niches: string[];
          hashtags?: string[] | null;
          thumbnails: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_pic?: string | null;
          username?: string;
          username_tag?: string | null;
          bio?: string | null;
          location?: string | null;
          email?: string | null;
          followers?: number;
          followers_change?: number | null;
          followers_change_type?: 'positive' | 'negative' | null;
          engagement?: number;
          engagement_change?: number | null;
          engagement_change_type?: 'positive' | 'negative' | null;
          avg_views?: number;
          avg_views_change?: number | null;
          avg_views_change_type?: 'positive' | 'negative' | null;
          avg_likes?: number | null;
          avg_likes_change?: number | null;
          avg_likes_change_type?: 'positive' | 'negative' | null;
          avg_comments?: number | null;
          avg_comments_change?: number | null;
          avg_comments_change_type?: 'positive' | 'negative' | null;
          buzz_score?: number;
          niches?: string[];
          hashtags?: string[] | null;
          thumbnails?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_recommended_creators: {
        Row: {
          id: string;
          creator_id: string;
          user_id: string;
          match_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          user_id: string;
          match_score: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          user_id?: string;
          match_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      social_media: {
        Row: {
          id: string;
          creator_id: string;
          platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
          username: string;
          url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
          username: string;
          url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          platform?: 'instagram' | 'tiktok' | 'youtube' | 'twitter';
          username?: string;
          url?: string;
          created_at?: string;
        };
      };
      niches: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      ai_recommended_creators_view: {
        Row: {
          id: string;
          profile_pic: string | null;
          username: string;
          username_tag: string | null;
          bio: string | null;
          location: string | null;
          email: string | null;
          followers: number;
          followers_change: number | null;
          followers_change_type: 'positive' | 'negative' | null;
          engagement: number;
          engagement_change: number | null;
          engagement_change_type: 'positive' | 'negative' | null;
          avg_views: number;
          avg_views_change: number | null;
          avg_views_change_type: 'positive' | 'negative' | null;
          avg_likes: number | null;
          avg_likes_change: number | null;
          avg_likes_change_type: 'positive' | 'negative' | null;
          avg_comments: number | null;
          avg_comments_change: number | null;
          avg_comments_change_type: 'positive' | 'negative' | null;
          buzz_score: number;
          niches: string[];
          hashtags: string[] | null;
          thumbnails: string[];
          match_score: number;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};