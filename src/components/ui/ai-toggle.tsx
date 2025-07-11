import React, { useState, useRef, useEffect } from "react";
import { Icon } from "./icon";
import { CreatorListMode } from "../../types/database";

interface AIToggleProps {
  value: CreatorListMode;
  onChange: (value: CreatorListMode) => void;
  className?: string;
}

export const AIToggle: React.FC<AIToggleProps> = ({ value, onChange, className = "" }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const infoButtonRef = useRef<HTMLButtonElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target as Node) &&
        infoButtonRef.current &&
        !infoButtonRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className={`relative ${className}`}>
      {/* Toggle Container - Vertical on mobile, horizontal on larger screens */}
      <div className="flex flex-col sm:flex-row bg-white border border-[#dbe2eb] rounded-[10px] p-0 overflow-hidden">
        {/* AI Recommendations Option */}
        <button
          onClick={() => onChange('ai')}
          className={`relative flex items-center justify-center gap-[4px] lg:gap-[6px] xl:gap-[8px] px-[8px] lg:px-[12px] xl:px-[16px] py-[6px] lg:py-[8px] xl:py-[10px] h-[32px] lg:h-[40px] xl:h-[44px] font-medium text-[12px] lg:text-[14px] xl:text-[15px] transition-all duration-200 rounded-[10px] ${
            value === 'ai'
              ? 'bg-gradient-to-r from-[#E7CBFD] to-[#E0DEEA] text-neutral-new900'
              : 'bg-white text-neutral-new900 hover:bg-gray-50'
          }`}
        >
          <span className="whitespace-nowrap">AI Recommendations</span>
          <button
            ref={infoButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(!showTooltip);
            }}
            className="flex items-center justify-center w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] flex-shrink-0"
          >
            <Icon
              name="InformationIcon.svg"
              className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] xl:w-[20px] xl:h-[20px] text-gray-500"
              alt="Information"
            />
          </button>
        </button>

        {/* All Creators Option */}
        <button
          onClick={() => onChange('all')}
          className={`flex items-center justify-center px-[8px] lg:px-[12px] xl:px-[16px] py-[6px] lg:py-[8px] xl:py-[10px] h-[32px] lg:h-[40px] xl:h-[44px] font-medium text-[12px] lg:text-[14px] xl:text-[15px] transition-all duration-200 rounded-[10px] ${
            value === 'all'
              ? 'bg-gradient-to-r from-[#E7CBFD] to-[#E0DEEA] text-neutral-new900'
              : 'bg-white text-neutral-new900 hover:bg-gray-50'
          }`}
        >
          <span className="whitespace-nowrap">All Creators</span>
        </button>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute top-full mt-2 w-[280px] sm:w-[320px] lg:w-[360px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 left-1/2 transform -translate-x-1/2 sm:left-0 sm:transform-none"
        >
          <div className="flex items-start gap-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Recommendations</h3>
              <p className="text-sm text-gray-600 mb-3">
                This shows creators matched based on your preferences from signup. AI recommendations are personalized to help you find the most relevant creators for your needs.
              </p>
              <p className="text-sm text-gray-600">
                Want to modify your matching preferences? Head to your profile settings to update your preferences.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};