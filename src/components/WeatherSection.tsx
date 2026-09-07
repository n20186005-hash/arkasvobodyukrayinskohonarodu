'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState, useCallback } from 'react';

// 基辅市中心坐标（景点所在范围）的通用天气接口。数据不带任何第三方标识。
// 部署在 Cloudflare Workers 时，浏览器统一走同源 /api/weather（服务端缓存 + 30 分钟自动刷新）；
// 该直连地址仅作为纯静态托管（如 GitHub Pages）下的降级通道。
const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=50.4544624&longitude=30.5299656&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset&timezone=Europe%2FKyiv&forecast_days=7&wind_speed_unit=kmh';

const CACHE_KEY = 'kyiv-weather-cache-v1';
const CACHE_TTL = 30 * 60 * 1000; // 30 分钟内优先使用本地缓存，避免重复请求

type Kind =
  | 'clear'
  | 'partly'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'showers'
  | 'thunder';

function kindOf(code: number): Kind {
  if (code <= 1) return 'clear';
  if (code === 2) return 'partly';
  if (code === 3) return 'overcast';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if (code >= 61 && code <= 67) return 'rain';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
  if (code >= 80 && code <= 82) return 'showers';
  return 'thunder';
}

interface Day {
  date: string;
  code: number;
  max: number;
  min: number;
  precip: number;
  prob: number;
  wind: number;
  sunrise: string;
  sunset: string;
}

interface WeatherData {
  temperature: number;
  feels: number;
  humidity: number;
  precipitation: number;
  wind: number;
  code: number;
  time: string;
  days: Day[];
}

function parsePayload(raw: any): WeatherData {
  const d = raw.daily;
  const days: Day[] = d.time.map((date: string, i: number) => ({
    date,
    code: d.weather_code[i],
    max: d.temperature_2m_max[i],
    min: d.temperature_2m_min[i],
    precip: d.precipitation_sum[i],
    prob: d.precipitation_probability_max[i],
    wind: d.wind_speed_10m_max[i],
    sunrise: d.sunrise[i],
    sunset: d.sunset[i],
  }));
  return {
    temperature: raw.current.temperature_2m,
    feels: raw.current.apparent_temperature,
    humidity: raw.current.relative_humidity_2m,
    precipitation: raw.current.precipitation,
    wind: raw.current.wind_speed_10m,
    code: raw.current.weather_code,
    time: raw.current.time,
    days,
  };
}

function readCache(): WeatherData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts < CACHE_TTL) return data as WeatherData;
  } catch {
    /* 忽略缓存异常 */
  }
  return null;
}

function writeCache(data: WeatherData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* 忽略存储异常 */
  }
}

