'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
  id: string;
  src: string;
  alt: string;
  title: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'onion-disposal',
    src: '/images/banners/Onion_Disposal_banner.jpg',
    alt: 'Department of Consumer Affairs: Onion Disposal and Price Stabilization Initiative',
    title: 'Onion Disposal and Market Intervention Initiative'
  },
  {
    id: 'nch-mobile-app',
    src: '/images/banners/NITH_Mobile_App_banner.png',
    alt: 'National Consumer Helpline (NCH) Mobile App: Jago Grahak Jago Consumer Redressal Platform',
    title: 'National Consumer Helpline Mobile App'
  },
  {
    id: 'lm-time',
    src: '/images/banners/LMTime_banner.jpg',
    alt: 'Legal Metrology Timely Compliance and Ease of Doing Business Mandates',
    title: 'Legal Metrology Timely Statutory Verification'
  },
  {
    id: 'lm-phd',
    src: '/images/banners/LM-PHD_banner.png',
    alt: 'National Stakeholders Conference on Legal Metrology and Consumer Empowerment',
    title: 'Legal Metrology Stakeholder Conference'
  },
  {
    id: 'lm-sep11',
    src: '/images/banners/LM_03Sep_11_banner.jpg',
    alt: 'Conference on Legal Metrology Reforms and Jan Vishwas Act Provisions',
    title: 'Legal Metrology Reforms and Jan Vishwas Act'
  },
  {
    id: 'hindi-pakhwada',
    src: '/images/banners/Hindi_banner.jpg',
    alt: 'Rajbhasha Hindi Pakhwada: Ministry of Consumer Affairs, Food and Public Distribution',
    title: 'Hindi Pakhwada Consumer Affairs Celebration'
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

        {/* Floating Indicator Dots */}
        <div className="absolute bottom-2.5 sm:bottom-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/40 backdrop-blur-xs border border-white/20">
          {BANNER_SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                className={`transition-all rounded-full h-2 sm:h-2.5 ${
                  isActive
                    ? 'w-6 sm:w-7 bg-amber-400 shadow-xs'
                    : 'w-2 sm:w-2.5 bg-white/70 hover:bg-white'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
