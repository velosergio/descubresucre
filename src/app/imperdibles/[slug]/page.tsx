import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImperdibleBySlug } from "@/lib/get-imperdible-detail";
import { getSiteOrigin } from "@/lib/site-url";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = await getImperdibleBySlug(slug);
  if (!dest) return { title: "Destino | Sucre Vivo" };
  const siteOrigin = getSiteOrigin();
  return {
    title: `${dest.title} | Sucre Vivo`,
    description: dest.subtitle.slice(0, 160),
    alternates: { canonical: `${siteOrigin}/imperdibles/${dest.slug}` },
  };
}

export default async function ImperdibleDetailPage({ params }: Props) {
  const { slug } = await params;
  const dest = await getImperdibleBySlug(slug);
  if (!dest) notFound();

  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  const embedUrl =
    mapsKey &&
    `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(mapsKey)}&center=${dest.mapLat},${dest.mapLng}&zoom=${dest.mapZoom}`;
  const externalMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${dest.mapLat},${dest.mapLng}`)}`;
  const isLocalUpload = dest.cardImageUrl.startsWith("/uploads/");

  return (
    <article className="min-h-screen bg-background">
      <div className="border-b border-border/80 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 gap-2">
            <Link href="/#imperdibles">
              <ArrowLeft className="size-4" />
              Volver al inicio
            </Link>
          </Button>
          <div className="relative aspect-[21/9] max-h-[320px] w-full overflow-hidden rounded-xl border border-border/80">
            <Image
              src={dest.cardImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
              unoptimized={isLocalUpload}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">{dest.title}</h1>
              <p className="mt-2 max-w-2xl font-body text-muted-foreground">{dest.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="prose prose-lg dark:prose-invert max-w-none font-body">
          <ReactMarkdown>{dest.bodyMarkdown}</ReactMarkdown>
        </div>

        <section className="mt-12 space-y-4">
          <h2 className="font-display text-xl font-semibold text-foreground">Ubicación</h2>
          {embedUrl ? (
            <div className="aspect-video w-full overflow-hidden rounded-lg border border-border/80">
              <iframe
                title="Mapa"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={embedUrl}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Mapa embebido no configurado. Puedes abrir la ubicación en Google Maps.
            </p>
          )}
          <Button variant="outline" size="sm" asChild className="gap-2">
            <a href={externalMapsUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" />
              Abrir en Google Maps
            </a>
          </Button>
        </section>
      </div>
    </article>
  );
}
