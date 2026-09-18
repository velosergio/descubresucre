import { type NextRequest, NextResponse } from "next/server";
import { getCulturalEventsForMonth } from "@/lib/get-cultural-events-home";
import { parseMonthParam } from "@/lib/month-range";

export async function GET(req: NextRequest) {
  const parsed = parseMonthParam(req.nextUrl.searchParams.get("mes"));
  if (!parsed) {
    return NextResponse.json({ error: "Parámetro 'mes' inválido." }, { status: 400 });
  }

  const payload = await getCulturalEventsForMonth(parsed);
  return NextResponse.json(payload);
}
