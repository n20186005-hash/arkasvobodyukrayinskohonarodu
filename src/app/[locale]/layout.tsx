import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { SITE, LEGACY_NAMES, ogImageUrl, ogImageAlt, Locale, localeHomeUrls } from '@/lib/seo';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;

  const selfUrl = localeHomeUrls[locale as Locale];

  const localeMap: Record<string, string> = {
    zh: 'zh-CN',
    en: 'en-US',
    ru: 'ru-RU',
    uk: 'uk-UA',
  };

  const title = messages.meta.title;
  const description = messages.meta.description;

  return {
    metadataBase: new URL(SITE.baseUrl),
    title,
    description,
    alternates: {
      canonical: selfUrl,
      languages: {
        zh: localeHomeUrls.zh,
        en: localeHomeUrls.en,
        ru: localeHomeUrls.ru,
        uk: localeHomeUrls.uk,
        'x-default': localeHomeUrls.uk,
      },
    },
    openGraph: {
      title,
      description,
      url: selfUrl,
      siteName: SITE.fullName,
      locale: localeMap[locale] || 'zh_CN',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1600,
          height: 1201,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/manifest.webmanifest',
    applicationName: SITE.fullName,
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: SITE.shortName,
    },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = (await getMessages()) as any;

  const langMap: Record<string, string> = {
    zh: 'zh-CN',
    en: 'en-US',
    ru: 'ru-RU',
    uk: 'uk-UA',
  };

  const selfUrl = localeHomeUrls[locale as Locale];

  // —— 结构化数据：TouristAttraction（实体锚定，含 @id / image / geo）——
  const reviewCountNumeric = Number(String(SITE.reviewCount).replace(/[^0-9]/g, ''));
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
    isAccessibleForFree: true,
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
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: Number(SITE.rating),
      reviewCount: reviewCountNumeric,
      bestRating: 5,
    },
    sameAs: [
      SITE.mapsShareUrl,
      SITE.officialTourismUrl,
      SITE.kyivCityUrl,
      SITE.kyivGuideUrl,
      SITE.wikipediaUrl,
    ],
  };

  // —— 结构化数据：Organization（站点实体，供 WebSite.publisher / WebPage 引用）——
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.baseUrl}/#organization`,
    name: SITE.fullName,
    alternateName: SITE.shortName,
    url: SITE.baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE.baseUrl}/icons/icon-512.png`,
    },
    sameAs: [SITE.mapsShareUrl, SITE.officialTourismUrl, SITE.kyivCityUrl],
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

  return (
    <html lang={langMap[locale] || 'zh-CN'} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />

        {/* PWA */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0057B7" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={SITE.shortName} />

        {/* GA4 (G-HXM22WWPKP) - 同意门控：读取 cookiePrefs.analytics，同意后按需加载 */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                function loadGtag() {
                  if (window.__gtagLoaded) return;
                  window.__gtagLoaded = true;
                  var s = document.createElement('script');
                  s.async = true;
                  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-HXM22WWPKP';
                  document.head.appendChild(s);
                  window.dataLayer = window.dataLayer || [];
                  function gtag() { dataLayer.push(arguments); }
                  window.gtag = gtag;
                  gtag('js', new Date());
                  gtag('config', 'G-HXM22WWPKP', { anonymize_ip: true });
                }
                function checkConsent() {
                  try {
                    var prefs = JSON.parse(localStorage.getItem('cookiePrefs') || '{}');
                    if (prefs && prefs.analytics) loadGtag();
                  } catch (e) {}
                }
                checkConsent();
                window.addEventListener('consent-updated', checkConsent);
              })();
            `,
          }}
        />

        {/* 结构化数据 JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(attractionJsonLd) }}
        />
        {faqJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        )}
      </head>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>

        {/* PWA Service Worker 注册 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js').catch(function (error) {
                    console.error('Service worker registration failed:', error);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
