'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
  id: string;
  stepNumber: number;
  label: string;
  src: string;
  alt: string;
  title: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'step-1-capture',
    stepNumber: 1,
    label: 'Capture',
    src: '/images/banners/step1_capture.png',
    alt: '1 Capture: Upload or snap a photo of your documents from any device',
    title: 'Step 1: Capture — Upload or snap a photo of documents from any device'
  },
  {
    id: 'step-2-extract',
    stepNumber: 2,
    label: 'Extract',
    src: '/images/banners/step2_extract.png',
    alt: '2 Extract: Our AI reads your document and automatically extracts key information',
    title: 'Step 2: Extract — AI reads document and automatically extracts key information'
  },
  {
    id: 'step-3-validate',
    stepNumber: 3,
    label: 'Validate',
    src: '/images/banners/step3_validate.png',
    alt: '3 Validate: We check the extracted data for accuracy and completeness against your rules and trusted sources',
    title: 'Step 3: Validate — Verify accuracy, ensure completeness against rules and trusted sources'
  },
  {
    id: 'step-4-flag',
    stepNumber: 4,
    label: 'Flag',
    src: '/images/banners/step4_flag.png',
    alt: '4 Flag: Potential issues or exceptions are automatically flagged for your review',
    title: 'Step 4: Flag — Potential issues or exceptions are automatically flagged for review'
  },
  {
    id: 'step-5-report',
    stepNumber: 5,
    label: 'Report',
    src: '/images/banners/step5_report.png',
    alt: '5 Report: Get clear, actionable reports and insights to make faster, smarter decisions',
    title: 'Step 5: Report — Clear, actionable reports and insights to make faster, smarter decisions'
  }
];

export const GovernmentBannerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = BANNER_SLIDES.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay timer with pause on hover
  useEffect(() => {
    if (isHovered) {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      goToNext();
    }, 4500);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isHovered, goToNext]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40; // minimum swipe distance in px

    if (diff > threshold) {
      // Swiped left -> next
      goToNext();
    } else if (diff < -threshold) {
      // Swiped right -> prev
      goToPrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section 
      aria-roledescription="carousel" 
      aria-label="Department of Consumer Affairs Key Initiatives"
      className="w-full relative my-2 sm:my-3 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Card Container */}
      <div 
        className="w-full relative rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden bg-slate-50 flex items-center justify-center h-44 sm:h-60 md:h-72 lg:h-80 xl:h-[320px] 2xl:h-[340px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Track */}
        <div className="relative w-full h-full flex items-center justify-center">
          {BANNER_SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${totalSlides}: ${slide.title}`}
                className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-contain mx-auto"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
            );
          })}
        </div>

        {/* Previous Slide Arrow Button */}
        <button
          type="button"
          onClick={goToPrev}
          aria-label="Previous banner"
          className="absolute left-2 sm:left-4 z-20 p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 hover:text-[#8b1515] shadow-md border border-slate-200/80 backdrop-blur-xs transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-[#8b1515]"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Next Slide Arrow Button */}
        <button
          type="button"
          onClick={goToNext}
          aria-label="Next banner"
          className="absolute right-2 sm:right-4 z-20 p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 hover:text-[#8b1515] shadow-md border border-slate-200/80 backdrop-blur-xs transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-[#8b1515]"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Floating Indicator Step Pills */}
        <div className="absolute bottom-2.5 sm:bottom-3.5 z-20 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 shadow-lg">
          {BANNER_SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Go to step ${slide.stepNumber}: ${slide.label}`}
                className={`transition-all rounded-full flex items-center gap-1 px-2 py-0.5 sm:px-2.5 text-[10px] sm:text-[11px] font-bold cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-sm scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <span className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-black ${
                  isActive ? 'bg-slate-900 text-amber-400' : 'bg-white/30 text-white'
                }`}>
                  {slide.stepNumber}
                </span>
                <span className="inline">{slide.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
