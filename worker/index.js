// Cloudflare Worker：
//  - /api/weather 由服务端代拉 Open-Meteo，并在 Cloudflare 侧缓存 30 分钟（自动刷新）；
//  - 其余请求交由 Workers Static Assets 托管 out/。由于 next export 产出的是
//    zh.html / uk.html 这类根级文件，这里把无扩展名的多语言美观路径（如 /uk、/uk/privacy-policy/）
//    重写到对应 .html 产物，并保留离线 PWA 语义。
const WEATHER_UPSTREAM =
  'https://api.open-meteo.com/v1/forecast?latitude=50.4544624&longitude=30.5299656&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset&timezone=Europe%2FKyiv&forecast_days=7&wind_speed_unit=kmh&alerts=true';

// 服务端缓存周期：30 分钟。
const CACHE_TTL_MS = 30 * 60 * 1000;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 天气代理接口
    if (url.pathname === '/api/weather' && request.method === 'GET') {
      return proxyWeather(request);
    }

    return serveStatic(request, env);
  },
};

async function serveStatic(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 无扩展名路径 → 同名的 .html 产物（/uk/ -> /uk.html，/uk/a/ -> /uk/a.html）
  if (pathname !== '/' && !/\.\w+$/.test(pathname)) {
    const base = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const candidate = new URL(base + '.html', url.origin);
    const res = await env.ASSETS.fetch(new Request(candidate.toString(), request));
    if (res.ok) return res;
  }

  // 其余走 Assets 默认逻辑（含 index.html、静态资源与 404.html 兜底）
  return env.ASSETS.fetch(request);
}

async function proxyWeather(request) {
  const jsonHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  };

  // 规范化缓存键：忽略客户端可能携带的 no-store / query 等差异
  const keyUrl = new URL(request.url);
  keyUrl.search = '';
  const cacheKey = new Request(keyUrl.toString());

  const cache = caches.default;
  try {
    // 命中未过期的封套缓存（30 分钟内不重复访问上游）
    const hit = await cache.match(cacheKey);
    if (hit) {
      const record = await hit.json();
      if (record && Date.now() - record.ts < CACHE_TTL_MS) {
        return new Response(record.text, { status: 200, headers: jsonHeaders });
      }
    }

    const upstream = await fetch(WEATHER_UPSTREAM);
    if (!upstream.ok) {
      return new Response(
        JSON.stringify({ error: 'weather_upstream_error', status: upstream.status }),
        { status: 502, headers: jsonHeaders },
      );
    }

    const text = await upstream.text();
    // 存入封套（缓存 API 内保留较长 TTL，过期判断由 ts 控制）
    await cache
      .put(
        cacheKey,
        new Response(JSON.stringify({ ts: Date.now(), text }), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=86400',
          },
        }),
      )
      .catch(() => {
        /* 缓存不可用则退化为每次请求直取上游 */
      });

    return new Response(text, { status: 200, headers: jsonHeaders });
  } catch (err) {
    // 上游出错时回退到任意旧缓存
    const hit = await cache.match(cacheKey);
    if (hit) {
      try {
        const record = await hit.json();
        if (record && record.text) {
          return new Response(record.text, { status: 200, headers: jsonHeaders });
        }
      } catch {
        /* 忽略损坏缓存 */
      }
    }
    return new Response(JSON.stringify({ error: 'weather_unavailable' }), {
      status: 502,
      headers: jsonHeaders,
    });
  }
}
