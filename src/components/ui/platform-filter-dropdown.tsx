import React, { useEffect, useRef } from "react";
import { Button } from "./button";
import { Icon } from "./icon";

interface PlatformFilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlatforms: Set<string>;
  onPlatformToggle: (platform: string) => void;
  onReset: () => void;
  onConfirm: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

const platformOptions = [
  { 
    value: "instagram", 
    label: "Instagram", 
    icon: "InstagramLogo.svg",
    available: true 
  },
  { 
    value: "tiktok", 
    label: "TikTok", 
    icon: "TikTokLogo.svg",
    available: true 
  },
  { 
    value: "youtube", 
    label: "YouTube", 
    icon: "YouTubeLogo.svg",
    available: false 
  },
  { 
    value: "x", 
    label: "X (Twitter)", 
    icon: "XLogo.svg",
    available: false 
  },
];

export const PlatformFilterDropdown: React.FC<PlatformFilterDropdownProps> = ({
  isOpen,
  onClose,
  selectedPlatforms,
  onPlatformToggle,
  onReset,
  onConfirm,
  triggerRef,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Position dropdown relative to trigger
  useEffect(() => {
    if (isOpen && dropdownRef.current && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdown = dropdownRef.current;
      
      dropdown.style.position = 'fixed';
      dropdown.style.top = `${triggerRect.bottom + 8}px`;
      dropdown.style.left = `${triggerRect.left}px`;
      dropdown.style.minWidth = `${triggerRect.width}px`;
      dropdown.style.zIndex = '9999';
    }
  }, [isOpen, triggerRef]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handlePlatformClick = (platform: typeof platformOptions[0]) => {
    if (platform.available) {
      onPlatformToggle(platform.value);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="bg-white border border-[#dbe2eb] rounded-[12px] shadow-lg p-4 w-[280px] lg:w-[320px] xl:w-[360px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[14px] lg:text-[16px] xl:text-[18px] text-neutral-new900">
          Filter by Platform
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 hover:bg-gray-100"
        >
          <Icon
            name="CloseIcon.svg"
            className="w-4 h-4"
            alt="Close"
          />
        </Button>
      </div>

      {/* Platform options */}
      <div className="space-y-3 mb-4">
        {platformOptions.map((platform) => (
          <div
            key={platform.value}
            className={`flex items-center justify-between p-3 rounded-[8px] transition-colors ${
              platform.available
                ? 'hover:bg-gray-50 cursor-pointer'
                : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={() => handlePlatformClick(platform)}
          >
            <div className="flex items-center gap-3">
              <Icon
                name={platform.icon}
                className="w-6 h-6"
                alt={platform.label}
              />
              <div className="flex flex-col">
                <span className={`font-medium text-[13px] lg:text-[14px] xl:text-[15px] ${
                  platform.available ? 'text-neutral-new900' : 'text-gray-400'
                }`}>
                  {platform.label}
                </span>
                {!platform.available && (
                  <span className="text-[11px] lg:text-[12px] text-gray-400">
                    Coming soon
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center">
              {platform.available && selectedPlatforms.has(platform.value) && (
                <Icon
                  name="CheckIcon.svg"
                  className="w-4 h-4 text-blue-600"
                  alt="Selected"
                />
              )}
              <div
                className={`w-4 h-4 border-2 rounded-[3px] ml-2 ${
                  platform.available && selectedPlatforms.has(platform.value)
                    ? 'bg-blue-600 border-blue-600'
                    : platform.available
                    ? 'border-gray-300'
                    : 'border-gray-200 bg-gray-100'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-[12px] lg:text-[13px] xl:text-[14px] text-gray-500">
          {selectedPlatforms.size} selected
        </span>
        <div className="flex items-center gap-2">
          {selectedPlatforms.size > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-[12px] lg:text-[13px] xl:text-[14px] text-gray-600 hover:text-gray-700"
            >
              Reset
            </Button>
          )}
          <Button
            size="sm"
            onClick={onConfirm}
            className="bg-[linear-gradient(90deg,#557EDD_0%,#6C40E4_100%)] hover:bg-[linear-gradient(90deg,#4A6BC8_0%,#5A36C7_100%)] text-white text-[12px] lg:text-[13px] xl:text-[14px] px-4 py-2"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};