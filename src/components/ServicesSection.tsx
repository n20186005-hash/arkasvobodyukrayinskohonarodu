import { useTranslations, useMessages } from 'next-intl';

export default function ServicesSection() {
  const t = useTranslations('services');
  const messages = useMessages() as any;
  const items: Array<{ icon?: string; name: string; desc: string }> =
    messages?.services?.items || [];
  const tips: string[] = messages?.services?.tips || [];

  return (
    <section id="services" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-xl p-5"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <span
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: 'var(--accent)', color: '#fff' }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3
                  className="font-display text-base font-semibold mb-1.5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.name}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {tips.length > 0 && (
          <div
            className="mt-8 rounded-xl p-6"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent)' }}
          >
            <h3
              className="font-display text-lg font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('tipsTitle')}
            </h3>
            <ul className="space-y-2.5">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
