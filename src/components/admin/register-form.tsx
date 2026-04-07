"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerUserAction } from "@/lib/actions/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RegisterFormProps {
  googleEnabled: boolean;
}

export function RegisterForm({ googleEnabled }: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/cuenta/pendiente";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const reg = await registerUserAction({
        email,
        name: name.trim() || undefined,
        password,
      });
      if (!reg.ok) {
        setError(reg.error);
        return;
      }

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        setError("Cuenta creada, pero no se pudo iniciar sesión. Entra desde el inicio de sesión.");
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setLoading(true);
    await signIn("google", { callbackUrl });
  }

  return (
    <Card className="w-full max-w-md border-border/80 shadow-lg">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Crear cuenta</CardTitle>
        <CardDescription>
          Recibirás el rol editor. Tu acceso al panel quedará pendiente hasta que un administrador apruebe tu cuenta.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="reg-name">Nombre (opcional)</Label>
            <Input
              id="reg-name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-email">Correo</Label>
            <Input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password">Contraseña</Label>
            <Input
              id="reg-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creando cuenta…" : "Registrarse"}
          </Button>
          {googleEnabled ? (
            <Button type="button" variant="outline" className="w-full" disabled={loading} onClick={() => void onGoogle()}>
              Continuar con Google
            </Button>
          ) : null}
          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link
              href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"}
              className="font-medium text-foreground underline underline-offset-4"
            >
              Iniciar sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
