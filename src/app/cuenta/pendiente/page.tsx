import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CuentaPendientePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { accountStatus: true, email: true },
  });
  if (!user) {
    redirect("/login");
  }

  if (user.accountStatus === "APPROVED") {
    redirect("/admin");
  }
  if (user.accountStatus === "REJECTED") {
    redirect("/cuenta/rechazada");
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md border-border/80 shadow-lg">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Cuenta en revisión</CardTitle>
          <CardDescription>
            Hola{user.email ? `, ${user.email}` : ""}. Un administrador debe aprobar tu registro antes de que puedas
            acceder al panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Cuando tu acceso sea aprobado, podrás entrar en <strong className="text-foreground">/admin</strong> con tu
            usuario.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
          <SignOutButton />
        </CardFooter>
      </Card>
    </main>
  );
}
