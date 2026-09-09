import { setRequestLocale, getMessages } from 'next-intl/server';
import { SITE, localeHomeUrls, Locale } from '@/lib/seo';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import BasicInfo from '@/components/BasicInfo';
import HoursSection from '@/components/HoursSection';
import TicketsSection from '@/components/TicketsSection';
import TransportSection from '@/components/TransportSection';
import ServicesSection from '@/components/ServicesSection';
import SeasonsSection from '@/components/SeasonsSection';
import WeatherSection from '@/components/WeatherSection';
import AudienceSection from '@/components/AudienceSection';
import RouteSection from '@/components/RouteSection';
import ResponsibilitySection from '@/components/ResponsibilitySection';
import HistorySection from '@/components/HistorySection';
import TimelineSection from '@/components/TimelineSection';
import MythSection from '@/components/MythSection';
import NearbySection from '@/components/NearbySection';
import PhotoSpotsSection from '@/components/PhotoSpotsSection';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import MapEmbed from '@/components/MapEmbed';
import FaqSection from '@/components/FaqSection';
import PrintSection from '@/components/PrintSection';
import SourcesSection from '@/components/SourcesSection';
import Footer from '@/components/Footer';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await getMessages()) as any;
  const selfUrl = localeHomeUrls[locale as Locale];
  const metaDescription = messages?.meta?.description || SITE.description;

  // 面包屑：站点首页 → 当前位置（本页）
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: messages?.breadcrumb?.home || SITE.fullName,
        item: selfUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: messages?.breadcrumb?.page || SITE.fullName,
        item: selfUrl,
      },
    ],
  };

  // 网站实体：将四语首页与统一英文实体名绑定（publisher 指向顶层 Organization @id）
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.baseUrl}/#website`,
    url: selfUrl,
    name: SITE.fullName,
    alternateName: [SITE.shortName, SITE.ukName, `${SITE.city} ${SITE.fullName}`],
    description: metaDescription,
    inLanguage: ['uk', 'en', 'ru', 'zh'],
    publisher: {
      '@id': `${SITE.baseUrl}/#organization`,
    },
  };

  // 当前语言首页的网页级标注（dateModified 固定值，避免构建漂移）
  const langMap: Record<string, string> = {
    zh: 'zh-CN',
    en: 'en-US',
    ru: 'ru-RU',
    uk: 'uk-UA',
  };
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${selfUrl}#webpage`,
    url: selfUrl,
    name: messages?.meta?.title || SITE.fullName,
    description: metaDescription,
    dateModified: '2026-09-09',
    inLanguage: langMap[locale] || 'ru-RU',
    isPartOf: {
      '@id': `${SITE.baseUrl}/#website`,
    },
    about: {
      '@id': `${SITE.baseUrl}/#attraction`,
    },
  };

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Intro />
        <BasicInfo />
        <HoursSection />
        <WeatherSection />
        <SeasonsSection />
        <TicketsSection />
        <TransportSection />
        <ServicesSection />
        <AudienceSection />
        <RouteSection />
        <HistorySection />
        <TimelineSection />
        <MythSection />
        <NearbySection />
        <PhotoSpotsSection />
        <Gallery />
        <Reviews />
        <MapEmbed />
        <FaqSection />
        <ResponsibilitySection />
        <PrintSection />
        <SourcesSection />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
    </>
  );
}
