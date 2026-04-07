import { requireAdminSession } from "@/lib/auth-helpers";

export default async function AdminUsersLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession();
  return children;
}
