import Link from "next/link";
import type { ReactNode } from "react";
import "./sucre-natural.css";

/** El Docker build no tiene MariaDB; sin esto Next prerenderiza y Prisma hace pool timeout. */
export const dynamic = "force-dynamic";

export default function SucreNaturalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="sn-paper min-h-screen">
      <div className="border-b border-[hsl(var(--sn-ink)/0.08)] bg-white/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/sucre-natural"
            className="font-body text-sm font-semibold text-[hsl(var(--sn-ink))] underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[hsl(var(--sn-accent))]"
          >
            Sucre Natural
          </Link>
          <Link
            href="/"
            className="font-body text-sm text-[hsl(var(--sn-ink)/0.72)] underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[hsl(var(--sn-accent))]"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
