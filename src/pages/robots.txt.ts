import { site } from '../data/site';

export const prerender = true;

export function GET() {
  const sitemapLine = site.siteUrl
    ? `Sitemap: ${new URL('/sitemap.xml', site.siteUrl).toString()}\n`
    : '';
  const body = `User-agent: *\nAllow: /\n${sitemapLine}`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
