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
          w-full h-full top-0 right-0 rounded-none border-0
          ${/* Medium: 60% width, XL: 50% width, right side */ ''}
          md:w-[16%] md:h-full md:top-0 md:right-0 md:rounded-tl-[10px] md:rounded-bl-[10px] md:border-l md:border-t-0 md:border-r-0 md:border-b-0
          lg:w-[15%]
          xl:w-[16%]
        `}
        style={{ borderWidth: '1px' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-[15px] mb-[15px]">
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
              <h2 className="font-bold text-[#06152b] text-[16px] lg:text-[20px] xl:text-[24px] leading-[20px] lg:leading-[24px] xl:leading-[28px] truncate">
                {creator.username}
              </h2>
              <div className="flex items-center gap-[8px] lg:gap-[10px] xl:gap-[12px]">
                <span className="text-[#71737c] text-[14px] lg:text-[16px] xl:text-[18px] font-medium">
                  {creator.username_tag || `@${creator.username.toLowerCase().replace(/\s+/g, '')}`}
                </span>
                <div className="flex items-center gap-[2px] lg:gap-[3px] xl:gap-[4px]">
                  {creator.social_media.map((social, iconIndex) => (
                    <Icon
                      key={iconIndex}
                      name={getSocialMediaIcon(social.platform)}
                      className="w-[13px] h-[13px] lg:w-[15px] lg:h-[15px] xl:w-[17px] xl:h-[17px]"
                      alt={`${social.platform} logo`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Action Buttons - Positioned below username tag */}
              <div className="flex items-center gap-[8px] lg:gap-[10px] xl:gap-[12px] mt-[4px]">
                <Button
                  onClick={handleEmailClick}
                  className="flex items-center gap-[4px] lg:gap-[6px] xl:gap-[8px] px-[8px] lg:px-[10px] xl:px-[12px] py-[3px] lg:py-[4px] xl:py-[5px] bg-transparent border border-gray-300 rounded-[6px] hover:bg-gray-50 transition-colors shadow-none"
                >
                  <Icon
                    name="EmailIcon.svg"
                    className="w-[14px] h-[14px] lg:w-[16px] lg:h-[16px] xl:w-[18px] xl:h-[18px]"
                    alt="Email"
                  />
                  <span className="text-[12px] lg:text-[13px] xl:text-[14px] font-medium text-gray-700">
                    Email Creator
                  </span>
                </Button>
                <Button
                  onClick={handleDMClick}
                  className="flex items-center gap-[4px] lg:gap-[6px] xl:gap-[8px] px-[8px] lg:px-[10px] xl:px-[12px] py-[3px] lg:py-[4px] xl:py-[5px] bg-transparent border border-gray-300 rounded-[6px] hover:bg-gray-50 transition-colors shadow-none"
                >
                  <Icon
                    name="DMIcon.svg"
                    className="w-[14px] h-[14px] lg:w-[16px] lg:h-[16px] xl:w-[18px] xl:h-[18px]"
                    alt="DM"
                  />
                  <span className="text-[12px] lg:text-[13px] xl:text-[14px] font-medium text-gray-700">
                    DM Creator
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Match Score and Close Button */}
          <div className="flex items-center gap-[8px] lg:gap-[10px] xl:gap-[12px] flex-shrink-0">
            <div className="bg-green-100 text-green-600 px-[12px] lg:px-[16px] xl:px-[20px] py-[6px] lg:py-[8px] xl:py-[10px] rounded-[8px] font-bold text-[13px] lg:text-[15px] xl:text-[17px]">
              Match {creator.match_score || 0}%
            </div>
            <Button
              onClick={onClose}
              className="p-[6px] lg:p-[8px] xl:p-[10px] bg-transparent border-0 hover:bg-gray-100 transition-colors shadow-none"
            >
              <Icon
                name="CloseIcon.svg"
                className="w-[15px] h-[15px] lg:w-[17px] lg:h-[17px] xl:w-[19px] xl:h-[19px] text-gray-600"
                alt="Close"
              />
            </Button>
          </div>
        </div>

        {/* Location */}
        {creator.location && (
          <div className="px-[15px] mb-[15px]">
            <div className="flex items-center gap-[6px] lg:gap-[8px] xl:gap-[10px]">
              <Icon
                name="LocationIcon.svg"
                className="w-[14px] h-[14px] lg:w-[16px] lg:h-[16px] xl:w-[18px] xl:h-[18px] text-gray-600"
                alt="Location"
              />
              <span className="text-[#71737c] text-[14px] lg:text-[16px] xl:text-[18px] font-medium">
                {creator.location}
              </span>
            </div>
          </div>
        )}

        {/* Bio */}
        <div className="px-[15px] mb-[15px]">
          <p className="text-[#71737c] text-[14px] lg:text-[16px] xl:text-[18px] font-medium leading-[20px] lg:leading-[24px] xl:leading-[26px]">
            {creator.bio}
          </p>
        </div>

        {/* Category Badges */}
        <div className="px-[15px] mb-[15px]">
          <div className="flex items-center gap-[8px] lg:gap-[10px] xl:gap-[12px] flex-wrap">
            {creator.niches.map((niche, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-[12px] lg:px-[16px] xl:px-[20px] py-[6px] lg:py-[8px] xl:py-[10px] bg-sky-50 rounded-[8px] border-[#dbe2eb]"
              >
                <span className="font-medium text-neutral-new900 text-[13px] lg:text-[15px] xl:text-[17px]">
                  {niche}
                </span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Hashtags */}
        {creator.hashtags && creator.hashtags.length > 0 && (
          <div className="px-[15px] mb-[15px]">
            <div 
              ref={hashtagsRowRef}
              className={`flex items-center gap-[6px] lg:gap-[8px] xl:gap-[10px] ${showAllHashtags ? 'flex-wrap' : 'flex-nowrap'}`}
            >
              {displayedHashtags.map((hashtag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-[10px] lg:px-[12px] xl:px-[14px] py-[4px] lg:py-[6px] xl:py-[8px] bg-gray-100 rounded-[6px] border-gray-300 flex-shrink-0"
                >
                  <span className="font-medium text-gray-600 text-[13px] lg:text-[15px] xl:text-[17px]">
                    {hashtag}
                  </span>
                </Badge>
              ))}
              {hasMoreHashtags && (
                <Button
                  onClick={() => setShowAllHashtags(!showAllHashtags)}
                  className="p-[4px] lg:p-[6px] xl:p-[8px] bg-transparent border-0 hover:bg-gray-100 transition-colors flex-shrink-0 shadow-none"
                >
                  <Icon
                    name="HashtagsDropdownIcon.svg"
                    className={`w-[8px] h-[8px] lg:w-[10px] lg:h-[10px] xl:w-[12px] xl:h-[12px] transition-transform ${
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
        <div className="px-[15px] mb-[15px]">
          <div className="grid grid-cols-5 gap-[3px] lg:gap-[4px] xl:gap-[5px]">
            {/* Followers */}
            <div className="bg-white rounded-[12px] px-[6px] py-[10px] flex flex-col items-center gap-[8px] lg:gap-[10px] xl:gap-[12px]">
              <div className="flex items-center justify-center">
                <Icon
                  name="FollowerIcon.svg"
                  className="w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] xl:w-[48px] xl:h-[48px]"
                  alt="Followers"
                />
              </div>
              <div className="text-center">
                <div className="text-[#71737c] text-[10px] lg:text-[11px] xl:text-[12px] font-medium mb-1">
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
                  <span className={`text-[10px] lg:text-[11px] xl:text-[12px] font-medium ${
                    creator.followers_change_type === 'positive' ? 'text-[#1ad598]' : 'text-[#ea3a3d]'
                  }`}>
                    {creator.followers_change?.toFixed(2) || '0.00'}%
                  </span>
                </div>
              </div>
            </div>

            {/* Avg. Views */}
            <div className="bg-white rounded-[12px] px-[6px] py-[10px] flex flex-col items-center gap-[8px] lg:gap-[10px] xl:gap-[12px]">
              <div className="flex items-center justify-center">
                <Icon
                  name="AvgViewsIcon.svg"
                  className="w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] xl:w-[48px] xl:h-[48px]"
                  alt="Avg. Views"
                />
              </div>
              <div className="text-center">
                <div className="text-[#71737c] text-[10px] lg:text-[11px] xl:text-[12px] font-medium mb-1">
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
                  <span className={`text-[10px] lg:text-[11px] xl:text-[12px] font-medium ${
                    creator.avg_views_change_type === 'positive' ? 'text-[#1ad598]' : 'text-[#ea3a3d]'
                  }`}>
                    {creator.avg_views_change?.toFixed(2) || '0.00'}%
                  </span>
                </div>
              </div>
            </div>

            {/* Engagement */}
            <div className="bg-white rounded-[12px] px-[6px] py-[10px] flex flex-col items-center gap-[8px] lg:gap-[10px] xl:gap-[12px]">
              <div className="flex items-center justify-center">
                <Icon
                  name="AvgEngagementIcon.svg"
                  className="w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] xl:w-[48px] xl:h-[48px]"
                  alt="Engagement"
                />
              </div>
              <div className="text-center">
                <div className="text-[#71737c] text-[10px] lg:text-[11px] xl:text-[12px] font-medium mb-1">
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
                  <span className={`text-[10px] lg:text-[11px] xl:text-[12px] font-medium ${
                    creator.engagement_change_type === 'positive' ? 'text-[#1ad598]' : 'text-[#ea3a3d]'
                  }`}>
                    {creator.engagement_change?.toFixed(2) || '0.00'}%
                  </span>
                </div>
              </div>
            </div>

            {/* Avg. Likes */}
            <div className="bg-white rounded-[12px] px-[6px] py-[10px] flex flex-col items-center gap-[8px] lg:gap-[10px] xl:gap-[12px]">
              <div className="flex items-center justify-center">
                <Icon
                  name="AvgLikesIcon.svg"
                  className="w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] xl:w-[48px] xl:h-[48px]"
                  alt="Avg. Likes"
                />
              </div>
              <div className="text-center">
                <div className="text-[#71737c] text-[10px] lg:text-[11px] xl:text-[12px] font-medium mb-1">
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
                  <span className={`text-[10px] lg:text-[11px] xl:text-[12px] font-medium ${
                    creator.avg_likes_change_type === 'positive' ? 'text-[#1ad598]' : 'text-[#ea3a3d]'
                  }`}>
                    {creator.avg_likes_change?.toFixed(2) || '0.00'}%
                  </span>
                </div>
              </div>
            </div>

            {/* Avg. Comments */}
            <div className="bg-white rounded-[12px] px-[6px] py-[10px] flex flex-col items-center gap-[8px] lg:gap-[10px] xl:gap-[12px]">
              <div className="flex items-center justify-center">
                <Icon
                  name="AvgCommentsIcon.svg"
                  className="w-[40px] h-[40px] lg:w-[44px] lg:h-[44px] xl:w-[48px] xl:h-[48px]"
                  alt="Avg. Comments"
                />
              </div>
              <div className="text-center">
                <div className="text-[#71737c] text-[10px] lg:text-[11px] xl:text-[12px] font-medium mb-1">
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
                  <span className={`text-[10px] lg:text-[11px] xl:text-[12px] font-medium ${
                    creator.avg_comments_change_type === 'positive' ? 'text-[#1ad598]' : 'text-[#ea3a3d]'
                  }`}>
                    {creator.avg_comments_change?.toFixed(2) || '0.00'}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buzz Score Card */}
        <div className="px-[15px] mb-[15px]">
          <div className="bg-white rounded-[12px] px-[20px] lg:px-[24px] xl:px-[28px] pt-[19px] lg:pt-[23px] xl:pt-[27px] pb-[20px] lg:pb-[24px] xl:pb-[28px]">
            <div className="flex items-center justify-between mb-[12px] lg:mb-[15px] xl:mb-[18px]">
              <div className="flex items-center gap-[8px] lg:gap-[10px] xl:gap-[12px]">
                <span className="text-[#00518B] text-[15px] lg:text-[17px] xl:text-[19px] font-bold">
                  Buzz Score
                </span>
                <span 
                  className="text-[15px] lg:text-[17px] xl:text-[19px] font-bold"
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
                className="relative p-[4px] lg:p-[6px] xl:p-[8px] bg-transparent border-0 hover:bg-gray-100 transition-colors shadow-none"
              >
                <Icon
                  name="InformationIcon.svg"
                  className="w-[12px] h-[12px] lg:w-[14px] lg:h-[14px] xl:w-[16px] xl:h-[16px] text-gray-600"
                  alt="Info"
                />
                {showBuzzScoreInfo && (
                  <div className="absolute top-full right-0 mt-2 w-[280px] lg:w-[320px] xl:w-[360px] bg-white border border-gray-200 rounded-[10px] shadow-lg p-[16px] lg:p-[20px] xl:p-[24px] z-10 break-words">
                    <p className="text-[14px] lg:text-[16px] xl:text-[18px] text-gray-700 leading-[20px] lg:leading-[24px] xl:leading-[28px] whitespace-normal">
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
                  <div className="w-[4px] h-[4px] lg:w-[6px] lg:h-[6px] xl:w-[8px] xl:h-[8px] bg-white rounded-full border border-gray-300" />
                </div>
              </div>
              
              {/* Indicating Arrow */}
              <div 
                className="absolute top-full transform -translate-x-1/2 mt-[2px] text-black"
                style={{ left: `${creator.buzz_score}%` }}
              >
                <div 
                  className="border-l-[5.355px] border-r-[5.355px] border-t-[5.25px] border-l-transparent border-r-transparent border-t-black"
                  style={{ width: '10.71px', height: '5.25px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Latest Posts */}
        <div className="px-[15px] mb-[15px]">
          <h3 className="text-[#71737c] text-[14px] lg:text-[16px] xl:text-[18px] font-semibold mb-[12px] lg:mb-[15px] xl:mb-[18px]">
            Latest Posts
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[12px] lg:gap-[15px] xl:gap-[18px]">
            {[...creator.thumbnails.slice(0, 3), '/images/PostThumbnail-3.svg'].map((thumbnail, index) => (
              <div key={index} className="aspect-[9/16] rounded-[10px] lg:rounded-[12px] xl:rounded-[14px] overflow-hidden">
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