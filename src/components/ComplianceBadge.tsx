import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { ComplianceStatus } from '@/types/inspection';

interface ComplianceBadgeProps {
  status: ComplianceStatus | 'INCONSISTENT' | 'CONSISTENT' | 'COMPLIANT' | 'NON-COMPLIANT' | 'REQUIRES REVIEW';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const ComplianceBadge: React.FC<ComplianceBadgeProps> = ({ 
  status, 
  size = 'md',
  showIcon = true 
}) => {
  let bg = 'bg-slate-100 text-slate-700 border-slate-300';
  let Icon = Info;
  let text = String(status);

  if (status === 'PASS' || status === 'COMPLIANT' || status === 'CONSISTENT') {
    bg = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    Icon = CheckCircle;
    text = status === 'CONSISTENT' ? 'CONSISTENT' : 'COMPLIANT';
  } else if (status === 'FAIL' || status === 'NON-COMPLIANT' || status === 'INCONSISTENT') {
    bg = 'bg-red-50 text-red-800 border-red-300';
    Icon = XCircle;
    text = status === 'INCONSISTENT' ? 'INCONSISTENT' : 'VIOLATION';
  } else if (status === 'REVIEW' || status === 'REQUIRES REVIEW') {
    bg = 'bg-amber-50 text-amber-800 border-amber-300';
    Icon = AlertTriangle;
    text = 'REQUIRES REVIEW';
  }

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center rounded border font-medium tracking-wide shadow-2xs ${bg} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{text}</span>
    </span>
  );
};
