import { useTranslations, useMessages } from 'next-intl';

export default function RouteSection() {
  const t = useTranslations('routes');
  const messages = useMessages() as any;
  const items: Array<{ label: string; time: string; points: string[]; note: string }> =
    messages?.routes?.items || [];

  return (
    <section id="routes" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>{t('lead')}</p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-6 sm:p-8 flex flex-col"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
                <h3
                  className="font-display text-xl font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.label}
                </h3>
                <span
                  className="text-xs px-3 py-1 rounded-full whitespace-nowrap"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  {item.time}
                </span>
              </div>

              <ol className="space-y-3 mb-6">
                {item.points.map((point, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--accent)' }}
                    >
                      {j + 1}
                    </span>
                    <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {point}
                    </span>
                  </li>
                ))}
              </ol>

              <p
                className="text-sm leading-relaxed mt-auto rounded-lg px-4 py-3"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
              >
                {item.note}
              </p>
            </div>
          ))}
        </div>

        {messages?.routes?.common && (
          <div
            className="mt-8 rounded-xl p-6"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--accent)' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {messages.routes.common}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
