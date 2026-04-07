import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/providers";
import { getSiteOrigin } from "@/lib/site-url";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: "Descubre Sucre",
  description: "Descubre Sucre",
  authors: [{ name: "Descubre Sucre" }],
  openGraph: {
    title: "Descubre Sucre",
    description: "Descubre Sucre",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@descubresucre",
    title: "Descubre Sucre",
    description: "Descubre Sucre",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${playfairDisplay.variable} ${dmSans.variable}`}
    >
      <body suppressHydrationWarning className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
