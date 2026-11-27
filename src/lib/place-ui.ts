import { SITE } from './seo';
import { placeLocales, type PlaceLocale } from './places';

export const ui: Record<PlaceLocale, {index: string; home: string; history: string; visit: string; faq: string; map: string; sources: string; photo: string; checked: string; edited:string}> = {
 uk:{index:'Місця поруч',home:'Арка Свободи',history:'Історія та архітектура',visit:'Планування відвідування',faq:'Поширені запитання',map:'Знайти на Google Maps',sources:'Джерело',photo:'Фото',checked:'Джерело перевірено',edited:'зменшено та перекодовано'},
 ru:{index:'Места рядом',home:'Арка Свободы',history:'История и архитектура',visit:'Планирование посещения',faq:'Частые вопросы',map:'Найти на Google Maps',sources:'Источник',photo:'Фото',checked:'Источник проверен',edited:'уменьшено и перекодировано'},
 en:{index:'Nearby places',home:'Arch of Freedom',history:'History and architecture',visit:'Planning a visit',faq:'Frequently asked questions',map:'Find on Google Maps',sources:'Source',photo:'Photo',checked:'Source checked',edited:'resized and re-encoded'},
 zh:{index:'周边景点',home:'乌克兰人民自由拱门',history:'历史与建筑',visit:'游览准备',faq:'常见问题',map:'在 Google Maps 查找',sources:'资料来源',photo:'摄影',checked:'资料核查',edited:'已缩小并重新编码'},
};
export function pageMetadata(locale: PlaceLocale, path: string, title: string, description: string, photo?: string) {
 const url = `${SITE.baseUrl}/${locale}${path}`;
 const image = photo ? `${SITE.baseUrl}${photo}` : undefined;
 return { title, description, alternates: {canonical: url, languages: Object.fromEntries([...placeLocales.map(l=>[l,`${SITE.baseUrl}/${l}${path}`]),['x-default',`${SITE.baseUrl}/uk${path}`]])}, openGraph: {title, description, url, type:'website' as const, images: image ? [{url:image}] : []}, twitter: {card:'summary_large_image' as const, title, description, images:image ? [image] : []} };
}
