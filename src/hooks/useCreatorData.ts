import { useState, useEffect } from 'react';
import { Creator, CreatorMetrics, Niche, DatabaseFilters, CreatorListMode } from '../types/database';

// Mock data for development - will be replaced with Supabase calls
const mockCreators: Creator[] = [
  {
    id: '1',
    profile_pic: '/images/creator-1.jpg',
    match_score: 91,  // AI match score
    buzz_score: 82,   // General buzz score
    username: 'Peter Robbins',
    username_tag: '@peterrobbins',
    social_media: [
      { platform: 'instagram', username: 'peterrobbins', url: 'https://instagram.com/peterrobbins' },
      { platform: 'tiktok', username: 'peterrobbins', url: 'https://tiktok.com/@peterrobbins' }
    ],
    bio: 'Founder • Simpliscale 🏆 IG Stories Have More Value $1M+ Saved with Automation',
    followers: 132043,
    followers_change: 16.24,
    followers_change_type: 'positive',
    engagement: 16.24,
    engagement_change: 16.24,
    engagement_change_type: 'positive',
    avg_views: 32374,
    avg_views_change: 16.24,
    avg_views_change_type: 'positive',
    avg_likes: 78500,
    avg_likes_change: 16.24,
    avg_likes_change_type: 'positive',
    avg_comments: 2580,
    avg_comments_change: 16.24,
    avg_comments_change_type: 'positive',
    niches: ['Productivity', 'Tech'],
    hashtags: ['#ai', '#automation', '#makemoneyonline', '#business', '#operations', '#productivity', '#tech', '#entrepreneur'],
    thumbnails: ['/images/PostThumbnail.svg', '/images/PostThumbnail-1.svg', '/images/PostThumbnail-2.svg'],
    location: 'San Francisco, USA',
    email: 'peter@simpliscale.com',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  // Duplicate for demo purposes
  ...Array(5).fill(null).map((_, index) => ({
    id: `${index + 2}`,
    profile_pic: '/images/creator-1.jpg',
    match_score: 91 - (index * 3), // Different AI match scores: 88, 85, 82, 79, 76
    buzz_score: 75 + (index * 4),  // Different buzz scores: 79, 83, 87, 91, 95
    username: 'Peter Robbins',
    username_tag: '@peterrobbins',
    social_media: [
      { platform: 'instagram', username: 'peterrobbins', url: 'https://instagram.com/peterrobbins' },
      { platform: 'tiktok', username: 'peterrobbins', url: 'https://tiktok.com/@peterrobbins' }
    ],
    bio: 'Founder • Simpliscale 🏆 IG Stories Have More Value $1M+ Saved with Automation',
    followers: 132043 + (index * 10000),
    followers_change: 16.24 - (index * 2), // Varying change percentages
    followers_change_type: index % 2 === 0 ? 'positive' : 'negative',
    engagement: 16.24 + (index * 0.5),
    engagement_change: 16.24 - (index * 1.5),
    engagement_change_type: index % 3 === 0 ? 'positive' : 'negative',
    avg_views: 32374 + (index * 5000),
    avg_views_change: 16.24 + (index * 2),
    avg_views_change_type: 'positive',
    avg_likes: 78500 + (index * 5000),
    avg_likes_change: 16.24 - (index * 1),
    avg_likes_change_type: index % 2 === 0 ? 'positive' : 'negative',
    avg_comments: 2580 + (index * 200),
    avg_comments_change: 16.24 + (index * 0.5),
    avg_comments_change_type: 'positive',
    niches: ['Productivity', 'Tech'],
    hashtags: ['#ai', '#automation', '#makemoneyonline', '#business', '#operations', '#productivity', '#tech', '#entrepreneur'],
    thumbnails: ['/images/PostThumbnail.svg', '/images/PostThumbnail-1.svg', '/images/PostThumbnail-2.svg'],
    location: 'San Francisco, USA',
    email: 'peter@simpliscale.com',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }))
];

const mockNiches: Niche[] = [
  { id: '1', name: 'Productivity', created_at: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'Trading', created_at: '2024-01-01T00:00:00Z' },
  { id: '3', name: 'Crypto', created_at: '2024-01-01T00:00:00Z' },
  { id: '4', name: 'AI', created_at: '2024-01-01T00:00:00Z' },
  { id: '5', name: 'Fashion', created_at: '2024-01-01T00:00:00Z' },
  { id: '6', name: 'Fitness', created_at: '2024-01-01T00:00:00Z' },
  { id: '7', name: 'Travel', created_at: '2024-01-01T00:00:00Z' },
  { id: '8', name: 'Business', created_at: '2024-01-01T00:00:00Z' },
  { id: '9', name: 'Developer', created_at: '2024-01-01T00:00:00Z' },
  { id: '10', name: 'Gaming', created_at: '2024-01-01T00:00:00Z' },
  { id: '11', name: 'Comedy', created_at: '2024-01-01T00:00:00Z' },
  { id: '12', name: 'Finance', created_at: '2024-01-01T00:00:00Z' },
];

// Custom hook for creator data management
export const useCreatorData = () => {
  const [creators, setCreators] = useState<Creator[]>(mockCreators);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>(mockCreators);
  const [aiRecommendedCreators, setAiRecommendedCreators] = useState<Creator[]>(mockCreators); // AI recommended creators
  const [allCreators, setAllCreators] = useState<Creator[]>(mockCreators); // All creators from database
  const [currentMode, setCurrentMode] = useState<CreatorListMode>('ai');
  const [niches, setNiches] = useState<Niche[]>(mockNiches);
  const [metrics, setMetrics] = useState<CreatorMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate metrics based on current filtered creators
  const calculateMetrics = (creatorList: Creator[]): CreatorMetrics => {
    if (creatorList.length === 0) {
      return {
        total_creators: 0,
        avg_followers: 0,
        avg_views: 0,
        avg_engagement: 0,
        change_percentage: 0,
        change_type: 'positive'
      };
    }

    const totalFollowers = creatorList.reduce((sum, creator) => sum + creator.followers, 0);
    const totalViews = creatorList.reduce((sum, creator) => sum + creator.avg_views, 0);
    const totalEngagement = creatorList.reduce((sum, creator) => sum + creator.engagement, 0);

    // Mock change percentage calculation (in real app, this would compare with previous period)
    const changePercentage = Math.random() * 20 - 10; // Random between -10 and +10

    return {
      total_creators: creatorList.length,
      avg_followers: Math.round(totalFollowers / creatorList.length),
      avg_views: Math.round(totalViews / creatorList.length),
      avg_engagement: Math.round((totalEngagement / creatorList.length) * 100) / 100,
      change_percentage: Math.round(changePercentage * 100) / 100,
      change_type: changePercentage >= 0 ? 'positive' : 'negative'
    };
  };

  // Apply filters to creators
  const applyFilters = async (filters: DatabaseFilters, mode: CreatorListMode = currentMode) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual Supabase query
      // For AI mode: query ai_recommended_creators table
      // For All mode: query all creators table
      // const tableName = mode === 'ai' ? 'ai_recommended_creators' : 'creators';
      // const { data, error } = await supabase
      //   .from(tableName)
      //   .select('*')
      //   .in('niches', filters.niches || [])
      //   .gte('followers', filters.followers_min || 0)
      //   .lte('followers', filters.followers_max || 999999999)
      //   // ... other filters

      // Mock filtering logic for development
      const sourceCreators = mode === 'ai' ? aiRecommendedCreators : allCreators;
      let filtered = [...sourceCreators];

      if (filters.niches && filters.niches.length > 0) {
        filtered = filtered.filter(creator => 
          creator.niches.some(niche => filters.niches!.includes(niche))
        );
      }

      if (filters.platforms && filters.platforms.length > 0) {
        filtered = filtered.filter(creator =>
          creator.social_media.some(social => filters.platforms!.includes(social.platform))
        );
      }

      if (filters.match_scores && filters.match_scores.length > 0) {
      }
      if (filters.buzz_scores && filters.buzz_scores.length > 0) {
        filtered = filtered.filter(creator => {
          const score = creator.buzz_score; // Filter by buzz score, not match score
          return filters.buzz_scores!.some(range => {
            switch (range) {
              case '90%+': return score >= 90;
              case '80-90%': return score >= 80 && score < 90;
              case '70-80%': return score >= 70 && score < 80;
              case '60-70%': return score >= 60 && score < 70;
              case 'Less than 60%': return score < 60;
              default: return false;
            }
          });
        });
      }

      if (filters.followers_min !== undefined || filters.followers_max !== undefined) {
        filtered = filtered.filter(creator => 
          creator.followers >= (filters.followers_min || 0) &&
          creator.followers <= (filters.followers_max || 999999999)
        );
      }

      if (filters.engagement_min !== undefined || filters.engagement_max !== undefined) {
        filtered = filtered.filter(creator => 
          creator.engagement >= (filters.engagement_min || 0) &&
          creator.engagement <= (filters.engagement_max || 100)
        );
      }

      if (filters.avg_views_min !== undefined || filters.avg_views_max !== undefined) {
        filtered = filtered.filter(creator => 
          creator.avg_views >= (filters.avg_views_min || 0) &&
          creator.avg_views <= (filters.avg_views_max || 999999999)
        );
      }

      setFilteredCreators(filtered);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Switch between AI recommendations and all creators
  const switchMode = (mode: CreatorListMode) => {
    setCurrentMode(mode);
    const sourceCreators = mode === 'ai' ? aiRecommendedCreators : allCreators;
    setCreators(sourceCreators);
    setFilteredCreators(sourceCreators);
  };

  // Load initial data
  const loadCreators = async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual Supabase query
      // Load both AI recommended and all creators
      // const { data: aiData, error: aiError } = await supabase.from('ai_recommended_creators').select('*');
      // const { data: allData, error: allError } = await supabase.from('creators').select('*');
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, use same mock data for both modes
      setAiRecommendedCreators(mockCreators);
      setAllCreators(mockCreators);
      setCreators(mockCreators); // Start with AI recommendations
      setFilteredCreators(mockCreators);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load creators');
    } finally {
      setLoading(false);
    }
  };

  // Load niches
  const loadNiches = async () => {
    try {
      // TODO: Replace with actual Supabase query
      // const { data, error } = await supabase.from('niches').select('*');
      
      setNiches(mockNiches);
    } catch (err) {
      console.error('Failed to load niches:', err);
    }
  };

  // Calculate metrics whenever filtered creators change
  useEffect(() => {
    const newMetrics = calculateMetrics(filteredCreators);
    setMetrics(newMetrics);
  }, [filteredCreators]);

  // Load initial data on mount
  useEffect(() => {
    loadCreators();
    loadNiches();
  }, []);

  return {
    creators: filteredCreators,
    allCreators: creators,
    currentMode,
    niches,
    metrics,
    loading,
    error,
    applyFilters,
    switchMode,
    loadCreators,
    loadNiches
  };
};