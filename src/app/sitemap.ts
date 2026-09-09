import { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.baseUrl;
  // 默认语言 uk 置首，其余 ru / zh / en
  const locales = ['uk', 'ru', 'zh', 'en'];
  const routes = ['', '/privacy-policy', '/terms-of-service', '/cookie-settings'];
  // 固定构建日期，避免每次构建漂移
  const lastModified = new Date('2026-09-09');

  const sitemap: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      const url = `${baseUrl}/${locale}${route}`;
      // 每个 URL 标注对应语言的 hreflang 备选与 x-default
      const alternates = {
        languages: {
          zh: `${baseUrl}/zh${route}`,
          en: `${baseUrl}/en${route}`,
          ru: `${baseUrl}/ru${route}`,
          uk: `${baseUrl}/uk${route}`,
          'x-default': `${baseUrl}/uk${route}`,
        },
      };
      sitemap.push({
        url,
        lastModified,
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.5,
        alternates,
      });
    }
  }

  return sitemap;
}
