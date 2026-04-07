import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  context: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await context.params;
  if (!jobId || jobId.length > 64) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const job = await prisma.chatJob.findUnique({ where: { id: jobId } });
  if (!job) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    status: job.status,
    reply: job.assistantReply ?? undefined,
    error: job.errorMessage ?? undefined,
  });
}
