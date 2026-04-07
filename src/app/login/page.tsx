import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { prisma } from "@/lib/prisma";

function LoginFormFallback() {
  return (
    <div className="flex min-h-[320px] w-full max-w-md items-center justify-center rounded-xl border border-border/60 bg-card p-8 text-muted-foreground">
      Cargando…
    </div>
  );
}

export default async function LoginPage() {
  const session = await auth();
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { roles: true },
    });
    if (!user) {
      redirect("/");
    }
    const staff = user.roles.some((r) => r.name === "admin" || r.name === "editor");
    if (!staff) {
      redirect("/");
    }
    if (user.accountStatus === "REJECTED") {
      redirect("/cuenta/rechazada");
    }
    if (user.accountStatus === "PENDING") {
      redirect("/cuenta/pendiente");
    }
    redirect("/admin");
  }

  const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm googleEnabled={googleEnabled} />
      </Suspense>
    </main>
  );
}
