import { Nunito } from "next/font/google";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/app-beta";
import { Home } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Menu } from "~/components/ui/menu";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";

import "~/styles/globals.css";
import { ClientProviders } from "./client-providers";

const fontSans = Nunito({
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "App-Router",
    "TRPC",
    "Edge",
    "Drizzle",
    "PlanetScale",
    "T3",
    "Stack",
    "Tailwind",
    "shadcn/ui",
    "Radix",
  ],
  authors: [
    {
      name: "Oleksandr Ploskovytskyy",
      url: "",
    },
  ],
  creator: "Oleksandr Ploskovytskyy",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@o_ploskovytskyy",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

type RootLayoutProps = PropsWithChildren;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={fontSans.className}>
      <head />
      <body
        className={cn(
          "antialiased bg-white text-black dark:bg-stone-900 dark:text-white"
        )}
      >
        <ClientProviders>
          <main className="min-h-screen">
            {/* @ts-ignore */}
            <Header />
            <section className="container py-20">{children}</section>
          </main>
          <footer className="bg-gradient-to-l from-rose-100 to-teal-100 dark:from-rose-100/80 dark:to-teal-100/80 text-stone-900">
            <div className="grid md:flex container md:items-center md:justify-between gap-2 md:gap-4 py-3 md:py-6 text-sm">
              <p>
                Built by{" "}
                <a
                  href={siteConfig.links.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline underline-offset-4"
                >
                  @EfosaSO
                </a>
              </p>
            </div>
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}

async function Header() {
  const user = await currentUser();

  return (
    <header className="fixed z-50 w-full bg-white text-black dark:bg-stone-900 dark:text-white">
      <section className="container">
        <div className=" flex items-center justify-between py-4 border-b dark:border-b-stone-700">
          <Link
            href="/"
            className="hover:text-rose-400 underline font-semibold"
          >
            <Home />
          </Link>
          <div className="flex gap-6 items-center">
            {user ? (
              <Menu photo={user.profileImageUrl} />
            ) : (
              <Button variant="ghost" href="/dashboard">
                Login
              </Button>
            )}
          </div>
        </div>
      </section>
    </header>
  );
}
