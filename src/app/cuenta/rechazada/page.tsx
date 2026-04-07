import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CuentaRechazadaPage() {
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
  if (user.accountStatus === "PENDING") {
    redirect("/cuenta/pendiente");
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md border-destructive/30 shadow-lg">
        <CardHeader>
          <CardTitle className="font-display text-2xl text-destructive">Acceso no autorizado</CardTitle>
          <CardDescription>
            Tu solicitud de acceso al panel no fue aprobada{user.email ? ` (${user.email})` : ""}.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Si crees que es un error, contacta a un administrador del sitio.</p>
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
