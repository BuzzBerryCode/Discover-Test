import React, { useState, useEffect } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Checkbox } from "../../ui/checkbox";
import { Icon } from "../../ui/icon";
import { DonutChart } from "../../ui/donut-chart";
import { ExpandedProfileOverlay } from "../../ui/expanded-profile-overlay";
import { useCreatorData } from "../../../hooks/useCreatorData";
import { Creator, SortField, SortDirection, SortState, ViewMode } from "../../../types/database";
import { formatNumber, getMatchScoreColor, getBuzzScoreColor, getSocialMediaIcon, getTrendIcon, getTrendColor } from "../../../utils/formatters";

export const CreatorListSection = (): JSX.Element => {
  const { creators, currentMode, loading, error, totalCreators, currentPage, totalPages, nextPage, previousPage } = useCreatorData();
  
  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  
  // Sort state
  const [sortState, setSortState] = useState<SortState>({
    field: null,
    direction: 'desc'
  });
  
  // Selection state
  const [selectedCreators, setSelectedCreators] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  
  // Expanded profile state
  const [expandedCreator, setExpandedCreator] = useState<Creator | null>(null);

  // Handle sort
  const handleSort = (field: SortField) => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  // Handle creator selection
  const handleCreatorSelect = (creatorId: string) => {
    const newSelected = new Set(selectedCreators);
    if (newSelected.has(creatorId)) {
      newSelected.delete(creatorId);
    } else {
      newSelected.add(creatorId);
    }
    setSelectedCreators(newSelected);
    setSelectAll(newSelected.size === creators.length);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCreators(new Set());
      setSelectAll(false);
    } else {
      setSelectedCreators(new Set(creators.map(c => c.id)));
      setSelectAll(true);
    }
  };

  // Update select all state when creators change
  useEffect(() => {
    setSelectAll(selectedCreators.size === creators.length && creators.length > 0);
  }, [selectedCreators, creators]);

  // Sort creators
  const sortedCreators = React.useMemo(() => {
    if (!sortState.field) return creators;
    
    return [...creators].sort((a, b) => {
      let aValue: number;
      let bValue: number;
      
      switch (sortState.field) {
        case 'match_score':
          aValue = a.match_score || 0;
          bValue = b.match_score || 0;
          break;
        case 'followers':
          aValue = a.followers;
          bValue = b.followers;
          break;
        case 'avg_views':
          aValue = a.avg_views;
          bValue = b.avg_views;
          break;
        case 'engagement':
          aValue = a.engagement;
          bValue = b.engagement;
          break;
        default:
          return 0;
      }
      
      return sortState.direction === 'desc' ? bValue - aValue : aValue - bValue;
    });
  }, [creators, sortState]);

  // Handle expanded profile
  const handleExpandProfile = (creator: Creator) => {
    setExpandedCreator(creator);
  };

  const handleCloseExpandedProfile = () => {
    setExpandedCreator(null);
  };

  if (loading) {
    return (
      <section className="flex flex-col gap-[15px] lg:gap-[20px] xl:gap-[25px] w-full flex-1 min-h-0">
        <Card className="p-[12px] lg:p-[15px] xl:p-[18px] w-full bg-white rounded-[10px] flex-shrink-0 shadow-sm border-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[8px] lg:gap-[10px] xl:gap-[12px] w-full mb-[12px] lg:mb-[15px] xl:mb-[18px]">
            <div className="flex items-center gap-[6px] lg:gap-[8px] xl:gap-[10px]">
              <div className="h-[28px] lg:h-[32px] xl:h-[36px] w-[120px] bg-gray-200 rounded-[8px] animate-pulse" />
            </div>
            <div className="flex items-center gap-[6px] lg:gap-[8px] xl:gap-[10px]">
              <div className="h-[28px] lg:h-[32px] xl:h-[36px] w-[100px] bg-gray-200 rounded-[8px] animate-pulse" />
              <div className="h-[28px] lg:h-[32px] xl:h-[36px] w-[80px] bg-gray-200 rounded-[8px] animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[12px] lg:gap-[15px] xl:gap-[18px]">
            {Array(8).fill(0).map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-[12px] h-[300px] animate-pulse" />
            ))}
          </div>
        </Card>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-[15px] lg:gap-[20px] xl:gap-[25px] w-full flex-1 min-h-0">
        <Card className="p-[12px] lg:p-[15px] xl:p-[18px] w-full bg-white rounded-[10px] flex-shrink-0 shadow-sm border-0">
          <div className="text-center py-[40px] lg:py-[50px] xl:py-[60px]">
            <p className="text-red-600 text-[14px] lg:text-[16px] xl:text-[18px] mb-[8px] lg:mb-[10px] xl:mb-[12px]">
              Error loading creators
            </p>
            <p className="text-gray-600 text-[12px] lg:text-[14px] xl:text-[16px]">
              {error}
            </p>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-[15px] lg:gap-[20px] xl:gap-[25px] w-full flex-1 min-h-0">
      <Card className="p-[12px] lg:p-[15px] xl:p-[18px] w-full bg-white rounded-[10px] flex-shrink-0 shadow-sm border-0">
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[8px] lg:gap-[10px] xl:gap-[12px] w-full mb-[12px] lg:mb-[15px] xl:mb-[18px]">
          {/* Left side - View mode toggle */}
          <div className="flex items-center gap-[6px] lg:gap-[8px] xl:gap-[10px]">
            <div className="flex bg-white border border-[#dbe2eb] rounded-[8px] p-0 overflow-hidden">
              <Button
                onClick={() => setViewMode('cards')}
                className={`flex items-center justify-center gap-[3px] lg:gap-[4px] xl:gap-[6px] px-[6px] lg:px-[8px] xl:px-[12px] py-[4px] lg:py-[6px] xl:py-[8px] h-[28px] lg:h-[32px] xl:h-[36px] font-medium text-[11px] lg:text-[12px] xl:text-[13px] transition-all duration-200 rounded-[8px] ${
                  viewMode === 'cards'
                    ? 'bg-gradient-to-r from-[#E7CBFD] to-[#E0DEEA] text-neutral-new900'
                    : 'bg-white text-neutral-new900 hover:bg-gray-50'
                }`}
              >
                <Icon
                  name="CardsModeIcon.svg"
                  className="w-[10px] h-[10px] lg:w-[12px] lg:h-[12px] xl:w-[14px] xl:h-[14px]"
                  alt="Cards view"
                />
                <span className="whitespace-nowrap">Cards</span>
              </Button>
              <Button
                onClick={() => setViewMode('list')}
                className={`flex items-center justify-center gap-[3px] lg:gap-[4px] xl:gap-[6px] px-[6px] lg:px-[8px] xl:px-[12px] py-[4px] lg:py-[6px] xl:py-[8px] h-[28px] lg:h-[32px] xl:h-[36px] font-medium text-[11px] lg:text-[12px] xl:text-[13px] transition-all duration-200 rounded-[8px] ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-[#E7CBFD] to-[#E0DEEA] text-neutral-new900'
                    : 'bg-white text-neutral-new900 hover:bg-gray-50'
                }`}
              >
                <Icon
                  name="ListIcon.svg"
                  className="w-[10px] h-[10px] lg:w-[12px] lg:h-[12px] xl:w-[14px] xl:h-[14px]"
                  alt="List view"
                />
                <span className="whitespace-nowrap">List</span>
              </Button>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-[6px] lg:gap-[8px] xl:gap-[10px]">
            <Button
              className="flex items-center gap-[3px] lg:gap-[4px] xl:gap-[6px] px-[6px] lg:px-[8px] xl:px-[12px] py-[4px] lg:py-[6px] xl:py-[8px] h-[28px] lg:h-[32px] xl:h-[36px] bg-white border border-[#dbe2eb] rounded-[8px] font-medium text-[11px] lg:text-[12px] xl:text-[13px] text-neutral-new900 hover:bg-gray-50 transition-colors"
            >
              <Icon
                name="SavedListIcon.svg"
                className="w-[10px] h-[10px] lg:w-[12px] lg:h-[12px] xl:w-[14px] xl:h-[14px]"
                alt="Save in list"
              />
              <span className="whitespace-nowrap">Save in a list</span>
            </Button>
            
            <Button
              onClick={handleSelectAll}
              className="flex items-center gap-[3px] lg:gap-[4px] xl:gap-[6px] px-[6px] lg:px-[8px] xl:px-[12px] py-[4px] lg:py-[6px] xl:py-[8px] h-[28px] lg:h-[32px] xl:h-[36px] bg-white border border-[#dbe2eb] rounded-[8px] font-medium text-[11px] lg:text-[12px] xl:text-[13px] text-neutral-new900 hover:bg-gray-50 transition-colors"
            >
              <span className="whitespace-nowrap">Select All</span>
              <Checkbox
                checked={selectAll}
                className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] border-2 border-gray-300 rounded-sm data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
              />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        {viewMode === 'cards' ? (
          // Cards View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[12px] lg:gap-[15px] xl:gap-[18px]">
            {sortedCreators.map((creator, index) => (
              <div key={creator.id} className="bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                {/* Card Header */}
                <div className="p-[8px] lg:p-[10px] xl:p-[12px] pb-0">
                  <div className="flex items-start justify-between mb-[6px] lg:mb-[8px] xl:mb-[10px]">
                    <div className="flex items-center gap-[6px] lg:gap-[8px] xl:gap-[10px] flex-1 min-w-0">
                      {/* Profile Picture */}
                      <div className="w-[32px] h-[32px] lg:w-[36px] lg:h-[36px] xl:w-[40px] xl:h-[40px] bg-[#384455] rounded-full overflow-hidden flex-shrink-0">
                        {creator.profile_pic ? (
                          <img 
                            src={creator.profile_pic} 
                            alt={`${creator.username} profile`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#384455]" />
                        )}
                      </div>

                      {/* Creator Info */}
                      <div className="flex flex-col gap-[2px] lg:gap-[3px] xl:gap-[4px] flex-1 min-w-0">
                        <span className="text-[#06152b] text-[12px] lg:text-[14px] xl:text-[16px] font-semibold truncate">
                          {creator.username}
                        </span>
                        <div className="flex items-center gap-[3px] lg:gap-[4px] xl:gap-[5px]">
                          <span className="text-[#71737c] text-[10px] lg:text-[12px] xl:text-[14px] font-medium truncate">
                            {creator.username_tag || `@${creator.username.toLowerCase().replace(/\s+/g, '')}`}
                          </span>
                          <div className="flex items-center gap-[1px] lg:gap-[2px] xl:gap-[3px] flex-shrink-0">
                            {creator.social_media.map((social, iconIndex) => (
                              <Icon
                                key={iconIndex}
                                name={getSocialMediaIcon(social.platform)}
                                className="w-[8px] h-[8px] lg:w-[10px] lg:h-[10px] xl:w-[12px] xl:h-[12px]"
                                alt={`${social.platform} logo`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Right Controls */}
                    <div className="flex items-center gap-[4px] lg:gap-[6px] xl:gap-[8px] flex-shrink-0">
                      {/* Match Score - Only show in AI mode */}
                      {currentMode === 'ai' && (
                        <div className={`flex items-center justify-center px-[6px] lg:px-[8px] xl:px-[10px] py-[3px] lg:py-[4px] xl:py-[5px] rounded-[6px] ${getMatchScoreColor(creator.match_score || 0)}`}>
                          <span className="font-bold text-[11px] lg:text-[12px] xl:text-[13px] leading-[14px] lg:leading-[16px] xl:leading-[18px]">
                            {creator.match_score || 0}%
                          </span>
                        </div>
                      )}

                      {/* Checkbox */}
                      <Checkbox
                        checked={selectedCreators.has(creator.id)}
                        onCheckedChange={() => handleCreatorSelect(creator.id)}
                        className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] border-2 border-gray-300 rounded-sm data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-[#71737c] text-[10px] lg:text-[12px] xl:text-[14px] font-medium leading-[14px] lg:leading-[16px] xl:leading-[18px] mb-[6px] lg:mb-[8px] xl:mb-[10px] line-clamp-2">
                    {creator.bio}
                  </p>

                  {/* Category Badges */}
                  <div className="flex items-center gap-[4px] lg:gap-[6px] xl:gap-[8px] flex-wrap mb-[8px] lg:mb-[10px] xl:mb-[12px]">
                    {creator.niches.map((niche, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={`px-[6px] lg:px-[8px] xl:px-[10px] py-[2px] lg:py-[3px] xl:py-[4px] rounded-[4px] lg:rounded-[6px] xl:rounded-[8px] ${
                          niche.type === 'primary' 
                            ? 'bg-sky-50 border-[#dbe2eb] text-neutral-new900' 
                            : 'bg-green-50 border-green-200 text-green-700'
                        }`}
                      >
                        <span className="font-medium text-[9px] lg:text-[11px] xl:text-[13px]">
                          {niche.name}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="px-[8px] lg:px-[10px] xl:px-[12px] pb-[6px] lg:pb-[8px] xl:pb-[10px]">
                  <div className="grid grid-cols-3 gap-[4px] lg:gap-[6px] xl:gap-[8px]">
                    {/* Followers */}
                    <div className="flex flex-col items-center text-center">
                      <div className="flex items-center justify-center mb-[2px] lg:mb-[3px] xl:mb-[4px]">
                        <Icon
                          name="FollowerIcon.svg"
                          className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px]"
                          alt="Followers"
                        />
                      </div>
                      <div className="text-[#06152b] text-[10px] lg:text-[12px] xl:text-[14px] font-bold mb-[1px]">
                        {formatNumber(creator.followers)}
                      </div>
                      <div className="text-[#71737c] text-[8px] lg:text-[10px] xl:text-[12px] font-medium mb-[1px]">
                        Followers
                      </div>
                      <div className="flex items-center gap-[2px] lg:gap-[3px] xl:gap-[4px]">
                        <Icon 
                          name={getTrendIcon(creator.followers_change_type || 'positive')}
                          className="w-[6px] h-[6px] lg:w-[8px] lg:h-[8px] xl:w-[10px] xl:h-[10px]" 
                          alt={creator.followers_change_type === 'positive' ? 'Positive change' : 'Negative change'} 
                        />
                        <span className={`text-[8px] lg:text-[10px] xl:text-[12px] font-medium ${getTrendColor(creator.followers_change_type || 'positive')}`}>
                          {creator.followers_change?.toFixed(2) || '0.00'}%
                        </span>
                      </div>
                    </div>

                    {/* Avg. Views */}
                    <div className="flex flex-col items-center text-center">
                      <div className="flex items-center justify-center mb-[2px] lg:mb-[3px] xl:mb-[4px]">
                        <Icon
                          name="AvgViewsIcon.svg"
                          className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px]"
                          alt="Avg. Views"
                        />
                      </div>
                      <div className="text-[#06152b] text-[10px] lg:text-[12px] xl:text-[14px] font-bold mb-[1px]">
                        {formatNumber(creator.avg_views)}
                      </div>
                      <div className="text-[#71737c] text-[8px] lg:text-[10px] xl:text-[12px] font-medium mb-[1px]">
                        Avg. Views
                      </div>
                      <div className="flex items-center gap-[2px] lg:gap-[3px] xl:gap-[4px]">
                        <Icon 
                          name={getTrendIcon(creator.avg_views_change_type || 'positive')}
                          className="w-[6px] h-[6px] lg:w-[8px] lg:h-[8px] xl:w-[10px] xl:h-[10px]" 
                          alt={creator.avg_views_change_type === 'positive' ? 'Positive change' : 'Negative change'} 
                        />
                        <span className={`text-[8px] lg:text-[10px] xl:text-[12px] font-medium ${getTrendColor(creator.avg_views_change_type || 'positive')}`}>
                          {creator.avg_views_change?.toFixed(2) || '0.00'}%
                        </span>
                      </div>
                    </div>

                    {/* Engagement */}
                    <div className="flex flex-col items-center text-center">
                      <div className="flex items-center justify-center mb-[2px] lg:mb-[3px] xl:mb-[4px]">
                        <Icon
                          name="AvgEngagementIcon.svg"
                          className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px]"
                          alt="Engagement"
                        />
                      </div>
                      <div className="text-[#06152b] text-[10px] lg:text-[12px] xl:text-[14px] font-bold mb-[1px]">
                        {creator.engagement.toFixed(1)}%
                      </div>
                      <div className="text-[#71737c] text-[8px] lg:text-[10px] xl:text-[12px] font-medium mb-[1px]">
                        Engagement
                      </div>
                      <div className="flex items-center gap-[2px] lg:gap-[3px] xl:gap-[4px]">
                        <Icon 
                          name={getTrendIcon(creator.engagement_change_type || 'positive')}
                          className="w-[6px] h-[6px] lg:w-[8px] lg:h-[8px] xl:w-[10px] xl:h-[10px]" 
                          alt={creator.engagement_change_type === 'positive' ? 'Positive change' : 'Negative change'} 
                        />
                        <span className={`text-[8px] lg:text-[10px] xl:text-[12px] font-medium ${getTrendColor(creator.engagement_change_type || 'positive')}`}>
                          {creator.engagement_change?.toFixed(2) || '0.00'}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buzz Score */}
                <div className="px-[8px] lg:px-[10px] xl:px-[12px] pb-[6px] lg:pb-[8px] xl:pb-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#00518B] text-[10px] lg:text-[12px] xl:text-[14px] font-bold">
                      Buzz Score
                    </span>
                    <div className="flex items-center gap-[4px] lg:gap-[6px] xl:gap-[8px]">
                      <DonutChart score={creator.buzz_score} size={32} strokeWidth={3} />
                      <span 
                        className="text-[10px] lg:text-[12px] xl:text-[14px] font-bold"
                        style={{
                          background: 'linear-gradient(90deg, #FC4C4B 0%, #CD45BA 50%, #6E57FF 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
                        {creator.buzz_score}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="px-[8px] lg:px-[10px] xl:px-[12px] pb-[8px] lg:pb-[10px] xl:pb-[12px]">
                  <div className="grid grid-cols-3 gap-[2px] lg:gap-[3px] xl:gap-[4px]">
                    {creator.thumbnails.slice(0, 3).map((thumbnail, thumbIndex) => (
                      <div key={thumbIndex} className="aspect-[9/16] rounded-[4px] lg:rounded-[6px] xl:rounded-[8px] overflow-hidden">
                        <img
                          src={thumbnail}
                          alt={`${creator.username} post ${thumbIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expand Button */}
                <div className="px-[8px] lg:px-[10px] xl:px-[12px] pb-[8px] lg:pb-[10px] xl:pb-[12px]">
                  <Button
                    onClick={() => handleExpandProfile(creator)}
                    className="w-full h-[24px] lg:h-[28px] xl:h-[32px] bg-[linear-gradient(90deg,#557EDD_0%,#6C40E4_100%)] hover:bg-[linear-gradient(90deg,#4A6BC8_0%,#5A36C7_100%)] text-white text-[10px] lg:text-[12px] xl:text-[14px] font-medium rounded-[6px] lg:rounded-[8px] xl:rounded-[10px] border-0"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-[8px] lg:py-[10px] xl:py-[12px] px-[6px] lg:px-[8px] xl:px-[10px]">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] border-2 border-gray-300 rounded-sm data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                    />
                  </th>
                  <th className="text-left py-[8px] lg:py-[10px] xl:py-[12px] px-[6px] lg:px-[8px] xl:px-[10px] text-[11px] lg:text-[12px] xl:text-[13px] font-semibold text-gray-700">
                    Creator
                  </th>
                  <th className="text-left py-[8px] lg:py-[10px] xl:py-[12px] px-[6px] lg:px-[8px] xl:px-[10px]">
                    <button 
                      onClick={() => handleSort('followers')}
                      className="flex items-center gap-[4px] lg:gap-[6px] xl:gap-[8px] text-[11px] lg:text-[12px] xl:text-[13px] font-semibold text-gray-700 hover:text-gray-900"
                    >
                      <span>Followers</span>
                      <Icon
                        name="SortIcon.svg"
                        className={`w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 flex-shrink-0 transition-transform ${
                          sortState.field === 'followers' && sortState.direction === 'asc' ? 'rotate-180' : ''
                        }`}
                        alt="Sort"
                      />
                    </button>
                  </th>
                  <th className="text-left py-[8px] lg:py-[10px] xl:py-[12px] px-[6px] lg:px-[8px] xl:px-[10px]">
                    <button 
                      onClick={() => handleSort('avg_views')}
                      className="flex items-center gap-[4px] lg:gap-[6px] xl:gap-[8px] text-[11px] lg:text-[12px] xl:text-[13px] font-semibold text-gray-700 hover:text-gray-900"
                    >
                      <span>Avg. Views</span>
                      <Icon
                        name="SortIcon.svg"
                        className={`w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 flex-shrink-0 transition-transform ${
                          sortState.field === 'avg_views' && sortState.direction === 'asc' ? 'rotate-180' : ''
                        }`}
                        alt="Sort"
                      />
                    </button>
                  </th>
                  <th className="text-left py-[8px] lg:py-[10px] xl:py-[12px] px-[6px] lg:px-[8px] xl:px-[10px]">
                    <button 
                      onClick={() => handleSort('engagement')}
                      className="flex items-center gap-[4px] lg:gap-[6px] xl:gap-[8px] text-[11px] lg:text-[12px] xl:text-[13px] font-semibold text-gray-700 hover:text-gray-900"
                    >
                      <span>Engagement</span>
                      <Icon
                        name="SortIcon.svg"
                        className={`w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 flex-shrink-0 transition-transform ${
                          sortState.field === 'engagement' && sortState.direction === 'asc' ? 'rotate-180' : ''
                        }`}
                        alt="Sort"
                      />
                    </button>
                  </th>
                  {currentMode === 'ai' && (
                    <th className="text-left py-[8px] lg:py-[10px] xl:py-[12px] px-[6px] lg:px-[8px] xl:px-[10px]">
                      <button 
                        onClick={() => handleSort('match_score')}
                        className="flex items-center gap-[4px] lg:gap-[6px] xl:gap-[8px] text-[11px] lg:text-[12px] xl:text-[13px] font-semibold text-gray-700 hover:text-gray-900"
                      >
                        <span>Match Score</span>
                        <Icon
                          name="SortIcon.svg"
                          className={`w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 flex-shrink-0 transition-transform ${
                            sortState.field === 'match_score' && sortState.direction === 'asc' ? 'rotate-180' : ''
                          }`}
                          alt="Sort"
                        />
                      </button>
                    </th>
                  )}
                  <th className="text-left py-[8px] lg:py-[10px] xl:py-[12px] px-[6px] lg:px-[8px] xl:px-[10px] text-[11px] lg:text-[12px] xl:text-[13px] font-semibold text-gray-700">
                    Buzz Score
                  </th>
                  <th className="text-left py-[8px] lg:py-[10px] xl:py-[12px] px-[6px] lg:px-[8px] xl:px-[10px] text-[11px] lg:text-[12px] xl:text-[13px] font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedCreators.map((creator) => (
                  <tr key={creator.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-[8px] lg:py-[10px] xl:py-[12px] px-[6px] lg:px-[8px] xl:px-[10px]">
                      <Checkbox
                        checked={selectedCreators.has(creator.id)}
                        onCheckedChange={() => handleCreatorSelect(creator.id)}
                        className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] border-2 border-gray-300 rounded-sm data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                      />
                    </td>
                    <td className="py-[8px] lg:py-[10px] xl:py-[12px] px-[6px] lg:px-[8px] xl:px-[10px]">
                      <div className="flex items-center gap-[8px] lg:gap-[10px] xl:gap-[12px]">
                        <div className="w-[32px] h-[32px] lg:w-[36px] lg:h-[36px] xl:w-[40px] xl:h-[40px] bg-[#384455] rounded-full overflow-hidden flex-shrink-0">
                          {creator.profile_pic ? (
                            <img 
                              src={creator.profile_pic} 
                              alt={`${creator.username} profile`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#384455]" />
                          )}
                        </div>
                        <div className="flex flex-col gap-[2px] lg:gap-[3px] xl:gap-[4px] min-w-0">
                          <span className="text-[#06152b] text-[12px] lg:text-[14px] xl:text-[16px] font-semibold truncate">
                            {creator.username}
                          </span>
                          <div className="flex items-center gap-[4px] lg:gap-[6px] xl:gap-[8px]">
                            <span className="text-[#71737c] text-[10px] lg:text-[12px] xl:text-[14px] font-medium truncate">
                              {creator.username_tag || `@${creator.username.toLowerCase().replace(/\s+/g, '')}`}
                            </span>
                            <div className="flex items-center gap-[2px] lg:gap-[3px] xl:gap-[4px] flex-shrink-0">
                              {creator.social_media.map((social, iconIndex) => (
                                <Icon
                                  key={iconIndex}
                                  name={getSocialMediaIcon(social.platform)}
                                  className="w-[10px] h-[10px] lg:w-[12px] lg:h-[12px] xl:w-[14px] xl:h-[14px]"
                                  alt={`${social.platform} logo`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-[8px] lg:py-[10px] xl:py-[12px] px-[6px] lg:px-[8px] xl:px-[10px]">
                      <div className="flex flex-col gap-[2px] lg:gap-[3px] xl:gap-[4px]">
                        <span className="text-[#06152b] text-[11px] lg:text-[12px] xl:text-[13px] font-bold">
                          {formatNumber(creator.followers)}
                        </span>
                        <div className="flex items-center gap-[2px] lg:gap-[3px] xl:gap-[4px]">
                          <Icon 
                            name={getTrendIcon(creator.followers_change_type || 'positive')}
                            className="w-[6px] h-[6px] lg:w-[8px] lg:h-[8px] xl:w-[10px] xl:h-[10px]" 
                            alt={creator.followers_change_type === 'positive' ? 'Positive change' : 'Negative change'} 
                          />
                          <span className={`text-[8px] lg:text-[10px] xl:text-[12px] font-medium ${getTrendColor(creator.followers_change_type || 'positive')}`}>
                            {creator.followers_change?.toFixed(2) || '0.00'}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-[8px] lg:py-[10px] xl:py-[12px] px-[6px] lg:px-[8px] xl:px-[10px]">
                      <div className="flex flex-col gap-[2px] lg:gap-[3px] xl:gap-[4px]">
                        <span className="text-[#06152b] text-[11px] lg:text-[12px] xl:text-[13px] font-bold">
                          {formatNumber(creator.avg_views)}
                        </span>
                        <div className="flex items-center gap-[2px] lg:gap-[3px] xl:gap-[4px]">
                          <Icon 
                            name={getTrendIcon(creator.avg_views_change_type || 'positive')}
                            className="w-[6px] h-[6px] lg:w-[8px] lg:h-[8px] xl:w-[10px] xl:h-[10px]" 
                            alt={creator.avg_views_change_type === 'positive' ? 'Positive change' : 'Negative change'} 
                          />
                          <span className={`text-[8px] lg:text-[10px] xl:text-[12px] font-medium ${getTrendColor(creator.avg_views_change_type || 'positive')}`}>
                            {creator.avg_views_change?.toFixed(2) || '0.00'}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-[8px] lg:py-[10px] xl:py-[12px] px-[6px] lg:px-[8px] xl:px-[10px]">
                      <div className="flex flex-col gap-[2px] lg:gap-[3px] xl:gap-[4px]">
                        <span className="text-[#06152b] text-[11px] lg:text-[12px] xl:text-[13px] font-bold">
                          {creator.engagement.toFixed(1)}%
                        </span>
                        <div className="flex items-center gap-[2px] lg:gap-[3px] xl:gap-[4px]">
                          <Icon 
                            name={getTrendIcon(creator.engagement_change_type || 'positive')}
                            className="w-[6px] h-[6px] lg:w-[8px] lg:h-[8px] xl:w-[10px] xl:h-[10px]" 
                            alt={creator.engagement_change_type === 'positive' ? 'Positive change' : 'Negative change'} 
                          />
                          <span className={`text-[8px] lg:text-[10px] xl:text-[12px] font-medium ${getTrendColor(creator.engagement_change_type || 'positive')}`}>
                            {creator.engagement_change?.toFixed(2) || '0.00'}%
                          </span>
                        </div>
                      </div>
                    </td>
                    {currentMode === 'ai' && (
                      <td className="py-[8px] lg:py-[10px] xl:py-[12px] px-[6px] lg:px-[8px] xl:px-[10px]">
                        <div className={`inline-flex items-center justify-center px-[6px] lg:px-[8px] xl:px-[10px] py-[3px] lg:py-[4px] xl:py-[5px] rounded-[6px] ${getMatchScoreColor(creator.match_score || 0)}`}>
                          <span className="font-bold text-[11px] lg:text-[12px] xl:text-[13px]">
                            {creator.match_score || 0}%
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="py-[8px] lg:py-[10px] xl:py-[12px] px-[6px] lg:px-[8px] xl:px-[10px]">
                      <div className="flex items-center gap-[4px] lg:gap-[6px] xl:gap-[8px]">
                        <DonutChart score={creator.buzz_score} size={28} strokeWidth={3} />
                        <span 
                          className="text-[10px] lg:text-[12px] xl:text-[14px] font-bold"
                          style={{
                            background: 'linear-gradient(90deg, #FC4C4B 0%, #CD45BA 50%, #6E57FF 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        >
                          {creator.buzz_score}%
                        </span>
                      </div>
                    </td>
                    <td className="py-[8px] lg:py-[10px] xl:py-[12px] px-[6px] lg:px-[8px] xl:px-[10px]">
                      <Button
                        onClick={() => handleExpandProfile(creator)}
                        className="h-[24px] lg:h-[28px] xl:h-[32px] px-[8px] lg:px-[12px] xl:px-[16px] bg-[linear-gradient(90deg,#557EDD_0%,#6C40E4_100%)] hover:bg-[linear-gradient(90deg,#4A6BC8_0%,#5A36C7_100%)] text-white text-[10px] lg:text-[12px] xl:text-[14px] font-medium rounded-[6px] lg:rounded-[8px] xl:rounded-[10px] border-0"
                      >
                        View Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-[15px] lg:mt-[20px] xl:mt-[25px] pt-[12px] lg:pt-[15px] xl:pt-[18px] border-t border-gray-200">
            <div className="text-[12px] lg:text-[14px] xl:text-[16px] text-gray-600">
              Showing {((currentPage - 1) * 24) + 1} to {Math.min(currentPage * 24, totalCreators)} of {totalCreators} creators
            </div>
            <div className="flex items-center gap-[6px] lg:gap-[8px] xl:gap-[10px]">
              <Button
                onClick={previousPage}
                disabled={currentPage === 1}
                className="flex items-center gap-[4px] lg:gap-[6px] xl:gap-[8px] px-[8px] lg:px-[12px] xl:px-[16px] py-[4px] lg:py-[6px] xl:py-[8px] h-[28px] lg:h-[32px] xl:h-[36px] bg-white border border-[#dbe2eb] rounded-[8px] font-medium text-[11px] lg:text-[12px] xl:text-[13px] text-neutral-new900 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon
                  name="ArrowLeftIcon.svg"
                  className="w-[10px] h-[10px] lg:w-[12px] lg:h-[12px] xl:w-[14px] xl:h-[14px]"
                  alt="Previous"
                />
                Previous
              </Button>
              <span className="text-[12px] lg:text-[14px] xl:text-[16px] text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-[4px] lg:gap-[6px] xl:gap-[8px] px-[8px] lg:px-[12px] xl:px-[16px] py-[4px] lg:py-[6px] xl:py-[8px] h-[28px] lg:h-[32px] xl:h-[36px] bg-white border border-[#dbe2eb] rounded-[8px] font-medium text-[11px] lg:text-[12px] xl:text-[13px] text-neutral-new900 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <Icon
                  name="ArrowRightIcon.svg"
                  className="w-[10px] h-[10px] lg:w-[12px] lg:h-[12px] xl:w-[14px] xl:h-[14px]"
                  alt="Next"
                />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Expanded Profile Overlay */}
      {expandedCreator && (
        <ExpandedProfileOverlay
          creator={expandedCreator}
          isOpen={!!expandedCreator}
          onClose={handleCloseExpandedProfile}
        />
      )}
    </section>
  );
};