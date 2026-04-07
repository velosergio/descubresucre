import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UsersManager } from "@/components/admin/users-manager";

export default async function AdminUsersPage() {
  const session = await auth();
  const currentUserId = session?.user?.id ?? "";

  const [users, roles, pendingCount, totalCount] = await Promise.all([
    prisma.user.findMany({
      include: { roles: true },
      orderBy: { email: "asc" },
    }),
    prisma.role.findMany({ orderBy: { name: "asc" } }),
    prisma.user.count({ where: { accountStatus: "PENDING" } }),
    prisma.user.count(),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Usuarios</h1>
          <p className="max-w-xl text-muted-foreground">
            Gestiona cuentas del panel: crear, editar, roles y aprobar o rechazar solicitudes de acceso.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="rounded-lg border border-border/80 bg-card px-4 py-2 shadow-sm">
            <p className="text-muted-foreground">Total</p>
            <p className="text-2xl font-semibold tabular-nums">{totalCount}</p>
          </div>
          <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 px-4 py-2 shadow-sm">
            <p className="text-muted-foreground">Pendientes</p>
            <p className="text-2xl font-semibold tabular-nums text-amber-700 dark:text-amber-400">{pendingCount}</p>
          </div>
        </div>
      </div>

      <UsersManager users={users} roles={roles} currentUserId={currentUserId} />
    </div>
  );
}
