import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPlace, places, type PlaceLocale } from '@/lib/places';
import { pageMetadata, ui } from '@/lib/place-ui';

export function generateStaticParams() { return places.map(p=>({slug:p.slug})); }
type Params = Promise<{locale:PlaceLocale; slug:string}>;
export async function generateMetadata({params}:{params:Params}) {
 const {locale,slug}=await params; const p=getPlace(slug); if(!p) return {}; const t=p.text[locale];
 return pageMetadata(locale,`/places/${slug}`,t.name,t.description,p.photo);
}
export default async function PlacePage({params}:{params:Params}) {
 const {locale,slug}=await params; const p=getPlace(slug); if(!p) notFound(); setRequestLocale(locale);
 const t=p.text[locale], labels=ui[locale];
 const faq={'@context':'https://schema.org','@type':'FAQPage',mainEntity:t.faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))};
 return <><Header/><main><div className="relative min-h-[420px] flex items-end px-6 pb-14 pt-28 text-white" style={{background:'#24313e'}}><img src={p.photo} alt={t.name} className="absolute inset-0 w-full h-full object-cover opacity-50" style={{objectPosition:p.slug === 'volodymyrska-hill' ? 'center 40%' : p.slug === 'kyiv-funicular' ? 'center 53%' : p.slug === 'sophia-square' ? 'center 30%' : ['golden-gate','volodymyr-monument'].includes(p.slug) ? 'center 0%' : 'center 72%'}}/><div className="relative max-w-5xl w-full mx-auto"><p className="mb-3"><a href={`/${locale}`}>{labels.home}</a> › <a href={`/${locale}/places`}>{labels.index}</a></p><h1 className="font-display text-4xl sm:text-5xl font-semibold [overflow-wrap:anywhere]">{t.name}</h1><p className="mt-4 max-w-2xl">{t.description}</p></div></div>
 <article className="section-padding"><div className="max-w-4xl mx-auto space-y-10"><section><h2 className="font-display text-2xl font-semibold mb-4">{labels.history}</h2><p className="leading-relaxed">{t.history}</p></section><section><h2 className="font-display text-2xl font-semibold mb-4">{labels.visit}</h2><p className="leading-relaxed">{t.visit}</p><a className="inline-block mt-4 underline" href={p.map} target="_blank" rel="noopener noreferrer">{labels.map}</a></section><section><h2 className="font-display text-2xl font-semibold mb-4">{labels.faq}</h2><div className="space-y-4">{t.faq.map(([q,a])=><div key={q}><h3 className="font-semibold">{q}</h3><p>{a}</p></div>)}</div></section><section className="text-sm"><p><a className="underline" href={p.source} target="_blank" rel="noopener noreferrer">{labels.sources}: {p.source.includes('unesco.org') ? 'UNESCO' : p.source.includes('knuba.edu.ua') ? 'Kyiv National University of Construction and Architecture' : 'Kyiv city guide'}</a>{p.extraSource && <> · <a className="underline" href={p.extraSource} target="_blank" rel="noopener noreferrer">{p.extraSource.includes('/trips/') ? 'Kyiv city route' : 'Kyiv city guide'}</a></>} · {labels.checked}: 2026-11-27</p><p className="mt-2">{labels.photo}: <a className="underline" href={p.photoSource} target="_blank" rel="noopener noreferrer">{p.photographer}</a> · {labels.edited} · <a className="underline" href={p.photoSource.includes("unsplash.com") ? "https://unsplash.com/license" : "https://www.pexels.com/license/"}>{p.photoSource.includes("unsplash.com") ? "Unsplash License" : "Pexels License"}</a></p></section></div></article></main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faq).replace(/</g,'\\u003c')}}/></>;
}
