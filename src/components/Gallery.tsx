'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';

const photoFiles = Array.from(
  { length: 16 },
  (_, i) => `arka-svobody-ukrayinskoho-narodu-${i + 1}.jpg`
);

export default function Gallery() {
  const t = useTranslations('gallery');
  const captions = t.raw('captions') as string[];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const photos = photoFiles.map((file, i) => ({
    file,
    src: `/gallery/${file}`,
    alt: captions?.[i] || `Arka Svobody Ukrayinsʹkoho Narodu ${i + 1}`,
  }));

  const closeLightbox = useCallback(() => setIsLightboxOpen(false), []);
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);
  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') goToPrevious();
      if (event.key === 'ArrowRight') goToNext();
    };
    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isLightboxOpen, closeLightbox, goToPrevious, goToNext]);

  const current = photos[currentIndex];

  return (
    <>
      <section id="gallery" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('title')}
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
          <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {photos.map((photo, i) => (
              <div
                key={i}
                className={`gallery-item relative group cursor-pointer ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                onClick={() => openLightbox(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(i);
                  }
                }}
                aria-label={photo.alt}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover rounded-lg"
                  style={{ minHeight: i === 0 ? '400px' : '180px' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg flex items-end">
                  <p className="text-white text-sm p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <a
              href="https://maps.app.goo.gl/CCAwyVXkAEdCV7ai9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              {t('viewAll')}
            </a>
            {t('usage') && (
              <p className="text-xs leading-relaxed max-w-3xl" style={{ color: 'var(--text-muted)' }}>
                {t('usage')}
              </p>
            )}
          </div>
        </div>
      </section>

      {isLightboxOpen && current && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close lightbox"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            aria-label="Previous photo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <img
            src={current.src}
            alt={current.alt}
            className="max-w-[92vw] max-h-[82vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            aria-label="Next photo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div
            className="absolute inset-x-0 bottom-0 px-6 pb-5 pt-10"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-white text-sm sm:text-base font-medium truncate">
                  {current.alt}
                </p>
                <p className="mt-0.5 text-white/60 text-xs">
                  {currentIndex + 1} / {photos.length} · {t('credit')}
                </p>
              </div>
              <a
                href={current.src}
                download={current.file}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white/15 hover:bg-white/25 text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {t('download')}
              </a>
            </div>
            <p className="mt-3 text-white/50 text-[11px]">{t('exif')}</p>
          </div>
        </div>
      )}
    </>
  );
}
