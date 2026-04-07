import { requireAdminSession } from "@/lib/auth-helpers";

export default async function AdminRolesLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession();
  return children;
}
