import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FichaExperiencia } from "@/components/sucre-natural/ficha-experiencia";
import { getExperienceBySlug } from "@/lib/get-sucre-natural-public";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const row = await getExperienceBySlug(slug);
  if (!row) return { title: "Experiencia | Sucre Natural" };
  return { title: `${row.title} | Sucre Natural` };
}

export default async function ExperienciaPage({ params }: Props) {
  const { slug } = await params;
  const row = await getExperienceBySlug(slug);
  if (!row) notFound();
  return (
    <FichaExperiencia
      ficha={{
        slug: row.slug,
        title: row.title,
        tagline: row.tagline,
        whereText: row.whereText,
        whatYouDo: row.whatYouDo,
        specialWhy: row.specialWhy,
        recommendations: row.recommendations,
        imageUrl: row.imageUrl,
        destinations: row.destinations,
      }}
    />
  );
}
