import React, { useEffect, useRef } from "react";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Icon } from "./icon";

interface BuzzScoreFilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  selectedScores: Set<string>;
  onScoreToggle: (score: string) => void;
  onReset: () => void;
  onConfirm: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

const scoreOptions = [
  { value: '90%+', label: '90%+' },
  { value: '80-90%', label: '80-90%' },
  { value: '70-80%', label: '70-80%' },
  { value: '60-70%', label: '60-70%' },
  { value: 'Less than 60%', label: 'Less than 60%' },
];

export const BuzzScoreFilterDropdown: React.FC<BuzzScoreFilterDropdownProps> = ({
  isOpen,
  onClose,
  selectedScores,
  onScoreToggle,
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
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
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="bg-white border border-[#dbe2eb] rounded-[12px] shadow-lg overflow-hidden w-[280px] lg:w-[320px] xl:w-[360px]"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[14px] lg:text-[16px] xl:text-[18px] text-neutral-new900">
            Filter by Buzz Score
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-[#f9fafb]"
          >
            <Icon
              name="CloseIcon.svg"
              className="w-4 h-4"
              alt="Close"
            />
          </Button>
        </div>

        {/* Score options */}
        <div className="space-y-3 mb-4">
          {scoreOptions.map((option) => (
            <div
              key={option.value}
              className={`flex items-center justify-between p-3 rounded-[8px] transition-colors cursor-pointer ${
                selectedScores.has(option.value)
                  ? 'bg-blue-100 hover:bg-blue-200'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onScoreToggle(option.value)}
            >
              <div className="flex items-center gap-3">
                <span className={`text-[13px] lg:text-[14px] xl:text-[15px] ${
                  selectedScores.has(option.value)
                    ? 'text-blue-700 font-semibold'
                    : 'text-neutral-new900 font-medium'
                }`}>
                  {option.label}
                </span>
              </div>
              <div className="flex items-center">
                {selectedScores.has(option.value) && (
                  <Icon
                    name="CheckIcon.svg"
                    className="w-4 h-4 text-blue-600"
                    alt="Selected"
                  />
                )}
                <div
                  className={`w-4 h-4 border-2 rounded-[3px] ml-2 ${
                    selectedScores.has(option.value)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-[12px] lg:text-[13px] xl:text-[14px] text-gray-500">
            {selectedScores.size} selected
          </span>
          <div className="flex items-center gap-2">
            {selectedScores.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-8 px-3 text-[12px] font-medium text-[#6b7280] hover:text-[#374151] hover:bg-[#f9fafb]"
              >
                Reset
              </Button>
            )}
            <Button
              size="sm"
              onClick={onConfirm}
              className="h-8 px-4 bg-[linear-gradient(90deg,#557EDD_0%,#6C40E4_100%)] hover:bg-[linear-gradient(90deg,#4A6BC8_0%,#5A36C7_100%)] text-white text-[12px] font-medium rounded-[6px] border-0"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};