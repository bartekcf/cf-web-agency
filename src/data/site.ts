import { contact } from './contact';

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
    'Strony internetowe i proste aplikacje dla małych firm. Pomoc z treścią, domeną, hostingiem i uruchomieniem.',
  siteUrl: (import.meta.env.PUBLIC_SITE_URL ?? '').replace(/\/$/, ''),
  contactEmail: contact.email,
  phone: contact.phone,
  socialLinks: [] as SocialLink[],
  nav: [
    { label: 'Oferta', href: '/oferta/' },
    { label: 'Realizacje', href: '/realizacje/' },
    { label: 'Jak to działa', href: '/jak-to-dziala/' },
    { label: 'Kontakt', href: '/kontakt/' },
  ],
};
