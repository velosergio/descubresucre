import { requireStaffSession } from "@/lib/auth-helpers";
import { AdminShell } from "@/components/admin/admin-shell";

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
