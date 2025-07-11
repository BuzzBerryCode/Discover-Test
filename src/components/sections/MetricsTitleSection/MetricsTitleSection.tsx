import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Icon } from "../../ui/icon";
import { useCreatorData } from "../../../hooks/useCreatorData";
import { formatNumber, formatPercentage, getTrendIcon, getTrendColor } from "../../../utils/formatters";

export const MetricsTitleSection = (): JSX.Element => {
  const { metrics, loading } = useCreatorData();

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
      getValue: () => formatNumber(metrics?.avg_followers || 0),
    },
    {
      title: "Avg. Views",
      iconSrc: "AvgViewsIcon.svg",
      getValue: () => formatNumber(metrics?.avg_views || 0),
    },
    {
      title: "Avg. Engagement",
      iconSrc: "AvgEngagementIcon.svg",
      getValue: () => `${metrics?.avg_engagement?.toFixed(1) || "0.0"}%`,
    },
  ];

  if (loading) {
    return (
      <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between w-full flex-shrink-0 gap-4 xl:gap-6 min-h-[80px]">
        <div className="flex flex-col justify-center flex-shrink-0">
          <h1 className="font-bold font-['Inter',Helvetica] text-neutral-100 text-[20px] lg:text-[24px] xl:text-[28px] leading-[26px] lg:leading-[30px] xl:leading-[34px] mb-[-2px]">
            Discover Creators
          </h1>
          <p className="font-['Inter',Helvetica] font-medium text-neutral-new600 text-[14px] lg:text-[16px] xl:text-[18px] leading-[18px] lg:leading-[20px] xl:leading-[22px]">
            Loading metrics...
          </p>
        </div>
        <div className="hidden xl:block h-[60px] w-px bg-[#e1e5e9] mx-6 flex-shrink-0" />
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-[8px] lg:gap-[10px] xl:gap-[12px] 2xl:gap-[15px] w-full xl:w-auto xl:flex-1 xl:max-w-none">
          {Array(4).fill(0).map((_, index) => (
            <Card key={index} className="bg-white rounded-[12px] border-0 shadow-sm h-[70px] lg:h-[80px] xl:h-[90px] 2xl:h-[100px] w-full animate-pulse">
              <CardContent className="flex items-center gap-[10px] lg:gap-[15px] xl:gap-[18px] px-[10px] lg:px-[15px] xl:px-[18px] py-[10px] lg:py-[15px] xl:py-[18px] h-full">
                <div className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px] xl:w-[48px] xl:h-[48px] 2xl:w-[52px] 2xl:h-[52px] bg-gray-200 rounded-full flex-shrink-0" />
                <div className="flex flex-col justify-center h-[40px] lg:h-[50px] xl:h-[60px] min-w-[60px] lg:min-w-[80px] xl:min-w-[100px] flex-1">
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
    <section className="flex flex-col xl:flex-row xl:items-center xl:justify-between w-full flex-shrink-0 gap-4 xl:gap-6 min-h-[80px]">
      {/* Title and subtitle */}
      <div className="flex flex-col justify-center flex-shrink-0">
        <h1 className="font-bold font-['Inter',Helvetica] text-neutral-100 text-[20px] lg:text-[24px] xl:text-[28px] leading-[26px] lg:leading-[30px] xl:leading-[34px] mb-[-2px]">
          Discover Creators
        </h1>
        <p className="font-['Inter',Helvetica] font-medium text-neutral-new600 text-[14px] lg:text-[16px] xl:text-[18px] leading-[18px] lg:leading-[20px] xl:leading-[22px]">
          Welcome to your dashboard
        </p>
      </div>

      {/* Divider - Hidden on mobile and tablet, visible on xl+ */}
      <div className="hidden xl:block h-[60px] w-px bg-[#e1e5e9] mx-6 flex-shrink-0" />

      {/* Dynamic Metric cards - Full width responsive grid optimized for larger screens */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-[8px] lg:gap-[10px] xl:gap-[12px] 2xl:gap-[15px] w-full xl:w-auto xl:flex-1 xl:max-w-none">
        {metricConfigs.map((metric, index) => (
          <Card key={index} className="bg-white rounded-[12px] border-0 shadow-sm h-[70px] lg:h-[80px] xl:h-[90px] 2xl:h-[100px] w-full">
            <CardContent className="flex items-center gap-[10px] lg:gap-[15px] xl:gap-[18px] px-[10px] lg:px-[15px] xl:px-[18px] py-[10px] lg:py-[15px] xl:py-[18px] h-full">
              {/* Icon - Responsive sizing for larger screens */}
              <div className="flex items-center justify-center flex-shrink-0">
                <Icon
                  name={metric.iconSrc}
                  className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px] xl:w-[48px] xl:h-[48px] 2xl:w-[52px] 2xl:h-[52px]"
                  alt={metric.title}
                />
              </div>

              {/* Dynamic Metric information - Enhanced responsive sizing */}
              <div className="flex flex-col justify-center h-[40px] lg:h-[50px] xl:h-[60px] min-w-[60px] lg:min-w-[80px] xl:min-w-[100px] flex-1">
                <div className="font-['Inter',Helvetica] font-semibold text-[#71737c] text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[16px] leading-[14px] lg:leading-[16px] xl:leading-[18px] mb-[2px]">
                  {metric.title}
                </div>
                <div className="font-['Inter',Helvetica] font-semibold text-[#080d1c] text-[16px] lg:text-[18px] xl:text-[20px] 2xl:text-[22px] leading-[18px] lg:leading-[20px] xl:leading-[22px] mb-[2px]">
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