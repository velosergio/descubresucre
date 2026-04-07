import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/admin/register-form";

function RegisterFormFallback() {
  return (
    <div className="flex min-h-[320px] w-full max-w-md items-center justify-center rounded-xl border border-border/60 bg-card p-8 text-muted-foreground">
      Cargando…
    </div>
  );
}

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/admin");
  }

  const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Suspense fallback={<RegisterFormFallback />}>
        <RegisterForm googleEnabled={googleEnabled} />
      </Suspense>
      <p className="mt-6 max-w-md text-center text-xs text-muted-foreground">
        Tras registrarte, un administrador debe aprobar tu cuenta antes de que puedas usar el panel.
      </p>
    </main>
  );
}
