export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  links: Record<string, string>;
};

export const siteConfig: SiteConfig = {
  name: "Voids",
  description: "Voids app",
  url: "https://voids-pi.vercel.app/",
  links: {
    twitter: "https://twitter.com/EfosaSO",
  },
};
