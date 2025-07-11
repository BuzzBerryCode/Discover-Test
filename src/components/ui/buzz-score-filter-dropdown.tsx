import React, { useEffect, useRef } from "react";
import { Button } from "./button";
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
            className="h-6 w-6 p-0 hover:bg-gray-100"
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
              className="flex items-center justify-between p-3 rounded-[8px] transition-colors hover:bg-gray-50 cursor-pointer"
              onClick={() => onScoreToggle(option.value)}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-[13px] lg:text-[14px] xl:text-[15px] text-neutral-new900">
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
    </div>
  );
};

          Filter by Buzz Score
        </div>
        
        <div className="space-y-2 lg:space-y-3 xl:space-y-4 max-h-[200px] lg:max-h-[220px] xl:max-h-[240px] overflow-y-auto">
          {scoreOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 lg:gap-3 xl:gap-4 cursor-pointer hover:bg-gray-50 p-1 lg:p-2 xl:p-3 rounded-[6px] transition-colors"
            >
              <Checkbox
                checked={selectedScores.has(option.value)}
                onCheckedChange={() => onScoreToggle(option.value)}
                className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 border-2 border-gray-300 rounded data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <span className="text-[12px] lg:text-[13px] xl:text-[14px] text-gray-700 font-medium">
                {option.label}
              </span>
            </label>
          ))}
        </div>
        
        <div className="border-t border-gray-100 mt-3 lg:mt-4 xl:mt-5 pt-3 lg:pt-4 xl:pt-5 flex justify-between items-center">
          <span className="text-[11px] lg:text-[12px] xl:text-[13px] text-gray-500">
            {selectedScores.size} selected
          </span>
          <div className="flex items-center gap-2 lg:gap-3 xl:gap-4">
            {selectedScores.size > 0 && (
              <Button
                variant="ghost"
                onClick={onReset}
                className="text-[11px] lg:text-[12px] xl:text-[13px] text-blue-600 hover:text-blue-700 font-medium p-0 h-auto"
              >
                Reset
              </Button>
            )}
            <Button
              onClick={onConfirm}
              className="text-[11px] lg:text-[12px] xl:text-[13px] text-white bg-blue-600 hover:bg-blue-700 font-medium px-3 lg:px-4 xl:px-5 py-1 lg:py-2 xl:py-3 rounded h-auto"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};