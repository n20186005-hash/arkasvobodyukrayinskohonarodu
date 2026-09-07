import { useTranslations, useMessages } from 'next-intl';

export default function SeasonsSection() {
  const t = useTranslations('seasons');
  const messages = useMessages() as any;
  const headers = (messages?.seasons?.headers || {}) as Record<string, string>;
  const rows: Array<{ season: string; weather: string; water: string; nature: string; visit: string }> =
    messages?.seasons?.rows || [];
  const cols = ['season', 'weather', 'water', 'nature', 'visit'] as const;

  return (
    <section id="seasons" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>{t('lead')}</p>
        <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>{t('basis')}</p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[880px] border-collapse text-left text-sm">
            <thead>
              <tr>
                {cols.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 font-display font-semibold whitespace-nowrap"
                    style={{
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      borderBottom: '2px solid var(--accent)',
                    }}
                  >
                    {headers[col]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {cols.map((col, j) => (
                    <td
                      key={col}
                      className="px-4 py-4 align-top leading-relaxed"
                      style={{
                        color: j === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontWeight: j === 0 ? 600 : 400,
                        background: i % 2 ? 'var(--bg-tertiary)' : 'transparent',
                        borderBottom: '1px solid var(--border-color)',
                      }}
                    >
                      {col === 'season' ? <strong>{row[col]}</strong> : row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {messages?.seasons?.note && (
          <p className="mt-6 text-xs" style={{ color: 'var(--text-muted)' }}>
            {messages.seasons.note}
          </p>
        )}
      </div>
    </section>
  );
}
