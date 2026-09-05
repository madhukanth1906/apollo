import React from 'react';

interface ConfidenceMeterProps {
  confidence: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
  size = 'md',
  showLabel = true,
}) => {
  let color = 'bg-emerald-500';
  let textColor = 'text-emerald-700';
  let label = 'High Confidence';

  if (confidence < 60) {
    color = 'bg-red-500';
    textColor = 'text-red-700';
    label = 'Low Confidence';
  } else if (confidence < 85) {
    color = 'bg-amber-500';
    textColor = 'text-amber-700';
    label = 'Moderate';
  }

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-[140px]">
      <div className={`flex-1 bg-slate-200 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${color} ${heights[size]} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-xs font-mono font-bold ${textColor}`}>
          {confidence}%
        </span>
      )}
    </div>
  );
};
