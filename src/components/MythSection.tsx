import { useTranslations, useMessages } from 'next-intl';

export default function MythSection() {
  const t = useTranslations('myths');
  const messages = useMessages() as any;
  const items: Array<{ claim: string; fact: string }> = messages?.myths?.items || [];

  return (
    <section id="myths" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>{t('lead')}</p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid var(--border-color)' }}
            >
              <div className="p-5 sm:p-6" style={{ background: 'var(--bg-tertiary)' }}>
                <span
                  className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3"
                  style={{ background: 'rgba(185, 28, 28, 0.12)', color: '#c2413c' }}
                >
                  {t('falseLabel')}
                </span>
                <p
                  className="font-semibold leading-relaxed text-sm sm:text-base"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.claim}
                </p>
              </div>
              <div
                className="p-5 sm:p-6"
                style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
              >
                <span
                  className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  {t('trueLabel')}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {item.fact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
