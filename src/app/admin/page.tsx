import { requireStaffSession } from "@/lib/auth-helpers";
import { AdminQuickActions } from "@/components/admin/admin-quick-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminHomePage() {
  const { user } = await requireStaffSession();
  const roleNames = user.roles.map((r) => r.name).join(", ");
  const isAdmin = user.roles.some((r) => r.name === "admin");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Tablero</h1>
        <p className="text-muted-foreground">Resumen del panel y accesos rápidos al contenido y la administración.</p>
      </div>
      <AdminQuickActions isAdmin={isAdmin} />
      <Card>
        <CardHeader>
          <CardTitle>Tu sesión</CardTitle>
          <CardDescription>Roles activos en esta cuenta.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            <span className="font-medium text-foreground">Roles:</span> {roleNames || "ninguno"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
