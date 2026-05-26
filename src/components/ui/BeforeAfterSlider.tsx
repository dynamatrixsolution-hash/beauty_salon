'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  height?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  height = 'h-[350px] sm:h-[450px]',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${height} rounded-2xl overflow-hidden shadow-lg select-none cursor-ew-resize`}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt="After transformation"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute right-4 bottom-4 bg-brand-charcoal/80 text-brand-beige text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full z-10 backdrop-blur-sm">
        {afterLabel}
      </div>

      {/* Before Image (Foreground overlay) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Before transformation"
          className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none"
          style={{ width: containerRef.current?.offsetWidth }}
        />
        <div className="absolute left-4 bottom-4 bg-brand-rosegold-dark/95 text-white text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full z-10 backdrop-blur-sm">
          {beforeLabel}
        </div>
      </div>

      {/* Slider Line Divider */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-md"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Gold circular drag icon */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-brand-beige shadow-lg border border-brand-rosegold text-brand-rosegold-dark flex items-center justify-center cursor-ew-resize z-30 transition-transform active:scale-95">
          <Sparkles className="w-4 h-4 text-brand-gold animate-spin-slow" />
        </div>
      </div>
    </div>
  );
}
