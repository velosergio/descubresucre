import type { Metadata } from "next";
import ResearchLanding from "@/components/investigacion/research-landing";
import { getSiteOrigin } from "@/lib/site-url";

const title = "Investigación Sucre Vivo | Plataforma digital con IA para el patrimonio de Sucre";
const description =
  "Contexto, objetivos, metodología, hallazgos, beneficios y próximos pasos del proyecto de investigación Sucre Vivo (Semillero CUN): una plataforma digital con inteligencia artificial para la oferta cultural y turística de Sucre.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/investigacion" },
  openGraph: {
    title,
    description,
    url: `${getSiteOrigin().replace(/\/$/, "")}/investigacion`,
    siteName: "Sucre Vivo",
    locale: "es_CO",
    type: "article",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function InvestigacionPage() {
  return <ResearchLanding />;
}
