/**
 * 单景点 SEO 实体绑定配置变量表（站点唯一数据源）
 * 对应需求中的 {{DOMAIN_NAME}} / {{ATTRACTION_FULL_NAME}} 等变量。
 */

export const SITE = {
  domain: 'arkasvobodyukrayinskohonarodu.com',
  baseUrl: 'https://arkasvobodyukrayinskohonarodu.com',

  // 景点实体
  fullName: 'Arka Svobody Ukrayinsʹkoho Narodu',
  ukName: 'Арка Свободи українського народу',
  shortName: "People's Freedom Arch",
  description:
    'Comprehensive visitor guide to Arka Svobody Ukrayinsʹkoho Narodu in Kyiv, Ukraine. A huge rainbow-shaped arch with a riverfront deck built in 1982, now known as the People’s Freedom Arch.',

  // 地理归属
  city: 'Kyiv',
  region: 'Kyiv',
  country: 'Ukraine',
  countryCode: 'UA',
  postalCode: '02000',
  address: 'Parkova Doroha, Kyiv, Ukraine, 02000',
  plusCode: 'FG3H+QX Kyiv, Ukraine',
  lat: 50.4544624,
  lng: 30.5299656,

  // 地图
  mapsShareUrl: 'https://maps.app.goo.gl/CCAwyVXkAEdCV7ai9',
  mapsEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4346.2647282302305!2d30.529965600000004!3d50.4544624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce4ef9be01b7%3A0xcd7dcf2eba57eba2!2sArka%20Svobody%20Ukrayins%CA%B9koho%20Narodu!5e1!3m2!1sen!2s!4v1788741593631!5m2!1sen!2s',

  // 周边地标与官方外链
  nearbyLandmark1: 'Mariinskyi Palace',
  nearbyLandmark2: 'the Kyiv Funicular',
  officialTourismUrl: 'https://www.tourism.gov.ua/',
  kyivCityUrl: 'https://kyivcity.gov.ua/',
  kyivGuideUrl: 'https://guide.kyivcity.gov.ua/',
  wikipediaUrl: 'https://en.wikipedia.org/wiki/People%27s_Friendship_Arch',

  // Google 展示数据
  rating: '4.6',
  reviewCount: '28,740',
} as const;

export type SiteInfo = typeof SITE;

/** 首图（本地图库），供 og:image / JSON-LD image 使用 */
export const ogImageUrl = `${SITE.baseUrl}/gallery/arka-svobody-ukrayinskoho-narodu-1.jpg`;

export const ogImageAlt = `${SITE.fullName} - Main view in ${SITE.city}, ${SITE.country}`;

/** 站点支持的语言 */
export const LOCALES = ['zh', 'en', 'ru', 'uk'] as const;

export type Locale = (typeof LOCALES)[number];

/** 各语言首页 URL */
export const localeHomeUrls: Record<Locale, string> = {
  zh: `${SITE.baseUrl}/zh`,
  en: `${SITE.baseUrl}/en`,
  ru: `${SITE.baseUrl}/ru`,
  uk: `${SITE.baseUrl}/uk`,
};

/** 为任意本地路由（如 /privacy-policy）生成各语言 URL */
export function localeUrls(route: string): Record<Locale, string> {
  return {
    zh: `${SITE.baseUrl}/zh${route}`,
    en: `${SITE.baseUrl}/en${route}`,
    ru: `${SITE.baseUrl}/ru${route}`,
    uk: `${SITE.baseUrl}/uk${route}`,
  };
}

/** 生成 alternates（canonical + languages + x-default） */
export function alternatesFor(locale: Locale, route = '') {
  const urls = route ? localeUrls(route) : localeHomeUrls;
  const self = urls[locale];
  return {
    canonical: self,
    languages: {
      zh: urls.zh,
      en: urls.en,
      ru: urls.ru,
      uk: urls.uk,
      'x-default': urls.ru,
    } as Record<string, string>,
  };
}
