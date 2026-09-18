import { NextResponse } from "next/server";
import { getPublishedCulturalEventById } from "@/lib/get-cultural-events-home";
import { buildIcsContent } from "@/lib/ics";

function slugForFilename(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "evento";
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const event = await getPublishedCulturalEventById(id);
  if (!event) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const ics = buildIcsContent(event);
  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slugForFilename(event.title)}.ics"`,
    },
  });
}
