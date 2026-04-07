import { prisma } from "@/lib/prisma";
import { RolesManager } from "@/components/admin/roles-manager";

export default async function AdminRolesPage() {
  const roles = await prisma.role.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Roles</h1>
        <p className="text-muted-foreground">Define roles para el control de acceso (RBAC).</p>
      </div>
      <RolesManager roles={roles} />
    </div>
  );
}
