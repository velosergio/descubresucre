import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActivityThemePage } from "@/components/que-hacer/activity-theme-page";
import { getQueHacerBySlug } from "@/lib/get-que-hacer-detail";
import { getSiteOrigin } from "@/lib/site-url";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getQueHacerBySlug(slug);
  if (!detail) return { title: "Qué hacer | Sucre Vivo" };
  const siteOrigin = getSiteOrigin();
  return {
    title: `${detail.title} | Sucre Vivo`,
    description: (detail.tagline || detail.description).slice(0, 160),
    alternates: { canonical: `${siteOrigin}/que-hacer/${detail.slug}` },
  };
}

export default async function QueHacerDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getQueHacerBySlug(slug);
  if (!detail) notFound();
  return <ActivityThemePage detail={detail} />;
}
