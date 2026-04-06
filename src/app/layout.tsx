import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
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
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
