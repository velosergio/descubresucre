import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const getDbUserWithRoles = cache(async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { roles: true },
  });
});

export async function requireStaffSession() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin");
  }

  const user = await getDbUserWithRoles(session.user.id);
  if (!user) {
    redirect("/login");
  }

  const staff = user.roles.some((r) => r.name === "admin" || r.name === "editor");
  if (!staff) {
    redirect("/");
  }

  if (user.accountStatus === "REJECTED") {
    redirect("/cuenta/rechazada");
  }
  if (user.accountStatus === "PENDING") {
    redirect("/cuenta/pendiente");
  }

  return { session, user };
}

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin");
  }

  const user = await getDbUserWithRoles(session.user.id);
  if (!user?.roles.some((r) => r.name === "admin")) {
    redirect("/admin");
  }
  if (user.accountStatus === "REJECTED") {
    redirect("/cuenta/rechazada");
  }
  if (user.accountStatus === "PENDING") {
    redirect("/cuenta/pendiente");
  }

  return { session, user };
}

export async function assertAdminAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false as const, error: "No autenticado" };
  }

  const user = await getDbUserWithRoles(session.user.id);
  if (!user?.roles.some((r) => r.name === "admin")) {
    return { ok: false as const, error: "Solo administradores" };
  }
  if (user.accountStatus !== "APPROVED") {
    return { ok: false as const, error: "Tu cuenta debe estar aprobada para esta acción" };
  }

  return { ok: true as const, session, user };
}
