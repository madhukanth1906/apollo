import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  hindiTitle?: string;
  value: string | number;
  percentage?: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'brand' | 'blue' | 'green' | 'red' | 'amber';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  hindiTitle,
  value,
  percentage,
  subtitle,
  icon: Icon,
  variant = 'brand',
  onClick,
}) => {
  const styles = {
    brand: {
      border: 'border-red-200/80 hover:border-red-300',
      iconBg: 'bg-red-50 text-[#8b1515]',
      accent: 'bg-[#a81c1c]',
      badge: 'bg-red-50 text-[#8b1515] border border-red-200',
    },
    blue: {
      // Legacy alias automatically mapped to brand red
      border: 'border-red-200/80 hover:border-red-300',
      iconBg: 'bg-red-50 text-[#8b1515]',
      accent: 'bg-[#a81c1c]',
      badge: 'bg-red-50 text-[#8b1515] border border-red-200',
    },
    green: {
      border: 'border-emerald-200 hover:border-emerald-400',
      iconBg: 'bg-emerald-50 text-emerald-800',
      accent: 'bg-emerald-600',
      badge: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    },
    red: {
      border: 'border-red-200 hover:border-red-400',
      iconBg: 'bg-red-50 text-red-800',
      accent: 'bg-red-600',
      badge: 'bg-red-50 text-red-800 border border-red-200',
    },
    amber: {
      border: 'border-amber-200 hover:border-amber-400',
      iconBg: 'bg-amber-50 text-amber-800',
      accent: 'bg-amber-600',
      badge: 'bg-amber-50 text-amber-800 border border-amber-200',
    },
  };

  const current = styles[variant] || styles.brand;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg p-4 border transition-all duration-200 shadow-xs relative overflow-hidden ${
        current.border
      } ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
    >
      {/* Top indicator bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${current.accent}`} />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          {hindiTitle && (
            <p className="text-[10px] text-slate-400 font-normal">{hindiTitle}</p>
          )}
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight">
              {value}
            </span>
            {percentage && (
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${current.badge}`}>
                {percentage}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>

        <div className={`p-2.5 rounded-lg ${current.iconBg} flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
