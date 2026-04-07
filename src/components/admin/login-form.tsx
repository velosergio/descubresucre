"use client";

import { useEffect, useState } from "react";
import { useReducer } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginFormProps {
  googleEnabled: boolean;
}

interface LoginFormState {
  email: string;
  password: string;
  error: string | null;
  loading: boolean;
}

type LoginFormAction =
  | { type: "setEmail"; value: string }
  | { type: "setPassword"; value: string }
  | { type: "setError"; value: string | null }
  | { type: "setLoading"; value: boolean };

const INITIAL_FORM: LoginFormState = {
  email: "",
  password: "",
  error: null,
  loading: false,
};

function loginFormReducer(state: LoginFormState, action: LoginFormAction): LoginFormState {
  switch (action.type) {
    case "setEmail":
      return { ...state, email: action.value };
    case "setPassword":
      return { ...state, password: action.value };
    case "setError":
      return { ...state, error: action.value };
    case "setLoading":
      return { ...state, loading: action.value };
    default:
      return state;
  }
}

export function LoginForm({ googleEnabled }: LoginFormProps) {
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState("/admin");
  const [form, dispatch] = useReducer(loginFormReducer, INITIAL_FORM);

  useEffect(() => {
    const current = new URLSearchParams(window.location.search).get("callbackUrl");
    if (current) {
      setCallbackUrl(current);
    }
  }, []);

  async function onCredentials(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: "setError", value: null });
    dispatch({ type: "setLoading", value: true });
    try {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        dispatch({ type: "setError", value: "Credenciales incorrectas." });
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } finally {
      dispatch({ type: "setLoading", value: false });
    }
  }

  async function onGoogle() {
    dispatch({ type: "setError", value: null });
    dispatch({ type: "setLoading", value: true });
    await signIn("google", { callbackUrl });
  }

  return (
    <Card className="w-full max-w-md border-border/80 shadow-lg">
      <CardHeader>
        <CardTitle className="font-display text-2xl">Acceso al panel</CardTitle>
        <CardDescription>Inicia sesión para administrar Descubre Sucre.</CardDescription>
      </CardHeader>
      <form onSubmit={onCredentials}>
        <CardContent className="space-y-4">
          {form.error ? (
            <Alert variant="destructive">
              <AlertDescription>{form.error}</AlertDescription>
            </Alert>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) => dispatch({ type: "setEmail", value: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => dispatch({ type: "setPassword", value: e.target.value })}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={form.loading}>
            {form.loading ? "Entrando…" : "Entrar"}
          </Button>
          {googleEnabled ? (
            <Button type="button" variant="outline" className="w-full" disabled={form.loading} onClick={() => void onGoogle()}>
              Continuar con Google
            </Button>
          ) : null}
          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link
              href={callbackUrl ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/register"}
              className="font-medium text-foreground underline underline-offset-4"
            >
              Registrarse
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
