import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './icon';
import { Badge } from './badge';
import { Button } from './button';
import { Creator } from '../../types/database';
import { formatNumber, getSocialMediaIcon } from '../../utils/formatters';

interface ExpandedProfileOverlayProps {
  creator: Creator;
  isOpen: boolean;
  onClose: () => void;
}

export const ExpandedProfileOverlay: React.FC<ExpandedProfileOverlayProps> = ({
  creator,
  isOpen,
  onClose,
}) => {
  const [showAllHashtags, setShowAllHashtags] = useState(false);
  const [showBuzzScoreInfo, setShowBuzzScoreInfo] = useState(false);
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);
  const [showDMTooltip, setShowDMTooltip] = useState(false);
  const [visibleHashtagsCount, setVisibleHashtagsCount] = useState(5);
  
  const emailTimeoutRef = useRef<NodeJS.Timeout>();
  const dmTimeoutRef = useRef<NodeJS.Timeout>();
  const hashtagsRowRef = useRef<HTMLDivElement>(null);

  // Calculate how many hashtags can fit in one row
  useEffect(() => {
    if (!hashtagsRowRef.current || !creator.hashtags) return;

    const calculateVisibleHashtags = () => {
      const containerWidth = hashtagsRowRef.current?.offsetWidth || 0;
      const dropdownButtonWidth = 40; // Approximate width of dropdown button
      const gap = 8; // Gap between hashtags
      let totalWidth = 0;
      let count = 0;

      // Create temporary elements to measure hashtag widths
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.visibility = 'hidden';
      tempContainer.style.whiteSpace = 'nowrap';
      tempContainer.style.pointerEvents = 'none';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);

      for (let i = 0; i < creator.hashtags.length; i++) {
        const hashtag = creator.hashtags[i];
        
        const tempBadge = document.createElement('span');
        tempBadge.className = 'px-[8px] py-[4px] bg-gray-100 rounded-[6px] text-[12px] font-medium text-gray-600';
        tempBadge.textContent = hashtag;
        tempContainer.appendChild(tempBadge);

        const badgeWidth = tempBadge.offsetWidth;
        const gapWidth = i > 0 ? gap : 0;
        const totalWidthWithThisTag = totalWidth + gapWidth + badgeWidth;
        
        // Reserve space for dropdown button if there are more hashtags
        const reservedWidth = i < creator.hashtags.length - 1 ? dropdownButtonWidth + gap : 0;
        
        if (totalWidthWithThisTag + reservedWidth <= containerWidth) {
          count++;
          totalWidth = totalWidthWithThisTag;
        } else {
          break;
        }

        tempContainer.removeChild(tempBadge);
      }

      document.body.removeChild(tempContainer);
      
      // If all hashtags fit, don't show dropdown
      if (count >= creator.hashtags.length) {
        setVisibleHashtagsCount(creator.hashtags.length);
      } else {
        setVisibleHashtagsCount(Math.max(1, count - 1)); // Reserve space for dropdown
      }
    };

    const timeoutId = setTimeout(calculateVisibleHashtags, 100);
    
    const handleResize = () => {
      clearTimeout((window as any).hashtagResizeTimeout);
      (window as any).hashtagResizeTimeout = setTimeout(calculateVisibleHashtags, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeoutId);
      clearTimeout((window as any).hashtagResizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [creator.hashtags, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle email copy
  const handleEmailClick = async () => {
    if (creator.email) {
      try {
        await navigator.clipboard.writeText(creator.email);
        // Could add a toast notification here
      } catch (err) {
        console.error('Failed to copy email:', err);
      }
    }
  };

  // Handle DM click
  const handleDMClick = () => {
    const primarySocial = creator.social_media[0];
    if (primarySocial?.url) {
      window.open(primarySocial.url, '_blank');
    }
  };

  // Handle email hover
  const handleEmailMouseEnter = () => {
    emailTimeoutRef.current = setTimeout(() => {
      setShowEmailTooltip(true);
    }, 1500);
  };

  const handleEmailMouseLeave = () => {
    if (emailTimeoutRef.current) {
      clearTimeout(emailTimeoutRef.current);
    }
    setShowEmailTooltip(false);
  };

  // Handle DM hover
  const handleDMMouseEnter = () => {
    dmTimeoutRef.current = setTimeout(() => {
      setShowDMTooltip(true);
    }, 1500);
  };

  const handleDMMouseLeave = () => {
    if (dmTimeoutRef.current) {
      clearTimeout(dmTimeoutRef.current);
    }
    setShowDMTooltip(false);
  };

  if (!isOpen) return null;

  const displayedHashtags = showAllHashtags 
    ? creator.hashtags || []
    : (creator.hashtags || []).slice(0, visibleHashtagsCount);
  
  const hasMoreHashtags = (creator.hashtags || []).length > visibleHashtagsCount;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div 
        className={`
          absolute bg-[#F9FAFB] border-[#CAC8C8] overflow-y-auto pointer-events-auto
          ${/* Mobile: Full screen */ ''}
          sm:w-full sm:h-full sm:top-0 sm:right-0 sm:rounded-none sm:border-0
          ${/* Medium and up: 60% width, right side */ ''}
          md:w-[60%] md:h-full md:top-0 md:right-0 md:rounded-tl-[10px] md:rounded-bl-[10px] md:border-l md:border-t-0 md:border-r-0 md:border-b-0
        `}
        style={{ borderWidth: '1px' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-[20px] lg:p-[25px] xl:p-[30px]">
          <div className="flex items-center gap-[12px] lg:gap-[15px] xl:gap-[18px] flex-1">
            {/* Profile Picture */}
            <div className="w-[60px] h-[60px] lg:w-[70px] lg:h-[70px] xl:w-[80px] xl:h-[80px] bg-[#384455] rounded-full overflow-hidden flex-shrink-0">
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
            <div className="flex flex-col gap-[4px] lg:gap-[6px] xl:gap-[8px] flex-1 min-w-0">
              <h2 className="font-bold text-[#06152b] text-[20px] lg:text-[24px] xl:text-[28px] leading-[24px] lg:leading-[28px] xl:leading-[32px] truncate">
                {creator.username}
              </h2>
              <div className="flex items-center gap-[8px] lg:gap-[10px] xl:gap-[12px]">
                <span className="text-[#71737c] text-[14px] lg:text-[16px] xl:text-[18px] font-medium">
                  {creator.username_tag || `@${creator.username.toLowerCase().replace(/\s+/g, '')}`}
                </span>
                <div className="flex items-center gap-[4px] lg:gap-[6px] xl:gap-[8px]">
                  <Button
                    onClick={handleEmailClick}
                    onMouseEnter={handleEmailMouseEnter}
                    onMouseLeave={handleEmailMouseLeave}
                    className="relative p-[6px] lg:p-[8px] xl:p-[10px] bg-white border border-[#dbe2eb] rounded-[6px] hover:bg-gray-50 transition-colors"
                  >
                    <Icon
                      name="EmailIcon.svg"
                      className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px]"
                      alt="Email"
                    />
                    {showEmailTooltip && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap">
                        Copy Email ID
                      </div>
                    )}
                  </Button>
                  <Button
                    onClick={handleDMClick}
                    onMouseEnter={handleDMMouseEnter}
                    onMouseLeave={handleDMMouseLeave}
                    className="relative p-[6px] lg:p-[8px] xl:p-[10px] bg-white border border-[#dbe2eb] rounded-[6px] hover:bg-gray-50 transition-colors"
                  >
                    <Icon
                      name="DMIcon.svg"
                      className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px]"
                      alt="DM"
                    />
                    {showDMTooltip && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap">
                        DM Creator
                      </div>
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-[3px] lg:gap-[4px] xl:gap-[5px]">
                  {creator.social_media.map((social, iconIndex) => (
                    <Icon
                      key={iconIndex}
                      name={getSocialMediaIcon(social.platform)}
                      className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px]"
                      alt={`${social.platform} logo`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Match Score and Close Button */}
          <div className="flex items-center gap-[8px] lg:gap-[10px] xl:gap-[12px] flex-shrink-0">
            <div className="bg-[#B8E6D3] text-[#1F7A54] px-[12px] lg:px-[15px] xl:px-[18px] py-[6px] lg:py-[8px] xl:py-[10px] rounded-[8px] font-bold text-[14px] lg:text-[16px] xl:text-[18px]">
              Match {creator.match_score || 0}%
            </div>
            <Button
              onClick={onClose}
              className="p-[6px] lg:p-[8px] xl:p-[10px] bg-white border border-[#dbe2eb] rounded-[6px] hover:bg-gray-50 transition-colors"
            >
              <Icon
                name="CloseIcon.svg"
                className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] text-gray-600"
                alt="Close"
              />
            </Button>
          </div>
        </div>

        {/* Location */}
        {creator.location && (
          <div className="px-[20px] lg:px-[25px] xl:px-[30px] mb-[15px] lg:mb-[18px] xl:mb-[20px]">
            <div className="flex items-center gap-[6px] lg:gap-[8px] xl:gap-[10px]">
              <Icon
                name="LocationIcon.svg"
                className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] text-gray-600"
                alt="Location"
              />
              <span className="text-[#71737c] text-[14px] lg:text-[16px] xl:text-[18px] font-medium">
                {creator.location}
              </span>
            </div>
          </div>
        )}

        {/* Bio */}
        <div className="px-[20px] lg:px-[25px] xl:px-[30px] mb-[20px] lg:mb-[25px] xl:mb-[30px]">
          <p className="text-[#71737c] text-[14px] lg:text-[16px] xl:text-[18px] font-medium leading-[20px] lg:leading-[24px] xl:leading-[28px]">
            {creator.bio}
          </p>
        </div>

        {/* Category Badges */}
        <div className="px-[20px] lg:px-[25px] xl:px-[30px] mb-[20px] lg:mb-[25px] xl:mb-[30px]">
          <div className="flex items-center gap-[8px] lg:gap-[10px] xl:gap-[12px] flex-wrap">
            {creator.niches.map((niche, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-[12px] lg:px-[15px] xl:px-[18px] py-[6px] lg:py-[8px] xl:py-[10px] bg-sky-50 rounded-[8px] border-[#dbe2eb]"
              >
                <span className="font-medium text-neutral-new900 text-[12px] lg:text-[14px] xl:text-[16px]">
                  {niche}
                </span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Hashtags */}
        {creator.hashtags && creator.hashtags.length > 0 && (
          <div className="px-[20px] lg:px-[25px] xl:px-[30px] mb-[25px] lg:mb-[30px] xl:mb-[35px]">
            <div 
              ref={hashtagsRowRef}
              className={`flex items-center gap-[6px] lg:gap-[8px] xl:gap-[10px] ${showAllHashtags ? 'flex-wrap' : 'flex-nowrap'}`}
            >
              {displayedHashtags.map((hashtag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-[8px] lg:px-[10px] xl:px-[12px] py-[4px] lg:py-[6px] xl:py-[8px] bg-gray-100 rounded-[6px] border-gray-300 flex-shrink-0"
                >
                  <span className="font-medium text-gray-600 text-[12px] lg:text-[14px] xl:text-[16px]">
                    {hashtag}
                  </span>
                </Badge>
              ))}
              {hasMoreHashtags && (
                <Button
                  onClick={() => setShowAllHashtags(!showAllHashtags)}
                  className="p-[4px] lg:p-[6px] xl:p-[8px] bg-gray-100 border border-gray-300 rounded-[6px] hover:bg-gray-200 transition-colors flex-shrink-0"
                >
                  <Icon
                    name="HashtagsDropdownIcon.svg"
                    className={`w-[12px] h-[12px] lg:w-[14px] lg:h-[14px] xl:w-[16px] xl:h-[16px] transition-transform ${
                      showAllHashtags ? 'rotate-180' : ''
                    }`}
                    alt="Show more hashtags"
                  />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Metrics Cards - Single Row */}
        <div className="px-[20px] lg:px-[25px] xl:px-[30px] mb-[25px] lg:mb-[30px] xl:mb-[35px]">
          <div className="grid grid-cols-5 gap-[8px] lg:gap-[10px] xl:gap-[12px]">
            {/* Followers */}
            <div className="bg-white rounded-[10px] p-[12px] lg:p-[15px] xl:p-[18px] flex flex-col items-center gap-[8px] lg:gap-[10px] xl:gap-[12px]">
              <div className="w-[32px] h-[32px] lg:w-[36px] lg:h-[36px] xl:w-[40px] xl:h-[40px] bg-[#E0F7FA] rounded-full flex items-center justify-center">
                <Icon
                  name="FollowerIcon.svg"
                  className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] text-[#00ACC1]"
                  alt="Followers"
                />
              </div>
              <div className="text-center">
                <div className="text-[#71737c] text-[10px] lg:text-[12px] xl:text-[14px] font-medium mb-1">
                  Followers
                </div>
                <div className="text-[#06152b] text-[14px] lg:text-[16px] xl:text-[18px] font-bold mb-1">
                  {formatNumber(creator.followers)}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Icon 
                    name={creator.followers_change_type === 'positive' ? 'PositiveChangeIcon.svg' : 'NegativeChangeIcon.svg'}
                    className="w-[10px] h-[10px] lg:w-[12px] lg:h-[12px] xl:w-[14px] xl:h-[14px]" 
                    alt={creator.followers_change_type === 'positive' ? 'Positive change' : 'Negative change'} 
                  />
                  <span className={`text-[10px] lg:text-[12px] xl:text-[14px] font-medium ${
                    creator.followers_change_type === 'positive' ? 'text-[#1ad598]' : 'text-[#ea3a3d]'
                  }`}>
                    {creator.followers_change_type === 'positive' ? '+' : ''}{creator.followers_change?.toFixed(2) || '0.00'}%
                  </span>
                </div>
              </div>
            </div>

            {/* Avg. Views */}
            <div className="bg-white rounded-[10px] p-[12px] lg:p-[15px] xl:p-[18px] flex flex-col items-center gap-[8px] lg:gap-[10px] xl:gap-[12px]">
              <div className="w-[32px] h-[32px] lg:w-[36px] lg:h-[36px] xl:w-[40px] xl:h-[40px] bg-[#FFF3E0] rounded-full flex items-center justify-center">
                <Icon
                  name="AvgViewsIcon.svg"
                  className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] text-[#FF9800]"
                  alt="Avg. Views"
                />
              </div>
              <div className="text-center">
                <div className="text-[#71737c] text-[10px] lg:text-[12px] xl:text-[14px] font-medium mb-1">
                  Avg. Views
                </div>
                <div className="text-[#06152b] text-[14px] lg:text-[16px] xl:text-[18px] font-bold mb-1">
                  {formatNumber(creator.avg_views)}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Icon 
                    name={creator.avg_views_change_type === 'positive' ? 'PositiveChangeIcon.svg' : 'NegativeChangeIcon.svg'}
                    className="w-[10px] h-[10px] lg:w-[12px] lg:h-[12px] xl:w-[14px] xl:h-[14px]" 
                    alt={creator.avg_views_change_type === 'positive' ? 'Positive change' : 'Negative change'} 
                  />
                  <span className={`text-[10px] lg:text-[12px] xl:text-[14px] font-medium ${
                    creator.avg_views_change_type === 'positive' ? 'text-[#1ad598]' : 'text-[#ea3a3d]'
                  }`}>
                    {creator.avg_views_change_type === 'positive' ? '+' : ''}{creator.avg_views_change?.toFixed(2) || '0.00'}%
                  </span>
                </div>
              </div>
            </div>

            {/* Engagement */}
            <div className="bg-white rounded-[10px] p-[12px] lg:p-[15px] xl:p-[18px] flex flex-col items-center gap-[8px] lg:gap-[10px] xl:gap-[12px]">
              <div className="w-[32px] h-[32px] lg:w-[36px] lg:h-[36px] xl:w-[40px] xl:h-[40px] bg-[#F3E5F5] rounded-full flex items-center justify-center">
                <Icon
                  name="AvgEngagementIcon.svg"
                  className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] text-[#9C27B0]"
                  alt="Engagement"
                />
              </div>
              <div className="text-center">
                <div className="text-[#71737c] text-[10px] lg:text-[12px] xl:text-[14px] font-medium mb-1">
                  Engagement
                </div>
                <div className="text-[#06152b] text-[14px] lg:text-[16px] xl:text-[18px] font-bold mb-1">
                  {creator.engagement.toFixed(1)}%
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Icon 
                    name={creator.engagement_change_type === 'positive' ? 'PositiveChangeIcon.svg' : 'NegativeChangeIcon.svg'}
                    className="w-[10px] h-[10px] lg:w-[12px] lg:h-[12px] xl:w-[14px] xl:h-[14px]" 
                    alt={creator.engagement_change_type === 'positive' ? 'Positive change' : 'Negative change'} 
                  />
                  <span className={`text-[10px] lg:text-[12px] xl:text-[14px] font-medium ${
                    creator.engagement_change_type === 'positive' ? 'text-[#1ad598]' : 'text-[#ea3a3d]'
                  }`}>
                    {creator.engagement_change_type === 'positive' ? '+' : ''}{creator.engagement_change?.toFixed(2) || '0.00'}%
                  </span>
                </div>
              </div>
            </div>

            {/* Avg. Likes */}
            <div className="bg-white rounded-[10px] p-[12px] lg:p-[15px] xl:p-[18px] flex flex-col items-center gap-[8px] lg:gap-[10px] xl:gap-[12px]">
              <div className="w-[32px] h-[32px] lg:w-[36px] lg:h-[36px] xl:w-[40px] xl:h-[40px] bg-[#FFEBEE] rounded-full flex items-center justify-center">
                <Icon
                  name="AvgLikesIcon.svg"
                  className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] text-[#E91E63]"
                  alt="Avg. Likes"
                />
              </div>
              <div className="text-center">
                <div className="text-[#71737c] text-[10px] lg:text-[12px] xl:text-[14px] font-medium mb-1">
                  Avg. Likes
                </div>
                <div className="text-[#06152b] text-[14px] lg:text-[16px] xl:text-[18px] font-bold mb-1">
                  {formatNumber(creator.avg_likes || 0)}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Icon 
                    name={creator.avg_likes_change_type === 'positive' ? 'PositiveChangeIcon.svg' : 'NegativeChangeIcon.svg'}
                    className="w-[10px] h-[10px] lg:w-[12px] lg:h-[12px] xl:w-[14px] xl:h-[14px]" 
                    alt={creator.avg_likes_change_type === 'positive' ? 'Positive change' : 'Negative change'} 
                  />
                  <span className={`text-[10px] lg:text-[12px] xl:text-[14px] font-medium ${
                    creator.avg_likes_change_type === 'positive' ? 'text-[#1ad598]' : 'text-[#ea3a3d]'
                  }`}>
                    {creator.avg_likes_change_type === 'positive' ? '+' : ''}{creator.avg_likes_change?.toFixed(2) || '0.00'}%
                  </span>
                </div>
              </div>
            </div>

            {/* Avg. Comments */}
            <div className="bg-white rounded-[10px] p-[12px] lg:p-[15px] xl:p-[18px] flex flex-col items-center gap-[8px] lg:gap-[10px] xl:gap-[12px]">
              <div className="w-[32px] h-[32px] lg:w-[36px] lg:h-[36px] xl:w-[40px] xl:h-[40px] bg-[#E8F5E8] rounded-full flex items-center justify-center">
                <Icon
                  name="AvgCommentsIcon.svg"
                  className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] text-[#4CAF50]"
                  alt="Avg. Comments"
                />
              </div>
              <div className="text-center">
                <div className="text-[#71737c] text-[10px] lg:text-[12px] xl:text-[14px] font-medium mb-1">
                  Avg. Comments
                </div>
                <div className="text-[#06152b] text-[14px] lg:text-[16px] xl:text-[18px] font-bold mb-1">
                  {formatNumber(creator.avg_comments || 0)}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Icon 
                    name={creator.avg_comments_change_type === 'positive' ? 'PositiveChangeIcon.svg' : 'NegativeChangeIcon.svg'}
                    className="w-[10px] h-[10px] lg:w-[12px] lg:h-[12px] xl:w-[14px] xl:h-[14px]" 
                    alt={creator.avg_comments_change_type === 'positive' ? 'Positive change' : 'Negative change'} 
                  />
                  <span className={`text-[10px] lg:text-[12px] xl:text-[14px] font-medium ${
                    creator.avg_comments_change_type === 'positive' ? 'text-[#1ad598]' : 'text-[#ea3a3d]'
                  }`}>
                    {creator.avg_comments_change_type === 'positive' ? '+' : ''}{creator.avg_comments_change?.toFixed(2) || '0.00'}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buzz Score Card */}
        <div className="px-[20px] lg:px-[25px] xl:px-[30px] mb-[25px] lg:mb-[30px] xl:mb-[35px]">
          <div className="bg-white rounded-[10px] p-[15px] lg:p-[18px] xl:p-[20px]">
            <div className="flex items-center justify-between mb-[12px] lg:mb-[15px] xl:mb-[18px]">
              <div className="flex items-center gap-[8px] lg:gap-[10px] xl:gap-[12px]">
                <span className="text-[#00518B] text-[14px] lg:text-[16px] xl:text-[18px] font-bold">
                  Buzz Score
                </span>
                <span 
                  className="text-[14px] lg:text-[16px] xl:text-[18px] font-bold"
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
              <Button
                onClick={() => setShowBuzzScoreInfo(!showBuzzScoreInfo)}
                className="relative p-[4px] lg:p-[6px] xl:p-[8px] bg-transparent border-0 hover:bg-gray-100 rounded-[4px] transition-colors"
              >
                <Icon
                  name="InformationIcon.svg"
                  className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] text-gray-600"
                  alt="Info"
                />
                {showBuzzScoreInfo && (
                  <div className="absolute top-full right-0 mt-2 w-[280px] lg:w-[320px] xl:w-[360px] bg-white border border-gray-200 rounded-[8px] shadow-lg p-[12px] lg:p-[15px] xl:p-[18px] z-10">
                    <p className="text-[12px] lg:text-[14px] xl:text-[16px] text-gray-700 leading-[16px] lg:leading-[18px] xl:leading-[20px]">
                      The buzz score is a performance score given to every creator based on their growth, engagement, and consistency.
                    </p>
                  </div>
                )}
              </Button>
            </div>
            
            {/* Buzz Score Bar */}
            <div className="relative">
              <div className="w-full h-[12px] lg:h-[14px] xl:h-[16px] bg-gradient-to-r from-[#FC4C4B] via-[#CD45BA] to-[#6E57FF] rounded-[6px] lg:rounded-[7px] xl:rounded-[8px] relative">
                {/* Indicating Dot */}
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                  style={{ left: `${creator.buzz_score}%` }}
                >
                  <Icon
                    name="IndicatingDot.svg"
                    className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px]"
                    alt="Score indicator"
                  />
                </div>
              </div>
              
              {/* Indicating Arrow */}
              <div 
                className="absolute -top-[20px] lg:-top-[24px] xl:-top-[28px] transform -translate-x-1/2"
                style={{ left: `${creator.buzz_score}%` }}
              >
                <Icon
                  name="IndicatingArrow.svg"
                  className="w-[12px] h-[12px] lg:w-[14px] lg:h-[14px] xl:w-[16px] xl:h-[16px]"
                  alt="Score arrow"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Latest Posts */}
        <div className="px-[20px] lg:px-[25px] xl:px-[30px] mb-[20px] lg:mb-[25px] xl:mb-[30px]">
          <h3 className="text-[#71737c] text-[16px] lg:text-[18px] xl:text-[20px] font-semibold mb-[15px] lg:mb-[18px] xl:mb-[20px]">
            Latest Posts
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[8px] lg:gap-[10px] xl:gap-[12px]">
            {creator.thumbnails.slice(0, 4).map((thumbnail, index) => (
              <div key={index} className="aspect-[9/16] rounded-[8px] lg:rounded-[10px] xl:rounded-[12px] overflow-hidden">
                <img
                  src={thumbnail}
                  alt={`${creator.username} post ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};