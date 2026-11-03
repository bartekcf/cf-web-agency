import { offers } from '../data/offers';
import { projects } from '../data/projects';
import { site } from '../data/site';

export const prerender = true;

const paths = [
  '/',
  '/oferta/',
  ...offers.map((offer) => `/oferta/${offer.slug}/`),
  '/realizacje/',
  ...projects.map((project) => `/realizacje/${project.slug}/`),
  '/jak-to-dziala/',
  '/kontakt/',
];

const locations = site.siteUrl
  ? paths.map((path) => `  <url><loc>${new URL(path, site.siteUrl).toString()}</loc></url>`).join('\n')
  : '';

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locations ? `${locations}\n` : ''}</urlset>`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