/** 服务端优先：同源 /api/weather（Cloudflare Worker 服务端缓存），失败时降级直连 Open-Meteo。 */
async function fetchData(): Promise<WeatherData> {
  try {
    const res = await fetch('/api/weather', { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    // 防御性校验：纯静态托管回落的 404 页面可能返回非 JSON。
    if (!json || !json.current || !json.daily) throw new Error('invalid payload');
    return parsePayload(json);
  } catch {
    const res = await fetch(WEATHER_URL);
    if (!res.ok) throw new Error(String(res.status));
    return parsePayload(await res.json());
  }
}

function formatClock(iso: string): string {
  if (!iso) return '';
  const part = iso.split('T')[1];
  return part ? part.slice(0, 5) : '';
}

export default function WeatherSection() {
  const t = useTranslations('weather');
  const locale = useLocale();
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const cached = readCache();
      if (cached && !cancelled) {
        setData(cached);
        setError(false);
      }
      try {
        const parsed = await fetchData();
        if (cancelled) return;
        setData(parsed);
        setError(false);
        writeCache(parsed);
      } catch {
        if (!cancelled && !cached) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [reload]);

  const retry = useCallback(() => setReload((r) => r + 1), []);

  const rawAdvices = t.raw('advices') as Record<string, string>;

  let adviceKeys: string[] = [];
  if (data && data.days[0]) {
    const today = data.days[0];
    const currentKind = kindOf(data.code);
    const heavyRain =
      today.prob >= 80 || today.precip >= 8 || currentKind === 'thunder';
    const anyRain =
      today.prob >= 50 || today.precip >= 1 || data.precipitation > 0.2;
    if (heavyRain) adviceKeys.push('raincoat');
    else if (anyRain) adviceKeys.push('umbrella');
    if (today.max <= 4 || today.min <= -3) adviceKeys.push('cold');
    if (today.max >= 26) adviceKeys.push('hot');
    if (today.wind >= 28) adviceKeys.push('windy');
    if (adviceKeys.length === 0) adviceKeys.push('nice');
  }

  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });

  function dayLabel(date: string, index: number) {
    if (index === 0) return t('today');
    const [y, m, day] = date.split('-').map(Number);
    const wd = weekdayFormatter.format(new Date(y, m - 1, day));
    return `${wd} ${day.toString().padStart(2, '0')}.${m.toString().padStart(2, '0')}`;
  }

  const states = t.raw('states') as Record<string, string>;
  const nowKind = data ? kindOf(data.code) : null;

  return (
    <section id="weather" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        {error && !data ? (
          <div
            className="rounded-xl p-8 text-center"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
          >
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>{t('unavailable')}</p>
            <button
              onClick={retry}
              className="px-5 py-2.5 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)' }}
            >
              {t('retry')}
            </button>
          </div>
        ) : !data ? (
          <div className="rounded-xl p-8 text-center" style={{ background: 'var(--bg-tertiary)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>{t('loading')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* 当前实况 */}
              <div
                className="rounded-xl p-6"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {t('now')}
                  </h3>
                  {loading && (
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('loading')}</span>
                  )}
                </div>

                <div className="flex items-center gap-5 mb-6">
                  {nowKind && <WeatherGlyph kind={nowKind} />}
                  <div>
                    <p className="font-display text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {Math.round(data.temperature)}°
                    </p>
                    {nowKind && (
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {states[nowKind]}
                      </p>
                    )}
                  </div>
                  <div className="ml-auto text-right text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
                    <p>{t('feels')}: {Math.round(data.feels)}°</p>
                    <p>{t('humidity')}: {Math.round(data.humidity)}%</p>
                    <p>{t('wind')}: {Math.round(data.wind)} km/h</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>{t('updatedAt')}: {formatClock(data.time)}</span>
                  <span>{t('sunrise')}: {formatClock(data.days[0].sunrise)}</span>
                  <span>{t('sunset')}: {formatClock(data.days[0].sunset)}</span>
                </div>
              </div>

              {/* 出行建议 + 今日降水 */}
              <div
                className="rounded-xl p-6"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
              >
                <h3 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  {t('adviceTitle')}
                </h3>
                <ul className="space-y-3 mb-6">
                  {adviceKeys.map((key) => (
                    <li key={key} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                        style={{ background: 'var(--accent)' }}
                      />
                      <span style={{ color: 'var(--text-secondary)' }}>{rawAdvices[key]}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg px-4 py-3" style={{ background: 'var(--bg-secondary)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{t('prob')}</p>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {data.days[0].prob}%
                    </p>
                  </div>
                  <div className="rounded-lg px-4 py-3" style={{ background: 'var(--bg-secondary)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{t('precipitation')}</p>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {data.days[0].precip} mm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 未来 7 日 */}
            <h3 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              {t('days')}
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {data.days.map((day, i) => {
                const k = kindOf(day.code);
                return (
                  <div
                    key={day.date}
                    className="min-w-[112px] flex-1 rounded-xl px-4 py-4 text-center"
                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                  >
                    <p className="text-xs mb-3 whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                      {dayLabel(day.date, i)}
                    </p>
                    <div className="flex justify-center mb-3">
                      <WeatherGlyph kind={k} />
                    </div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {Math.round(day.max)}° / {Math.round(day.min)}°
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {t('prob')} {day.prob}%
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/** 简洁中性天气图形（不依赖任何图标库/品牌） */
function WeatherGlyph({ kind }: { kind: Kind }) {
  const stroke = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const;
  const common = { width: 30, height: 30, viewBox: '0 0 30 30', 'aria-hidden': true } as const;

  switch (kind) {
    case 'clear':
      return (
        <svg {...common} style={{ color: 'var(--text-secondary)' }}>
          <circle cx="15" cy="15" r="5.5" {...stroke} />
          <g {...stroke}>
            <line x1="15" y1="2.5" x2="15" y2="6" />
            <line x1="15" y1="24" x2="15" y2="27.5" />
            <line x1="2.5" y1="15" x2="6" y2="15" />
            <line x1="24" y1="15" x2="27.5" y2="15" />
            <line x1="6.2" y1="6.2" x2="8.6" y2="8.6" />
            <line x1="21.4" y1="21.4" x2="23.8" y2="23.8" />
            <line x1="23.8" y1="6.2" x2="21.4" y2="8.6" />
            <line x1="8.6" y1="21.4" x2="6.2" y2="23.8" />
          </g>
        </svg>
      );
    case 'partly':
      return (
        <svg {...common} style={{ color: 'var(--text-secondary)' }}>
          <g {...stroke}>
            <circle cx="11" cy="10" r="4" />
            <line x1="11" y1="3" x2="11" y2="5" />
            <line x1="11" y1="15" x2="11" y2="16.5" />
            <line x1="4" y1="10" x2="5.5" y2="10" />
            <line x1="16.5" y1="10" x2="18" y2="10" />
          </g>
          <path
            d="M23 22a4 4 0 0 0-1-7.9 6 6 0 0 0-11.2-1.4A4.6 4.6 0 0 0 8 22h15z"
            {...stroke}
          />
        </svg>
      );
    case 'overcast':
      return (
        <svg {...common} style={{ color: 'var(--text-secondary)' }}>
          <path d="M6 20a4 4 0 0 1 0-8 6 6 0 0 1 11.4-1.6A4.5 4.5 0 0 1 17.5 20H6z" {...stroke} />
          <path d="M22 20a3 3 0 0 0-.6-5.9" {...stroke} opacity="0.7" />
        </svg>
      );
    case 'fog':
      return (
        <svg {...common} style={{ color: 'var(--text-secondary)' }}>
          <g {...stroke}>
            <line x1="4" y1="9" x2="26" y2="9" />
            <line x1="7" y1="14" x2="23" y2="14" />
            <line x1="4" y1="19" x2="26" y2="19" />
          </g>
        </svg>
      );
    case 'drizzle':
    case 'rain':
    case 'showers':
      return (
        <svg {...common} style={{ color: 'var(--text-secondary)' }}>
          <path d="M8 13a4 4 0 0 1 .5-8A6 6 0 0 1 19.8 6a4 4 0 0 1-.3 7H8z" {...stroke} />
          <g {...stroke}>
            <line x1="10" y1="20" x2="9" y2="24" />
            <line x1="15" y1="20" x2="14" y2="24" />
            <line x1="20" y1="20" x2="19" y2="24" />
            {kind === 'rain' && <line x1="12.5" y1="21.5" x2="11.5" y2="25" opacity="0.7" />}
            {kind === 'showers' && <line x1="17.5" y1="21.5" x2="16.5" y2="25" opacity="0.7" />}
          </g>
        </svg>
      );
    case 'snow':
      return (
        <svg {...common} style={{ color: 'var(--text-secondary)' }}>
          <path d="M8 13a4 4 0 0 1 .5-8A6 6 0 0 1 19.8 6a4 4 0 0 1-.3 7H8z" {...stroke} />
          <g {...stroke}>
            <circle cx="10" cy="21" r="0.9" />
            <circle cx="14.5" cy="22.5" r="0.9" />
            <circle cx="19" cy="21" r="0.9" />
          </g>
        </svg>
      );
    case 'thunder':
      return (
        <svg {...common} style={{ color: 'var(--text-secondary)' }}>
          <path d="M8 13a4 4 0 0 1 .5-8A6 6 0 0 1 19.8 6a4 4 0 0 1-.3 7H8z" {...stroke} />
          <path d="M14.5 19l-3 5h3.2l-1.2 4.5 4.5-6h-3.2l2-3.5z" {...stroke} transform="translate(0 -2)" />
        </svg>
      );
    default:
      return null;
  }
}
