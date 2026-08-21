import { AdminShell } from "@/components/admin/admin-shell";
import { requireStaffSession } from "@/lib/auth-helpers";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, user } = await requireStaffSession();
  const isAdmin = user.roles.some((r) => r.name === "admin");
  const userLabel = session.user?.email ?? session.user?.name ?? "Usuario";

  return (
    <AdminShell userLabel={userLabel} isAdmin={isAdmin}>
      {children}
    </AdminShell>
  );
}
