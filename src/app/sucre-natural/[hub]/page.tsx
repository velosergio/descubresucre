import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getQueHacerBySlug } from "@/lib/get-que-hacer-detail";
import { legacyHubIdToQueHacerSlug } from "@/lib/que-hacer-hub-legacy";
import { getSucreNaturalHubDef, isSucreNaturalHubId } from "@/lib/sucre-natural-hubs";

type Props = { params: Promise<{ hub: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hub } = await params;
  if (!isSucreNaturalHubId(hub)) return { title: "Sucre Natural | Sucre Vivo" };
  const def = getSucreNaturalHubDef(hub);
  return { title: `${def.title} | Sucre Vivo` };
}

/** Legacy hub URLs redirect to canonical `/que-hacer/[slug]`. */
export default async function SucreNaturalHubRedirectPage({ params }: Props) {
  const { hub } = await params;
  const slug = legacyHubIdToQueHacerSlug(hub);
  if (!slug) notFound();
  const detail = await getQueHacerBySlug(slug);
  if (!detail) notFound();
  permanentRedirect(`/que-hacer/${slug}`);
}
