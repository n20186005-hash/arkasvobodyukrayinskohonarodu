import { useTranslations, useMessages } from 'next-intl';

export default function AudienceSection() {
  const t = useTranslations('audiences');
  const messages = useMessages() as any;
  const items: Array<{ type: string; desc: string; duration: string; best: string; tips: string[] }> =
    messages?.audiences?.items || [];

  return (
    <section id="audiences" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>{t('lead')}</p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-6 flex flex-col"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <h3
                  className="font-display text-lg font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.type}
                </h3>
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
                {item.desc}
              </p>

              <dl className="text-xs space-y-1.5 mb-5">
                <div>
                  <dt className="font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {item.duration}
                  </dt>
                </div>
                <div>
                  <dt className="font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {item.best}
                  </dt>
                </div>
              </dl>

              <ul className="space-y-2.5 mt-auto">
                {item.tips.map((tip, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                      style={{ background: 'var(--accent)' }}
                    />
                    <span className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {messages?.audiences?.note && (
          <p className="mt-6 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            {messages.audiences.note}
          </p>
        )}
      </div>
    </section>
  );
}
