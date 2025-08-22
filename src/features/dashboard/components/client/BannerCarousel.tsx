'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useActiveBanners } from '../../hooks/useBanners';

interface BannerCarouselProps {
  autoplayInterval?: number; // milliseconds
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
}

export function BannerCarousel({
  autoplayInterval = 5000,
  showControls = true,
  showIndicators = true,
  className = '',
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplayActive, setIsAutoplayActive] = useState(true);

  const { data, isLoading, error } = useActiveBanners();
  const banners = data?.items || [];

  // Reset to first banner when banners change
  useEffect(() => {
    setCurrentIndex(0);
  }, [banners]);

  // Autoplay functionality
  useEffect(() => {
    if (!isAutoplayActive || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [banners.length, autoplayInterval, isAutoplayActive]);

  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToBanner = (index: number) => {
    setCurrentIndex(index);
  };

  const handleMouseEnter = () => setIsAutoplayActive(false);
  const handleMouseLeave = () => setIsAutoplayActive(true);

  if (isLoading) {
    return <BannerCarouselSkeleton className={className} />;
  }

  if (error || banners.length === 0) {
    return null; // Don't show anything if there are no banners
  }

  const currentBanner = banners[currentIndex];

  const BannerContent = () => (
    <div className="relative w-full h-full">
      <Image
        src={currentBanner.imageUrl}
        alt={currentBanner.title || 'Banner'}
        fill
        className="object-cover"
        priority
      />

      {/* Overlay content if banner has text */}
      {(currentBanner.title || currentBanner.description) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
          <div className="absolute bottom-6 left-6 text-white">
            {currentBanner.title && (
              <h3 className="text-2xl font-bold mb-2">{currentBanner.title}</h3>
            )}
            {currentBanner.description && (
              <p className="text-sm opacity-90">{currentBanner.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      {showControls && banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
            onClick={prevBanner}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
            onClick={nextBanner}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => goToBanner(index)}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Card
      className={`relative overflow-hidden h-64 md:h-80 lg:h-96 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {currentBanner.link ? (
        currentBanner.linkType === 'EXTERNAL' ? (
          <a
            href={currentBanner.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
          >
            <BannerContent />
          </a>
        ) : (
          <Link href={currentBanner.link} className="block w-full h-full">
            <BannerContent />
          </Link>
        )
      ) : (
        <BannerContent />
      )}
    </Card>
  );
}

function BannerCarouselSkeleton({ className }: { className?: string }) {
  return (
    <Card
      className={`relative overflow-hidden h-64 md:h-80 lg:h-96 ${className}`}
    >
      <Skeleton className="w-full h-full" />
    </Card>
  );
}
