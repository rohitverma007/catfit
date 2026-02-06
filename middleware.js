// Vercel Edge Middleware — runs before every request
// Handles: IP banning, bot detection, rate-limit headers

// --- Banned IPs ---
// Add IPs (v4 or v6) to block them at the edge before they hit your site.
const BANNED_IPS = new Set([
  // "1.2.3.4",        // example — replace with real IPs
  // "2001:db8::1",    // IPv6 example
]);

// --- Banned User-Agent substrings (case-insensitive) ---
// Covers aggressive scrapers, AI crawlers not already in robots.txt, etc.
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
];

export default function middleware(request) {
  // 1. IP ban check
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '';

  if (BANNED_IPS.has(ip)) {
    return new Response('Access denied', { status: 403 });
  }

  // 2. Bot detection via User-Agent
  const ua = (request.headers.get('user-agent') || '').toLowerCase();

  const isBlockedBot = BANNED_BOT_PATTERNS.some((pattern) =>
    ua.includes(pattern)
  );
  if (isBlockedBot) {
    return new Response('Forbidden', { status: 403 });
  }

  // 3. Allow the request through
  return undefined;
}

// Run on all paths
export const config = {
  matcher: '/(.*)',
};
