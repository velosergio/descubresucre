import { requireAdminSession } from "@/lib/auth-helpers";

export default async function AdminPersonalizarLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession();
  return children;
}
