import { useTranslations, useMessages } from 'next-intl';

function Quote({ text }: { text: string }) {
  return (
    <blockquote
      className="relative rounded-r-xl px-6 py-5 pl-12"
      style={{
        background: 'var(--bg-tertiary)',
        borderLeft: '3px solid var(--accent)',
        color: 'var(--text-secondary)',
      }}
    >
      <span
        className="absolute left-4 top-2 font-display text-5xl leading-none"
        style={{ color: 'var(--accent)', opacity: 0.35 }}
        aria-hidden="true"
      >
        “
      </span>
      <p className="font-display italic text-lg leading-relaxed">{text}</p>
    </blockquote>
  );
}

function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full rounded-xl object-cover"
        style={{ maxHeight: '360px' }}
      />
      <figcaption className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        {caption}
      </figcaption>
    </figure>
  );
}

export default function HistorySection() {
  const t = useTranslations('history');
  const messages = useMessages() as any;
  const paragraphs: string[] = messages?.history?.paragraphs || [];
  const facts: string[] = messages?.history?.facts || [];
  const captions: string[] = messages?.gallery?.captions || [];
  const galleryPrefix = '/gallery/arka-svobody-ukrayinskoho-narodu-';

  return (
    <section id="history" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="space-y-8">
          {paragraphs[0] && (
            <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
              {paragraphs[0]}
            </p>
          )}

          {messages?.history?.quote1 && <Quote text={messages.history.quote1} />}

          {messages?.history?.fig1Caption && (
            <Figure
              src={`${galleryPrefix}2.jpg`}
              alt={captions[1] || t('title')}
              caption={messages.history.fig1Caption}
            />
          )}

          {paragraphs[1] && (
            <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
              {paragraphs[1]}
            </p>
          )}

          {messages?.history?.quote2 && <Quote text={messages.history.quote2} />}

          {paragraphs[2] && (
            <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
              {paragraphs[2]}
            </p>
          )}

          {messages?.history?.fig2Caption && (
            <Figure
              src={`${galleryPrefix}6.jpg`}
              alt={captions[5] || t('title')}
              caption={messages.history.fig2Caption}
            />
          )}

          {facts.length > 0 && (
            <div className="rounded-xl p-6 sm:p-8" style={{ background: 'var(--bg-tertiary)' }}>
              <h3
                className="font-display text-xl font-semibold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                {t('factsTitle')}
              </h3>
              <ul className="grid gap-3 sm:grid-cols-1">
                {facts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                      style={{ background: 'var(--accent)' }}
                    />
                    <span style={{ color: 'var(--text-secondary)' }}>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {messages?.history?.photoNote && (
            <p
              className="rounded-lg px-5 py-4 text-xs leading-relaxed"
              style={{ border: '1px dashed var(--border-color)', color: 'var(--text-muted)' }}
            >
              {messages.history.photoNote}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
