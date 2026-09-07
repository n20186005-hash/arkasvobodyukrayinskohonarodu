import { useTranslations, useMessages } from 'next-intl';

export default function TimelineSection() {
  const t = useTranslations('timeline');
  const messages = useMessages() as any;
  const items: Array<{ year: string; title: string; text: string }> =
    messages?.timeline?.items || [];

  return (
    <section id="timeline" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>{t('lead')}</p>
        <div className="w-12 h-0.5 mb-12" style={{ background: 'var(--accent)' }} />

        <div className="relative">
          <div
            className="absolute left-[5px] top-2 bottom-8 w-0.5"
            style={{ background: 'var(--border-color)' }}
            aria-hidden="true"
          />
          <div className="space-y-10">
            {items.map((item, i) => (
              <div key={i} className="relative pl-10">
                <span
                  className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--accent)' }}
                  aria-hidden="true"
                />
                <span
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: 'var(--accent)' }}
                >
                  {item.year}
                </span>
                <h3
                  className="font-display text-lg sm:text-xl font-semibold mt-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-2 text-sm sm:text-base leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {messages?.timeline?.sourceNote && (
          <p className="mt-10 text-xs" style={{ color: 'var(--text-muted)' }}>
            {messages.timeline.sourceNote}
          </p>
        )}

        {messages?.timeline?.oldPhotoTitle && messages?.timeline?.oldPhotoText && (
          <div
            className="mt-8 rounded-xl p-6"
            style={{ border: '1px dashed var(--border-color)', background: 'var(--bg-tertiary)' }}
          >
            <h3
              className="font-display text-base font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {messages.timeline.oldPhotoTitle}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {messages.timeline.oldPhotoText}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
