import { SITE, LEGACY_NAMES, ogImageUrl, Locale, localeHomeUrls } from '@/lib/seo';

export default function HomeStructuredData({ locale, messages }: { locale: string; messages: any }) {
  const selfUrl = localeHomeUrls[locale as Locale];

  // —— 结构化数据：TouristAttraction（实体锚定，含 @id / image / geo）——
  // 注意：4.6 / 28,735 为 Google Maps 同步数据，并非本站自产评价，
  // 按 Google 结构化数据政策不写入 aggregateRating，仅在页面展示中标注来源。
  const attractionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': `${SITE.baseUrl}/#attraction`,
    name: SITE.fullName,
    alternateName: [
      SITE.shortName,
      SITE.ukName,
      LEGACY_NAMES.en,
      LEGACY_NAMES.uk,
      LEGACY_NAMES.ru,
      `${SITE.city} ${SITE.fullName}`,
    ],
    description: messages?.meta?.description || SITE.description,
    url: selfUrl,
    image: [ogImageUrl],
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address,
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      postalCode: SITE.postalCode,
      addressCountry: SITE.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.lat,
      longitude: SITE.lng,
    },
    hasMap: SITE.mapsShareUrl,
    sameAs: [
      SITE.mapsShareUrl,
      SITE.wikipediaUrl,
    ],
  };

  // —— 结构化数据：FAQPage（与页面 FAQ 板块一一对应）——
  const faqItems: Array<{ q?: string; a?: string }> =
    Array.isArray(messages?.faq?.items) ? messages.faq.items : [];
  const faqJsonLd =
    faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.a,
            },
          })),
        }
      : null;

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(attractionJsonLd) }} />
    {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
  </>;
}
