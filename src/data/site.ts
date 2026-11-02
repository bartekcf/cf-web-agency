export interface SocialLink {
  label: string;
  href: string;
}

interface SiteConfig {
  name: string;
  description: string;
  siteUrl: string;
  contactEmail: string;
  phone: string;
  socialLinks: SocialLink[];
  nav: { label: string; href: string }[];
}

export const site: SiteConfig = {
  name: 'TwojaStrona',
  description:
    'Przystępne, dopracowane strony internetowe dla małych firm. Projekt, konfiguracja i publikacja bez technicznego stresu.',
  siteUrl: (import.meta.env.PUBLIC_SITE_URL ?? '').replace(/\/$/, ''),
  contactEmail: '',
  phone: '',
  socialLinks: [] as SocialLink[],
  nav: [
    { label: 'Oferta', href: '/oferta/' },
    { label: 'Realizacje', href: '/realizacje/' },
    { label: 'Jak to działa', href: '/jak-to-dziala/' },
    { label: 'Kontakt', href: '/kontakt/' },
  ],
};
