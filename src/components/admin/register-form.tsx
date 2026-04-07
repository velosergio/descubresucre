"use client";

import { useEffect, useReducer, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  error: string | null;
  loading: boolean;
}

type RegisterFormAction =
  | { type: "setName"; value: string }
  | { type: "setEmail"; value: string }
  | { type: "setPassword"; value: string }
  | { type: "setError"; value: string | null }
  | { type: "setLoading"; value: boolean };

const INITIAL_FORM: RegisterFormState = {
  name: "",
  email: "",
  password: "",
  error: null,
  loading: false,
};

function registerFormReducer(state: RegisterFormState, action: RegisterFormAction): RegisterFormState {
  switch (action.type) {
    case "setName":
      return { ...state, name: action.value };
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

export function RegisterForm({ googleEnabled }: RegisterFormProps) {
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState("/cuenta/pendiente");
  const [form, dispatch] = useReducer(registerFormReducer, INITIAL_FORM);

  useEffect(() => {
    const current = new URLSearchParams(window.location.search).get("callbackUrl");
    if (current) {
      setCallbackUrl(current);
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: "setError", value: null });
    dispatch({ type: "setLoading", value: true });
    try {
      const reg = await registerUserAction({
        email: form.email,
        name: form.name.trim() || undefined,
        password: form.password,
      });
      if (!reg.ok) {
        dispatch({ type: "setError", value: reg.error });
        return;
      }

      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        dispatch({
          type: "setError",
          value: "Cuenta creada, pero no se pudo iniciar sesión. Entra desde el inicio de sesión.",
        });
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
        <CardTitle className="font-display text-2xl">Crear cuenta</CardTitle>
        <CardDescription>
          Recibirás el rol editor. Tu acceso al panel quedará pendiente hasta que un administrador apruebe tu cuenta.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {form.error ? (
            <Alert variant="destructive">
              <AlertDescription>{form.error}</AlertDescription>
            </Alert>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="reg-name">Nombre (opcional)</Label>
            <Input
              id="reg-name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => dispatch({ type: "setName", value: e.target.value })}
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
              value={form.email}
              onChange={(e) => dispatch({ type: "setEmail", value: e.target.value })}
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
              value={form.password}
              onChange={(e) => dispatch({ type: "setPassword", value: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={form.loading}>
            {form.loading ? "Creando cuenta…" : "Registrarse"}
          </Button>
          {googleEnabled ? (
            <Button type="button" variant="outline" className="w-full" disabled={form.loading} onClick={() => void onGoogle()}>
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
