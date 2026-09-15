import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FichaEspecie } from "@/components/sucre-natural/ficha-especie";
import { getBiodiversityBySlug } from "@/lib/get-sucre-natural-public";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const row = await getBiodiversityBySlug(slug);
  if (!row) return { title: "Especie | Sucre Natural" };
  return { title: `${row.commonName} | Sucre Natural` };
}

export default async function EspeciePage({ params }: Props) {
  const { slug } = await params;
  const row = await getBiodiversityBySlug(slug);
  if (!row) notFound();
  return (
    <FichaEspecie
      ficha={{
        slug: row.slug,
        commonName: row.commonName,
        scientificName: row.scientificName,
        groupKey: row.groupKey,
        summary: row.summary,
        whereFound: row.whereFound,
        imageUrl: row.imageUrl,
        destinations: row.destinations,
      }}
    />
  );
}
