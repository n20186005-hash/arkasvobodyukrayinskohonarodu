'use client';

import { useTranslations } from 'next-intl';

export default function PrintSection() {
  const t = useTranslations('print');

  return (
    <section
      id="print"
      className="section-padding"
      style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div
          className="rounded-2xl p-6 sm:p-10"
          style={{ border: '1px solid var(--accent)', background: 'var(--bg-tertiary)' }}
        >
          <h2
            className="font-display text-2xl sm:text-3xl font-semibold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('title')}
          </h2>
          <p className="mb-6 text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('desc')}
          </p>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-transform hover:scale-[1.02]"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            {t('action')}
          </button>

          <div className="mt-8 pt-6" style={{ borderTop: '1px dashed var(--border-color)' }}>
            <p className="text-xs font-bold tracking-wide mb-1.5" style={{ color: 'var(--text-muted)' }}>
              {t('offlineTitle')}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t('offlineText')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
