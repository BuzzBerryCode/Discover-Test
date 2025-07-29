import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Icon } from "../../ui/icon";
import { useCreatorData } from "../../../hooks/useCreatorData";
import { getTrendIcon, getTrendColor } from "../../../utils/formatters";

// Smart number formatting based on available space
const formatNumberSmart = (num: number, isLargeScreen: boolean = false): string => {
  // On larger screens or when there's more space, show full numbers up to certain thresholds
  if (isLargeScreen && num < 1000000) {
    return num.toLocaleString(); // Shows 105,230 instead of 105K
  }
  
  // Use abbreviated format for very large numbers or smaller screens
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toString();
};
export const MetricsTitleSection = (): JSX.Element => {
  const { metrics, loading } = useCreatorData();

  // Detect screen size for smart formatting
  const [isLargeScreen, setIsLargeScreen] = React.useState(false);
  
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1280); // xl breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  // Static metric configurations
  const metricConfigs = [
    {
      title: "Total Creators",
      iconSrc: "CreatorIcon.svg", // Keep existing for Total Creators
      getValue: () => metrics?.total_creators?.toString() || "0",
    },
    {
      title: "Avg. Followers",
      iconSrc: "FollowerIcon.svg",
      getValue: () => formatNumberSmart(metrics?.avg_followers || 0, isLargeScreen),
    },
    {
      title: "Avg. Views",
      iconSrc: "AvgViewsIcon.svg",
      getValue: () => formatNumberSmart(metrics?.avg_views || 0, isLargeScreen),
    },
    {
      title: "Avg. Engagement",
      iconSrc: "AvgEngagementIcon.svg",
      getValue: () => `${metrics?.avg_engagement?.toFixed(1) || "0.0"}%`,
    },
  ];

  if (loading) {
    return (
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between w-full flex-shrink-0 gap-3 xl:gap-4 min-h-[60px]">
        <div className="flex flex-col justify-center flex-shrink-0">
          <h1 className="font-bold font-['Inter',Helvetica] text-neutral-100 text-[18px] lg:text-[20px] xl:text-[22px] leading-[22px] lg:leading-[24px] xl:leading-[26px] mb-[-2px]">
            Discover Creators
          </h1>
          <p className="font-['Inter',Helvetica] font-medium text-neutral-new600 text-[12px] lg:text-[14px] xl:text-[16px] leading-[16px] lg:leading-[18px] xl:leading-[20px]">
            Loading metrics...
          </p>
        </div>
        <div className="hidden xl:block h-[50px] w-px bg-[#e1e5e9] mx-4 flex-shrink-0" />
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-[6px] lg:gap-[8px] xl:gap-[10px] w-full xl:w-auto xl:flex-1 xl:max-w-none">
          {Array(4).fill(0).map((_, index) => (
            <Card key={index} className="bg-white rounded-[12px] border-0 shadow-sm h-[60px] lg:h-[65px] xl:h-[70px] w-full animate-pulse">
              <CardContent className="flex items-center gap-[8px] lg:gap-[10px] xl:gap-[12px] px-[8px] lg:px-[12px] xl:px-[15px] py-[8px] lg:py-[10px] xl:py-[12px] h-full">
                <div className="w-[28px] h-[28px] lg:w-[32px] lg:h-[32px] xl:w-[36px] xl:h-[36px] bg-gray-200 rounded-full flex-shrink-0" />
                <div className="flex flex-col justify-center h-[35px] lg:h-[40px] xl:h-[45px] min-w-[50px] lg:min-w-[60px] xl:min-w-[70px] flex-1">
                  <div className="h-3 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between w-full flex-shrink-0 gap-3 xl:gap-4 min-h-[60px]">
      {/* Title and subtitle */}
      <div className="flex flex-col justify-center flex-shrink-0">
        <h1 className="font-bold font-['Inter',Helvetica] text-neutral-100 text-[18px] lg:text-[20px] xl:text-[22px] leading-[22px] lg:leading-[24px] xl:leading-[26px] mb-[-2px]">
          Discover Creators
        </h1>
        <p className="font-['Inter',Helvetica] font-medium text-neutral-new600 text-[12px] lg:text-[14px] xl:text-[16px] leading-[16px] lg:leading-[18px] xl:leading-[20px]">
          Welcome to your dashboard
        </p>
      </div>

      {/* Divider - Hidden on mobile and tablet, visible on xl+ */}
      <div className="hidden xl:block h-[50px] w-px bg-[#e1e5e9] mx-4 flex-shrink-0" />

      {/* Dynamic Metric cards - Full width responsive grid optimized for larger screens */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-[6px] lg:gap-[8px] xl:gap-[10px] w-full xl:w-auto xl:flex-1 xl:max-w-none">
        {metricConfigs.map((metric, index) => (
          <Card key={index} className="bg-white rounded-[12px] border-0 shadow-sm h-[60px] lg:h-[65px] xl:h-[70px] w-full">
            <CardContent className="flex items-center gap-[8px] lg:gap-[10px] xl:gap-[12px] px-[8px] lg:px-[12px] xl:px-[15px] py-[8px] lg:py-[10px] xl:py-[12px] h-full">
              {/* Icon - Responsive sizing for larger screens */}
              <div className="flex items-center justify-center flex-shrink-0">
                <Icon
                  name={metric.iconSrc}
                  className="w-[28px] h-[28px] lg:w-[32px] lg:h-[32px] xl:w-[36px] xl:h-[36px]"
                  alt={metric.title}
                />
              </div>

              {/* Dynamic Metric information - Enhanced responsive sizing */}
              <div className="flex flex-col justify-center h-[35px] lg:h-[40px] xl:h-[45px] min-w-[50px] lg:min-w-[60px] xl:min-w-[70px] flex-1">
                <div className="font-['Inter',Helvetica] font-semibold text-[#71737c] text-[10px] lg:text-[12px] xl:text-[13px] leading-[12px] lg:leading-[14px] xl:leading-[16px] mb-[1px]">
                  {metric.title}
                </div>
                <div className="font-['Inter',Helvetica] font-semibold text-[#080d1c] text-[14px] lg:text-[16px] xl:text-[18px] leading-[16px] lg:leading-[18px] xl:leading-[20px] mb-[1px]">
                  {metric.getValue()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};