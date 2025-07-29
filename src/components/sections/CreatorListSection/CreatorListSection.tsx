import React, { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Icon } from "../../ui/icon";
import { Badge } from "../../ui/badge";
import { DonutChart } from "../../ui/donut-chart";
import { ExpandedProfileOverlay } from "../../ui/expanded-profile-overlay";
import { useCreatorData } from "../../../hooks/useCreatorData";
import { Creator, ViewMode, SortField, SortDirection } from "../../../types/database";
import { formatNumber, getSocialMediaIcon, getMatchScoreColor, getTrendIcon, getTrendColor } from "../../../utils/formatters";

export const CreatorListSection = (): JSX.Element => {
  const { creators, currentMode, loading, totalCreators, currentPage, totalPages, nextPage, previousPage } = useCreatorData();
  
  // View mode state (cards or list)
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  
  // Sort state
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Selection state
  const [selectedCreators, setSelectedCreators] = useState<Set<string>>(new Set());
  
  // Expanded profile state
  const [expandedCreator, setExpandedCreator] = useState<Creator | null>(null);

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
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
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedCreators.size === creators.length) {
      setSelectedCreators(new Set());
    } else {
      setSelectedCreators(new Set(creators.map(c => c.id)));
    }
  };

  // Handle profile expansion
  const handleProfileExpand = (creator: Creator) => {
    setExpandedCreator(creator);
  };

  // Sort creators
  const sortedCreators = React.useMemo(() => {
    if (!sortField) return creators;
    
    return [...creators].sort((a, b) => {
      let aValue: number;
      let bValue: number;
      
      switch (sortField) {
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
      
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [creators, sortField, sortDirection]);

  if (loading) {
    return (
      <Card className="p-[15px] lg:p-[20px] xl:p-[25px] w-full bg-white rounded-[10px] flex-1 overflow-hidden border-0">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading creators...</div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-[15px] lg:p-[20px] xl:p-[25px] w-full bg-white rounded-[10px] flex-1 overflow-hidden border-0">
        <div className="flex flex-col h-full">
          {/* Header with view toggle and results count */}
          <div className="flex items-center justify-between mb-[15px] lg:mb-[20px] xl:mb-[25px] flex-shrink-0">
            <div className="flex items-center gap-[10px] lg:gap-[12px] xl:gap-[15px]">
              <span className="text-[#71737c] text-[14px] lg:text-[16px] xl:text-[18px] font-medium">
                {totalCreators} creators found
              </span>
              
              {selectedCreators.size > 0 && (
                <span className="text-[#557EDD] text-[14px] lg:text-[16px] xl:text-[18px] font-medium">
                  {selectedCreators.size} selected
                </span>
              )}
            </div>

            <div className="flex items-center gap-[8px] lg:gap-[10px] xl:gap-[12px]">
              {/* View mode toggle */}
              <div className="flex items-center bg-[#f8f9fa] rounded-[8px] p-[2px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className={`h-[32px] lg:h-[36px] xl:h-[40px] px-[8px] lg:px-[10px] xl:px-[12px] rounded-[6px] transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-white text-[#557EDD] shadow-sm'
                      : 'text-[#71737c] hover:text-[#557EDD]'
                  }`}
                >
                  <Icon
                    name="CardsModeIcon.svg"
                    className="w-[14px] h-[14px] lg:w-[16px] lg:h-[16px] xl:w-[18px] xl:h-[18px]"
                    alt="Cards view"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-[32px] lg:h-[36px] xl:h-[40px] px-[8px] lg:px-[10px] xl:px-[12px] rounded-[6px] transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-[#557EDD] shadow-sm'
                      : 'text-[#71737c] hover:text-[#557EDD]'
                  }`}
                >
                  <Icon
                    name="ListIcon.svg"
                    className="w-[14px] h-[14px] lg:w-[16px] lg:h-[16px] xl:w-[18px] xl:h-[18px]"
                    alt="List view"
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-hidden">
            {viewMode === 'cards' ? (
              /* Cards View */
              <div className="h-full overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[12px] lg:gap-[15px] xl:gap-[18px] pb-4">
                  {sortedCreators.map((creator, index) => (
                    <Card key={`creator-card-${index}`} className="bg-white rounded-[12px] lg:rounded-[15px] xl:rounded-[18px] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-sm">
                      <CardContent className="p-0">
                        <div className="relative">
                          {/* Checkbox - Top left */}
                          <div className="absolute top-[8px] lg:top-[10px] xl:top-[12px] left-[8px] lg:left-[10px] xl:left-[12px] z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCreatorSelect(creator.id);
                              }}
                              className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] rounded-[4px] border-2 border-white bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                            >
                              {selectedCreators.has(creator.id) && (
                                <Icon
                                  name="CheckIcon.svg"
                                  className="w-[10px] h-[10px] lg:w-[12px] lg:h-[12px] xl:w-[14px] xl:h-[14px] text-[#557EDD]"
                                  alt="Selected"
                                />
                              )}
                            </button>
                          </div>

                          {/* Match Score - Top right, only in AI mode */}
                          {currentMode === 'ai' && (
                            <div className="absolute top-[8px] lg:top-[10px] xl:top-[12px] right-[8px] lg:right-[10px] xl:right-[12px] z-10">
                              <div className={`flex items-center justify-center px-[6px] lg:px-[8px] xl:px-[10px] py-[3px] lg:py-[4px] xl:py-[5px] rounded-[6px] ${getMatchScoreColor(creator.match_score || 0)}`}>
                                <span className="font-bold text-[11px] lg:text-[12px] xl:text-[13px] leading-[14px] lg:leading-[16px] xl:leading-[18px]">
                                  {creator.match_score || 0}%
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Profile Image */}
                          <div 
                            className="w-full h-[180px] lg:h-[200px] xl:h-[220px] bg-[#384455] overflow-hidden cursor-pointer"
                            onClick={() => handleProfileExpand(creator)}
                          >
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
                        </div>

                        {/* Creator Info */}
                        <div className="p-[12px] lg:p-[15px] xl:p-[18px]">
                          {/* Username and social icons */}
                          <div className="flex items-center justify-between mb-[6px] lg:mb-[8px] xl:mb-[10px]">
                            <div className="flex items-center gap-[6px] lg:gap-[8px] xl:gap-[10px] flex-1 min-w-0">
                              <span className="font-semibold text-[14px] lg:text-[16px] xl:text-[18px] text-[#06152b] truncate">
                                {creator.username}
                              </span>
                              <div className="flex items-center gap-[2px] lg:gap-[3px] xl:gap-[4px] flex-shrink-0">
                                {creator.social_media.map((social, iconIndex) => (
                                  <Icon
                                    key={iconIndex}
                                    name={getSocialMediaIcon(social.platform)}
                                    className="w-[12px] h-[12px] lg:w-[14px] lg:h-[14px] xl:w-[16px] xl:h-[16px]"
                                    alt={`${social.platform} logo`}
                                  />
                                ))}
                              </div>
                            </div>
                            
                            {/* Buzz Score */}
                            <div className="flex items-center gap-[4px] lg:gap-[6px] xl:gap-[8px] flex-shrink-0">
                              <DonutChart score={creator.buzz_score} />
                            </div>
                          </div>

                          {/* Username tag */}
                          <div className="mb-[8px] lg:mb-[10px] xl:mb-[12px]">
                            <span className="text-[#71737c] text-[12px] lg:text-[14px] xl:text-[16px] font-medium">
                              {creator.username_tag || `@${creator.username.toLowerCase().replace(/\s+/g, '')}`}
                            </span>
                          </div>

                          {/* Bio */}
                          <div className="mb-[10px] lg:mb-[12px] xl:mb-[15px]">
                            <p className="text-[#71737c] text-[12px] lg:text-[14px] xl:text-[16px] font-medium leading-[16px] lg:leading-[18px] xl:leading-[20px] line-clamp-2">
                              {creator.bio}
                            </p>
                          </div>

                          {/* Metrics */}
                          <div className="grid grid-cols-3 gap-[8px] lg:gap-[10px] xl:gap-[12px] mb-[10px] lg:mb-[12px] xl:mb-[15px]">
                            {/* Followers */}
                            <div className="text-center">
                              <div className="text-[#06152b] text-[12px] lg:text-[14px] xl:text-[16px] font-bold mb-[2px] lg:mb-[3px] xl:mb-[4px]">
                                {formatNumber(creator.followers)}
                              </div>
                              <div className="text-[#71737c] text-[10px] lg:text-[12px] xl:text-[14px] font-medium mb-[2px] lg:mb-[3px] xl:mb-[4px]">
                                Followers
                              </div>
                              <div className="flex items-center justify-center gap-[2px] lg:gap-[3px] xl:gap-[4px]">
                                <Icon 
                                  name={getTrendIcon(creator.followers_change_type || 'positive')}
                                  className="w-[8px] h-[8px] lg:w-[10px] lg:h-[10px] xl:w-[12px] xl:h-[12px]" 
                                  alt={creator.followers_change_type === 'positive' ? 'Positive change' : 'Negative change'} 
                                />
                                <span className={`text-[10px] lg:text-[11px] xl:text-[12px] font-medium ${getTrendColor(creator.followers_change_type || 'positive')}`}>
                                  {creator.followers_change?.toFixed(2) || '0.00'}%
                                </span>
                              </div>
                            </div>

                            {/* Avg. Views */}
                            <div className="text-center">
                              <div className="text-[#06152b] text-[12px] lg:text-[14px] xl:text-[16px] font-bold mb-[2px] lg:mb-[3px] xl:mb-[4px]">
                                {formatNumber(creator.avg_views)}
                              </div>
                              <div className="text-[#71737c] text-[10px] lg:text-[12px] xl:text-[14px] font-medium mb-[2px] lg:mb-[3px] xl:mb-[4px]">
                                Avg. Views
                              </div>
                              <div className="flex items-center justify-center gap-[2px] lg:gap-[3px] xl:gap-[4px]">
                                <Icon 
                                  name={getTrendIcon(creator.avg_views_change_type || 'positive')}
                                  className="w-[8px] h-[8px] lg:w-[10px] lg:h-[10px] xl:w-[12px] xl:h-[12px]" 
                                  alt={creator.avg_views_change_type === 'positive' ? 'Positive change' : 'Negative change'} 
                                />
                                <span className={`text-[10px] lg:text-[11px] xl:text-[12px] font-medium ${getTrendColor(creator.avg_views_change_type || 'positive')}`}>
                                  {creator.avg_views_change?.toFixed(2) || '0.00'}%
                                </span>
                              </div>
                            </div>

                            {/* Engagement */}
                            <div className="text-center">
                              <div className="text-[#06152b] text-[12px] lg:text-[14px] xl:text-[16px] font-bold mb-[2px] lg:mb-[3px] xl:mb-[4px]">
                                {creator.engagement.toFixed(1)}%
                              </div>
                              <div className="text-[#71737c] text-[10px] lg:text-[12px] xl:text-[14px] font-medium mb-[2px] lg:mb-[3px] xl:mb-[4px]">
                                Engagement
                              </div>
                              <div className="flex items-center justify-center gap-[2px] lg:gap-[3px] xl:gap-[4px]">
                                <Icon 
                                  name={getTrendIcon(creator.engagement_change_type || 'positive')}
                                  className="w-[8px] h-[8px] lg:w-[10px] lg:h-[10px] xl:w-[12px] xl:h-[12px]" 
                                  alt={creator.engagement_change_type === 'positive' ? 'Positive change' : 'Negative change'} 
                                />
                                <span className={`text-[10px] lg:text-[11px] xl:text-[12px] font-medium ${getTrendColor(creator.engagement_change_type || 'positive')}`}>
                                  {creator.engagement_change?.toFixed(2) || '0.00'}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Niches */}
                          <div className="flex items-center gap-[4px] lg:gap-[6px] xl:gap-[8px] mb-[10px] lg:mb-[12px] xl:mb-[15px] flex-wrap">
                            {creator.niches.slice(0, 2).map((niche, nicheIndex) => (
                              <Badge
                                key={nicheIndex}
                                variant="outline"
                                className={`px-[6px] lg:px-[8px] xl:px-[10px] py-[2px] lg:py-[3px] xl:py-[4px] rounded-[4px] lg:rounded-[6px] xl:rounded-[8px] ${
                                  niche.type === 'primary' 
                                    ? 'bg-sky-50 border-[#dbe2eb] text-neutral-new900' 
                                    : 'bg-green-50 border-green-200 text-green-700'
                                }`}
                              >
                                <span className="font-medium text-[10px] lg:text-[12px] xl:text-[14px]">
                                  {niche.name}
                                </span>
                              </Badge>
                            ))}
                          </div>

                          {/* Thumbnails */}
                          <div className="grid grid-cols-3 gap-[4px] lg:gap-[6px] xl:gap-[8px]">
                            {creator.thumbnails.slice(0, 3).map((thumbnail, thumbIndex) => (
                              <div key={thumbIndex} className="aspect-[9/16] rounded-[6px] lg:rounded-[8px] xl:rounded-[10px] overflow-hidden">
                                <img
                                  src={thumbnail}
                                  alt={`${creator.username} post ${thumbIndex + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              /* List View */
              <div className="h-full overflow-hidden flex flex-col">
                {/* Table Header */}
                <div className="flex-shrink-0 border-b border-gray-200 pb-3 mb-4">
                  <div className="grid grid-cols-12 gap-4 items-center text-[12px] lg:text-[14px] xl:text-[16px] font-semibold text-[#71737c]">
                    {/* Select All Checkbox */}
                    <div className="col-span-1 flex items-center justify-center">
                      <button
                        onClick={handleSelectAll}
                        className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] rounded-[4px] border-2 border-gray-300 bg-white flex items-center justify-center hover:border-[#557EDD] transition-colors"
                      >
                        {selectedCreators.size === creators.length && creators.length > 0 && (
                          <Icon
                            name="CheckIcon.svg"
                            className="w-[10px] h-[10px] lg:w-[12px] lg:h-[12px] xl:w-[14px] xl:h-[14px] text-[#557EDD]"
                            alt="Select all"
                          />
                        )}
                      </button>
                    </div>

                    {/* Creator */}
                    <div className="col-span-3">
                      <button 
                        onClick={() => handleSort('followers')}
                        className="flex items-center gap-2 hover:text-[#557EDD] transition-colors"
                      >
                        <span>Creator</span>
                        <Icon
                          name="SortIcon.svg"
                          className="w-[12px] h-[12px] lg:w-[14px] lg:h-[14px] xl:w-[16px] xl:h-[16px]"
                          alt="Sort"
                        />
                      </button>
                    </div>

                    {/* Match Score - Only show in AI mode */}
                    {currentMode === 'ai' && (
                      <div className="col-span-1">
                        <button 
                          onClick={() => handleSort('match_score')}
                          className="flex items-center gap-2 hover:text-[#557EDD] transition-colors"
                        >
                          <span>Match</span>
                          <Icon
                            name="SortIcon.svg"
                            className="w-[12px] h-[12px] lg:w-[14px] lg:h-[14px] xl:w-[16px] xl:h-[16px]"
                            alt="Sort"
                          />
                        </button>
                      </div>
                    )}

                    {/* Buzz Score */}
                    <div className={currentMode === 'ai' ? "col-span-1" : "col-span-2"}>
                      <span>Buzz</span>
                    </div>

                    {/* Followers */}
                    <div className="col-span-2">
                      <button 
                        onClick={() => handleSort('followers')}
                        className="flex items-center gap-2 hover:text-[#557EDD] transition-colors"
                      >
                        <span>Followers</span>
                        <Icon
                          name="SortIcon.svg"
                          className="w-[12px] h-[12px] lg:w-[14px] lg:h-[14px] xl:w-[16px] xl:h-[16px]"
                          alt="Sort"
                        />
                      </button>
                    </div>

                    {/* Avg. Views */}
                    <div className="col-span-2">
                      <button 
                        onClick={() => handleSort('avg_views')}
                        className="flex items-center gap-2 hover:text-[#557EDD] transition-colors"
                      >
                        <span>Avg. Views</span>
                        <Icon
                          name="SortIcon.svg"
                          className="w-[12px] h-[12px] lg:w-[14px] lg:h-[14px] xl:w-[16px] xl:h-[16px]"
                          alt="Sort"
                        />
                      </button>
                    </div>

                    {/* Engagement */}
                    <div className="col-span-2">
                      <button 
                        onClick={() => handleSort('engagement')}
                        className="flex items-center gap-2 hover:text-[#557EDD] transition-colors"
                      >
                        <span>Engagement</span>
                        <Icon
                          name="SortIcon.svg"
                          className="w-[12px] h-[12px] lg:w-[14px] lg:h-[14px] xl:w-[16px] xl:h-[16px]"
                          alt="Sort"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-3">
                    {sortedCreators.map((creator, index) => (
                      <div 
                        key={`creator-list-${index}`}
                        className="grid grid-cols-12 gap-4 items-center py-3 px-2 hover:bg-gray-50 rounded-[8px] transition-colors cursor-pointer"
                        onClick={() => handleProfileExpand(creator)}
                      >
                        {/* Checkbox */}
                        <div className="col-span-1 flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCreatorSelect(creator.id);
                            }}
                            className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] rounded-[4px] border-2 border-gray-300 bg-white flex items-center justify-center hover:border-[#557EDD] transition-colors"
                          >
                            {selectedCreators.has(creator.id) && (
                              <Icon
                                name="CheckIcon.svg"
                                className="w-[10px] h-[10px] lg:w-[12px] lg:h-[12px] xl:w-[14px] xl:h-[14px] text-[#557EDD]"
                                alt="Selected"
                              />
                            )}
                          </button>
                        </div>

                        {/* Creator Info */}
                        <div className="col-span-3 flex items-center gap-3">
                          <div className="w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] xl:w-[56px] xl:h-[56px] bg-[#384455] rounded-full overflow-hidden flex-shrink-0">
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
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-[12px] lg:text-[14px] xl:text-[16px] text-[#06152b] truncate">
                              {creator.username}
                            </div>
                            <div className="text-[#71737c] text-[10px] lg:text-[12px] xl:text-[14px] font-medium truncate">
                              {creator.username_tag || `@${creator.username.toLowerCase().replace(/\s+/g, '')}`}
                            </div>
                          </div>
                        </div>

                        {/* Match Score - Only show in AI mode */}
                        {currentMode === 'ai' && (
                          <div className="col-span-1">
                            <div className={`inline-flex items-center justify-center px-2 py-1 rounded-[6px] ${getMatchScoreColor(creator.match_score || 0)}`}>
                              <span className="font-bold text-[10px] lg:text-[12px] xl:text-[14px]">
                                {creator.match_score || 0}%
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Buzz Score */}
                        <div className={currentMode === 'ai' ? "col-span-1" : "col-span-2"}>
                          <DonutChart score={creator.buzz_score} size={32} />
                        </div>

                        {/* Followers */}
                        <div className="col-span-2">
                          <div className="text-[#06152b] text-[12px] lg:text-[14px] xl:text-[16px] font-bold">
                            {formatNumber(creator.followers)}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Icon 
                              name={getTrendIcon(creator.followers_change_type || 'positive')}
                              className="w-[8px] h-[8px] lg:w-[10px] lg:h-[10px] xl:w-[12px] xl:h-[12px]" 
                              alt={creator.followers_change_type === 'positive' ? 'Positive change' : 'Negative change'} 
                            />
                            <span className={`text-[10px] lg:text-[11px] xl:text-[12px] font-medium ${getTrendColor(creator.followers_change_type || 'positive')}`}>
                              {creator.followers_change?.toFixed(2) || '0.00'}%
                            </span>
                          </div>
                        </div>

                        {/* Avg. Views */}
                        <div className="col-span-2">
                          <div className="text-[#06152b] text-[12px] lg:text-[14px] xl:text-[16px] font-bold">
                            {formatNumber(creator.avg_views)}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Icon 
                              name={getTrendIcon(creator.avg_views_change_type || 'positive')}
                              className="w-[8px] h-[8px] lg:w-[10px] lg:h-[10px] xl:w-[12px] xl:h-[12px]" 
                              alt={creator.avg_views_change_type === 'positive' ? 'Positive change' : 'Negative change'} 
                            />
                            <span className={`text-[10px] lg:text-[11px] xl:text-[12px] font-medium ${getTrendColor(creator.avg_views_change_type || 'positive')}`}>
                              {creator.avg_views_change?.toFixed(2) || '0.00'}%
                            </span>
                          </div>
                        </div>

                        {/* Engagement */}
                        <div className="col-span-2">
                          <div className="text-[#06152b] text-[12px] lg:text-[14px] xl:text-[16px] font-bold">
                            {creator.engagement.toFixed(1)}%
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Icon 
                              name={getTrendIcon(creator.engagement_change_type || 'positive')}
                              className="w-[8px] h-[8px] lg:w-[10px] lg:h-[10px] xl:w-[12px] xl:h-[12px]" 
                              alt={creator.engagement_change_type === 'positive' ? 'Positive change' : 'Negative change'} 
                            />
                            <span className={`text-[10px] lg:text-[11px] xl:text-[12px] font-medium ${getTrendColor(creator.engagement_change_type || 'positive')}`}>
                              {creator.engagement_change?.toFixed(2) || '0.00'}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-[15px] lg:mt-[20px] xl:mt-[25px] pt-[15px] lg:pt-[20px] xl:pt-[25px] border-t border-gray-200 flex-shrink-0">
              <div className="text-[#71737c] text-[12px] lg:text-[14px] xl:text-[16px] font-medium">
                Page {currentPage} of {totalPages}
              </div>
              
              <div className="flex items-center gap-[8px] lg:gap-[10px] xl:gap-[12px]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={previousPage}
                  disabled={currentPage === 1}
                  className="h-[32px] lg:h-[36px] xl:h-[40px] px-[12px] lg:px-[16px] xl:px-[20px] text-[12px] lg:text-[14px] xl:text-[16px] font-medium"
                >
                  <Icon
                    name="ArrowLeftIcon.svg"
                    className="w-[12px] h-[12px] lg:w-[14px] lg:h-[14px] xl:w-[16px] xl:h-[16px] mr-2"
                    alt="Previous"
                  />
                  Previous
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="h-[32px] lg:h-[36px] xl:h-[40px] px-[12px] lg:px-[16px] xl:px-[20px] text-[12px] lg:text-[14px] xl:text-[16px] font-medium"
                >
                  Next
                  <Icon
                    name="ArrowRightIcon.svg"
                    className="w-[12px] h-[12px] lg:w-[14px] lg:h-[14px] xl:w-[16px] xl:h-[16px] ml-2"
                    alt="Next"
                  />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Expanded Profile Overlay */}
      {expandedCreator && (
        <ExpandedProfileOverlay
          creator={expandedCreator}
          isOpen={!!expandedCreator}
          onClose={() => setExpandedCreator(null)}
        />
      )}
    </>
  );
};