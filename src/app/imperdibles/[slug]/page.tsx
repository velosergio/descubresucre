import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { FichaDestino } from "@/components/sucre-natural/ficha-destino";
import { Button } from "@/components/ui/button";
import {
  getImperdibleBySlug,
  type ImperdibleDetail,
  type ImperdibleQueHacerRef,
} from "@/lib/get-imperdible-detail";
import {
  buildGoogleMapsEmbedPlaceUrl,
  buildGoogleMapsSearchUrl,
  getGoogleMapsApiKey,
} from "@/lib/google-maps-embed";
import { toServedMediaUrl } from "@/lib/media-url";
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

function ImperdibleQueHacerLinks({ activities }: { activities: ImperdibleQueHacerRef[] }) {
  if (activities.length === 0) return null;
  return (
    <section className="mt-12 space-y-3">
      <h2 className="font-display text-xl font-semibold text-foreground">Qué hacer</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {activities.map((act) => (
          <li key={act.slug}>
            <Link
              href={`/que-hacer/${act.slug}`}
              className="block rounded-xl border border-border/80 bg-card p-3 font-body outline-none hover:border-primary focus-visible:ring-2 focus-visible:ring-primary"
            >
              {act.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ImperdibleLocationSection({
  lat,
  lng,
  zoom,
}: {
  lat: number | null;
  lng: number | null;
  zoom: number;
}) {
  const hasCoords = lat != null && lng != null;
  const mapsKey = getGoogleMapsApiKey() ?? "";
  const embedUrl = hasCoords
    ? buildGoogleMapsEmbedPlaceUrl({
        apiKey: mapsKey,
        lat,
        lng,
        zoom,
      })
    : null;
  const externalMapsUrl = hasCoords ? buildGoogleMapsSearchUrl(lat, lng) : null;

  return (
    <section className="mt-12 space-y-4">
      <h2 className="font-display text-xl font-semibold text-foreground">Ubicación</h2>
      {embedUrl ? (
        <div className="aspect-video w-full overflow-hidden rounded-lg border border-border/80">
          <iframe
            title="Mapa"
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-popups allow-forms"
            src={embedUrl}
          />
        </div>
      ) : hasCoords ? (
        <p className="text-sm text-muted-foreground">
          Mapa embebido no configurado. Puedes abrir la ubicación en Google Maps.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Este destino aún no tiene coordenadas de mapa.
        </p>
      )}
      {externalMapsUrl ? (
        <Button variant="outline" size="sm" asChild className="gap-2">
          <a href={externalMapsUrl} target="_blank" rel="noreferrer">
            <ExternalLink className="size-4" />
            Abrir en Google Maps
          </a>
        </Button>
      ) : null}
    </section>
  );
}

function ImperdibleClassicArticle({ dest }: { dest: ImperdibleDetail }) {
  const cardSrc = dest.cardImageUrl ? toServedMediaUrl(dest.cardImageUrl) : null;

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
          <div className="relative aspect-[21/9] max-h-[320px] w-full overflow-hidden rounded-xl border border-border/80 bg-muted">
            {cardSrc ? (
              <Image
                src={cardSrc}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
                unoptimized
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {dest.title}
              </h1>
              <p className="mt-2 max-w-2xl font-body text-muted-foreground">{dest.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="prose prose-lg dark:prose-invert max-w-none font-body">
          <ReactMarkdown>{dest.bodyMarkdown}</ReactMarkdown>
        </div>
        <ImperdibleQueHacerLinks activities={dest.queHacerActivities} />
        <ImperdibleLocationSection lat={dest.mapLat} lng={dest.mapLng} zoom={dest.mapZoom} />
      </div>
    </article>
  );
}

export default async function ImperdibleDetailPage({ params }: Props) {
  const { slug } = await params;
  const dest = await getImperdibleBySlug(slug);
  if (!dest) notFound();

  if (dest.hasStructuredFicha) {
    return <FichaDestino ficha={dest} />;
  }

  return <ImperdibleClassicArticle dest={dest} />;
}
