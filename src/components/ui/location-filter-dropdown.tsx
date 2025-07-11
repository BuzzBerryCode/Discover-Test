import React, { useEffect, useRef } from 'react';
import { Button } from './button';
import { Checkbox } from './checkbox';

interface LocationFilterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocations: Set<string>;
  onLocationToggle: (location: string) => void;
  onReset: () => void;
  onConfirm: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

const countries = [
  'United States',
  'United Kingdom', 
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Japan',
  'South Korea',
  'Singapore',
  'Brazil',
  'Mexico',
  'Argentina',
  'India',
  'China',
  'Russia',
  'Poland',
  'Czech Republic',
  'Austria',
  'Switzerland',
  'Belgium',
  'Portugal',
  'Ireland',
  'New Zealand'
];

export const LocationFilterDropdown: React.FC<LocationFilterDropdownProps> = ({
  isOpen,
  onClose,
  selectedLocations,
  onLocationToggle,
  onReset,
  onConfirm,
  triggerRef,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Position dropdown
  useEffect(() => {
    if (isOpen && dropdownRef.current && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdown = dropdownRef.current;
      
      // Position below the trigger button
      dropdown.style.position = 'fixed';
      dropdown.style.top = `${triggerRect.bottom + 8}px`;
      dropdown.style.left = `${triggerRect.left}px`;
      dropdown.style.zIndex = '9999';
    }
  }, [isOpen, triggerRef]);

  // Close on outside click
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
      className="w-[320px] bg-white border border-[#e5e7eb] rounded-[12px] shadow-lg overflow-hidden"
    >
      <div className="p-4">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-[16px] font-semibold text-[#111827] mb-1">
            Filter by Location
          </h3>
        </div>

        {/* Countries list */}
        <div className="max-h-[280px] overflow-y-auto">
          <div className="space-y-2">
            {countries.map((country) => (
              <div
                key={country}
                className="flex items-center space-x-3 p-2 hover:bg-[#f9fafb] rounded-[6px] cursor-pointer"
                onClick={() => onLocationToggle(country)}
              >
                <Checkbox
                  checked={selectedLocations.has(country)}
                  onCheckedChange={() => onLocationToggle(country)}
                  className="w-4 h-4"
                />
                <label className="text-[14px] text-[#111827] cursor-pointer flex-1">
                  {country}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with buttons */}
      <div className="p-3 border-t border-[#f3f4f6] flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 px-3 text-[12px] font-medium text-[#6b7280] hover:text-[#374151] hover:bg-[#f9fafb]"
        >
          Reset
        </Button>
        <Button
          size="sm"
          onClick={onConfirm}
          className="h-8 px-4 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-[12px] font-medium rounded-[6px] border-0"
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};