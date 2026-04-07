"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface SignOutButtonProps {
  variant?: React.ComponentProps<typeof Button>["variant"];
  className?: string;
  label?: string;
  callbackUrl?: string;
}

export function SignOutButton({
  variant = "secondary",
  className,
  label = "Cerrar sesión",
  callbackUrl = "/login",
}: SignOutButtonProps) {
  return (
    <Button type="button" variant={variant} className={className} onClick={() => void signOut({ callbackUrl })}>
      {label}
    </Button>
  );
}
