import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { getSiteOrigin } from "@/lib/site-url";

const siteOrigin = getSiteOrigin();

export const metadata: Metadata = {
  title: "Sucre Vivo | Turismo, cultura y experiencias en Sucre, Colombia",
  description:
    "Explora destinos, actividades, eventos, agenda cultural y convocatorias del departamento de Sucre. Descubre playas del Golfo de Morrosquillo, tradiciones locales y recomendaciones con asistente de chat.",
  keywords: [
    "Sucre Vivo",
    "turismo en Sucre",
    "Sucre Colombia",
    "Golfo de Morrosquillo",
    "Tolú",
    "Coveñas",
    "Sincelejo",
    "agenda cultural Sucre",
    "eventos en Sucre",
    "playas de Sucre",
    "turismo cultural",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sucre Vivo | Turismo, cultura y experiencias en Sucre, Colombia",
    description:
      "Guía turística y cultural de Sucre: destinos, playas, actividades, eventos y agenda cultural en un solo lugar.",
    url: siteOrigin,
    siteName: "Sucre Vivo",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sucre Vivo - Turismo y cultura en Sucre, Colombia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sucre Vivo | Turismo y cultura en Sucre, Colombia",
    description:
      "Destinos, actividades, eventos y agenda cultural para descubrir lo mejor de Sucre.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <HomePage />;
}
