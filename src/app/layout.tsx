import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Montserrat, Azeret_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";

import { siteDescription, siteUrl } from "@/lib/site";

import "./globals.css";

// Body
const body = Montserrat({
  variable: "--font-body-src",
  subsets: ["latin"],
  display: "swap",
});

// Mono labels / eyebrows
const mono = Azeret_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
  display: "swap",
});

// Morganite — the brand display face, self-hosted from the licensed family.
// Condensed/tall; used uppercase for headings via the .font-display class.
const display = localFont({
  variable: "--font-display-src",
  display: "swap",
  src: [
    { path: "../../public/fonts/Morganite-Book.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Morganite-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Morganite-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/Morganite-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Morganite-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../../public/fonts/Morganite-Black.ttf", weight: "900", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Open Spaces",
    template: "%s · Open Spaces",
  },
  description: siteDescription,
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    siteName: "Open Spaces",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${body.variable} ${mono.variable} ${display.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-midnight">
        {children}
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-D0X9TKX1D8" />
    </html>
  );
}
