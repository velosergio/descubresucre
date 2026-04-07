import { requireAdminSession } from "@/lib/auth-helpers";

export default async function AdminConfigLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession();
  return children;
}
