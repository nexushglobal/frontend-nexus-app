'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useActiveBanners } from '../../hooks/useBanners';

interface ActiveBannersCarouselProps {
  autoplayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
}

export function ActiveBannersCarousel({
  autoplayInterval = 5000,
  showControls = true,
  showIndicators = true,
  className = '',
}: ActiveBannersCarouselProps) {
  const { data: banners, isLoading, isError } = useActiveBanners();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: autoplayInterval }),
  ]);

  const onSelect = useCallback(() => {
    if (!emblaMainApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on('select', onSelect);
    emblaMainApi.on('reInit', onSelect);
  }, [emblaMainApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollPrev();
  }, [emblaMainApi]);

  const scrollNext = useCallback(() => {
    if (emblaMainApi) emblaMainApi.scrollNext();
  }, [emblaMainApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaMainApi) emblaMainApi.scrollTo(index);
    },
    [emblaMainApi],
  );

  // Loading state
  if (isLoading) {
    return (
      <Card className={`relative overflow-hidden bg-muted ${className}`}>
        <div className="aspect-[1920/400] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            Cargando banners...
          </div>
        </div>
      </Card>
    );
  }

  // Error state
  if (isError) {
    return (
      <Card className={`relative overflow-hidden bg-muted ${className}`}>
        <div className="aspect-[1920/400] flex items-center justify-center">
          <div className="text-muted-foreground text-sm">
            Error al cargar los banners
          </div>
        </div>
      </Card>
    );
  }

  // No banners state
  if (!banners || banners.length === 0) {
    return (
      <Card className={`relative overflow-hidden bg-muted ${className}`}>
        <div className="aspect-[1920/400] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <h3 className="font-medium">No hay banners disponibles</h3>
            <p className="text-sm mt-1">
              Los banners aparecerán aquí cuando estén activos
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden" ref={emblaMainRef}>
        <div className="flex">
          {banners.map((banner, index) => (
            <div key={banner.id} className="flex-[0_0_100%]">
              <Card className="relative overflow-hidden">
                <div className="relative aspect-[1920/400] bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                  {banner.link ? (
                    banner.linkType === 'EXTERNAL' ? (
                      <a
                        href={banner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                      >
                        <BannerImage
                          banner={banner}
                          isActive={index === selectedIndex}
                        />
                      </a>
                    ) : (
                      <Link href={banner.link} className="block w-full h-full">
                        <BannerImage
                          banner={banner}
                          isActive={index === selectedIndex}
                        />
                      </Link>
                    )
                  ) : (
                    <BannerImage
                      banner={banner}
                      isActive={index === selectedIndex}
                    />
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation controls */}
      {showControls && banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm z-10 transition-all duration-200"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm z-10 transition-all duration-200"
            onClick={scrollNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? 'bg-white scale-110 shadow-lg'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Ir al banner ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Banner counter */}
      {banners.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/40 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm z-10">
          {selectedIndex + 1} / {banners.length}
        </div>
      )}
    </div>
  );
}

// Separate component for banner image to optimize rendering
function BannerImage({ banner, isActive }: { banner: any; isActive: boolean }) {
  return (
    <>
      <Image
        src={banner.imageUrl}
        alt={banner.title || 'Banner'}
        fill
        sizes="(max-width: 768px) 100vw, 1920px"
        className="object-cover"
        priority={isActive}
        quality={90}
      />

      {/* Overlay for text readability */}
      {(banner.title || banner.description) && (
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      )}

      {/* Content overlay */}
      {(banner.title || banner.description) && (
        <div className="absolute inset-0 flex items-center">
          <div className="p-8 md:p-12 text-white max-w-3xl">
            {banner.title && (
              <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-2xl leading-tight">
                {banner.title}
              </h2>
            )}
            {banner.description && (
              <p className="text-lg md:text-xl opacity-95 drop-shadow-lg leading-relaxed">
                {banner.description}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
