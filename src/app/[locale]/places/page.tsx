import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { places, type PlaceLocale } from '@/lib/places';
import { pageMetadata, ui } from '@/lib/place-ui';

export async function generateMetadata({params}:{params:Promise<{locale:PlaceLocale}>}) {
 const {locale}=await params; const title=ui[locale].index; return pageMetadata(locale,'/places',title,`${title} · Kyiv`);
}
export default async function PlacesIndex({params}:{params:Promise<{locale:PlaceLocale}>}) {
 const {locale}=await params; setRequestLocale(locale); const labels=ui[locale];
 return <><Header/><main><div className="bg-slate-800 pt-28 pb-16 px-6 text-white"><div className="max-w-5xl mx-auto"><h1 className="font-display text-4xl font-semibold">{labels.index}</h1></div></div>
 <section className="section-padding"><div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-6">{places.map(p=><Link key={p.slug} href={`/${locale}/places/${p.slug}`} className="rounded-xl overflow-hidden" style={{background:'var(--bg-tertiary)',border:'1px solid var(--border-color)'}}><img src={p.photo} alt={p.text[locale].name} className="w-full h-56 object-cover"/><div className="p-6"><h2 className="font-display text-xl font-semibold">{p.text[locale].name}</h2><p className="mt-2">{p.text[locale].description}</p></div></Link>)}</div></section></main><Footer/></>;
}
