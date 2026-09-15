'use client';

import React from 'react';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="no-print bg-[#0B2852] text-slate-300 text-xs border-t border-[#081d3d] mt-auto relative overflow-hidden">
      {/* Subtle tricolor accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#ff9933] via-white to-[#138808]" />
      
      <div className="max-w-[1720px] mx-auto py-5 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left relative z-10">
        
        {/* Left: Copyright */}
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-blue-400 opacity-80" />
          <p className="font-medium text-slate-400 text-[11px]">
            © 2026 Department of Consumer Affairs, Government of India. All rights reserved.
          </p>
        </div>

        {/* Center: Links */}
        <div className="flex items-center justify-center md:justify-start gap-6 text-[11px] font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-white transition-colors">Feedback</a>
        </div>

        {/* Right: Slogan */}
        <div className="text-[11px] font-bold text-blue-200 tracking-wide uppercase">
          Designed for a Transparent and Consumer-First India
        </div>
      </div>
    </footer>
  );
};
