import React from 'react';

export const CircularProgress = ({
  value,
  text,
  subtext,
  size = 180,
  strokeWidth = 14,
  color = '#2F5E60',
  backgroundColor = '#E2E8F0' // Light/soft blue/gray border
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
        />
        {/* Foreground Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-[44px] font-bold text-[#0F172A] leading-none mb-1">{text}</span>
        <span className="text-[14px] font-bold text-[#2F5E60] tracking-wider uppercase">{subtext}</span>
      </div>
    </div>
  );
};
