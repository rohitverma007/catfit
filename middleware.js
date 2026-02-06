// Vercel Edge Middleware — runs before every request
// Handles: IP banning, bot detection, rate limiting

// --- Banned IPs (from env var) ---
// Set BANNED_IPS in Vercel dashboard (Settings > Environment Variables)
// Comma-separated, e.g.: "1.2.3.4,5.6.7.8"
const BANNED_IPS = new Set(
  (process.env.BANNED_IPS || '')
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean)
);

// --- Banned User-Agent substrings (case-insensitive) ---
const BANNED_BOT_PATTERNS = [
  'ahrefsbot',
  'semrushbot',
  'mj12bot',
  'dotbot',
  'gptbot',
  'chatgpt-user',
  'ccbot',
  'anthropic-ai',
  'google-extended',
  'bytespider',
  'petalbot',
  'claudebot',
  'zoominfobot',
  'dataforseobot',
  'headlesschrome',
  'phantomjs',
  'selenium',
  'puppeteer',
  'scrapy',
  'python-requests',
  'go-http-client',
  'wget/',
  'curl/',
];

// --- Rate limiting ---
// Tracks page-load timestamps per IP to detect automated traffic.
// State lives in the edge isolate's memory — effective for bots
// that repeatedly hit the same edge node (same region).
const WINDOW_MS = 10 * 60 * 1000; // 10-minute sliding window
const MAX_PAGE_LOADS = 20; // max HTML page loads per window
const TEMP_BAN_MS = 30 * 60 * 1000; // 30-minute temp ban once triggered

const ipPageLoads = new Map(); // ip -> number[]  (timestamps)
const tempBanned = new Map(); // ip -> ban-expiry timestamp

function isPagePath(pathname) {
  return pathname === '/' || pathname.endsWith('.html');
}

function isRateLimited(ip) {
  // Check temporary ban first
  const banExpiry = tempBanned.get(ip);
  if (banExpiry) {
    if (Date.now() < banExpiry) return true;
    tempBanned.delete(ip);
  }

  const now = Date.now();
  const cutoff = now - WINDOW_MS;
  let timestamps = ipPageLoads.get(ip);

  if (!timestamps) {
    timestamps = [];
    ipPageLoads.set(ip, timestamps);
  }

  // Prune entries outside the window
  while (timestamps.length > 0 && timestamps[0] < cutoff) {
    timestamps.shift();
  }

  timestamps.push(now);

  if (timestamps.length > MAX_PAGE_LOADS) {
    // Auto temp-ban this IP
    tempBanned.set(ip, now + TEMP_BAN_MS);
    ipPageLoads.delete(ip);
    console.log(`[RATE-LIMITED] IP ${ip} exceeded ${MAX_PAGE_LOADS} page loads in ${WINDOW_MS / 60000}min — temp-banned for ${TEMP_BAN_MS / 60000}min`);

    // Housekeeping: evict stale entries if maps grow large
    cleanup(now);
    return true;
  }

  return false;
}

function cleanup(now) {
  if (tempBanned.size > 5000) {
    for (const [k, v] of tempBanned) {
      if (v < now) tempBanned.delete(k);
    }
  }
  if (ipPageLoads.size > 5000) {
    const cutoff = now - WINDOW_MS;
    for (const [k, v] of ipPageLoads) {
      if (v.length === 0 || v[v.length - 1] < cutoff) {
        ipPageLoads.delete(k);
      }
    }
  }
}

// --- Headless-browser heuristic ---
// Real Chrome (89+) always sends sec-ch-ua and accept-language.
// Headless Chrome / HTTP clients spoofing Chrome UA often omit them.
function looksLikeHeadlessBrowser(request) {
  const ua = (request.headers.get('user-agent') || '').toLowerCase();
  if (!ua.includes('chrome/')) return false;

  const hasClientHints = request.headers.has('sec-ch-ua');
  const hasAcceptLang = request.headers.has('accept-language');

  // Chrome without these headers is almost certainly headless/automated
  if (!hasClientHints && !hasAcceptLang) return true;

  return false;
}

// ============================================================
export default function middleware(request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '';
  const url = new URL(request.url);

  // 1. IP ban list (hardcoded + env var)
  if (ip && BANNED_IPS.has(ip)) {
    console.log(`[BLOCKED] Banned IP: ${ip} → ${url.pathname}`);
    return new Response('Access denied', { status: 403 });
  }

  // 2. Temp-ban check (from rate limiter)
  const banExpiry = tempBanned.get(ip);
  if (banExpiry && Date.now() < banExpiry) {
    console.log(`[BLOCKED] Temp-banned IP: ${ip} → ${url.pathname}`);
    return new Response('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': '1800' },
    });
  }

  // 3. Bot detection via User-Agent
  const ua = (request.headers.get('user-agent') || '').toLowerCase();
  if (BANNED_BOT_PATTERNS.some((p) => ua.includes(p))) {
    console.log(`[BLOCKED] Bot UA: ${ip} ua="${ua.slice(0, 80)}" → ${url.pathname}`);
    return new Response('Forbidden', { status: 403 });
  }

  // 4. Headless-browser detection
  if (looksLikeHeadlessBrowser(request)) {
    console.log(`[BLOCKED] Headless browser: ${ip} ua="${ua.slice(0, 80)}" → ${url.pathname}`);
    return new Response('Forbidden', { status: 403 });
  }

  // 5. Rate limiting — only for HTML page navigations
  if (ip && isPagePath(url.pathname) && isRateLimited(ip)) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': '1800' },
    });
  }

  // 6. Allow through
  return undefined;
}

export const config = {
  matcher: '/(.*)',
};
