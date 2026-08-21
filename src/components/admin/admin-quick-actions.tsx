import { ExternalLink, ImageIcon, Images, LayoutGrid, Settings, Shield, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const adminQuickLinks: { href: string; label: string; description: string; icon: typeof Users }[] =
  [
    {
      href: "/admin/personalizar",
      label: "Personalizar sitio",
      description: "Vista general de contenido público",
      icon: LayoutGrid,
    },
    {
      href: "/admin/personalizar/galeria",
      label: "Galería",
      description: "Imágenes y vídeos del sitio",
      icon: Images,
    },
    {
      href: "/admin/personalizar/banner",
      label: "Banner principal",
      description: "Hero y medios del inicio",
      icon: ImageIcon,
    },
    {
      href: "/admin/users",
      label: "Usuarios",
      description: "Cuentas y aprobaciones",
      icon: Users,
    },
    {
      href: "/admin/roles",
      label: "Roles",
      description: "Permisos del panel",
      icon: Shield,
    },
    {
      href: "/admin/configuracion",
      label: "Configuración",
      description: "Ajustes generales",
      icon: Settings,
    },
  ];

export function AdminQuickActions({ isAdmin }: { isAdmin: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones rápidas</CardTitle>
        <CardDescription>
          {isAdmin
            ? "Accede a las secciones más usadas del panel."
            : "Tu rol no incluye estas herramientas; contacta a un administrador si necesitas acceso."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdmin ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {adminQuickLinks.map((item) => (
              <Button
                key={item.href}
                variant="outline"
                className="h-auto justify-start gap-3 py-3"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="flex min-w-0 flex-col items-start gap-0.5 text-left">
                    <span className="font-medium leading-none">{item.label}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </Link>
              </Button>
            ))}
          </div>
        ) : null}
        <Button variant="secondary" className="w-full justify-start gap-2 sm:w-auto" asChild>
          <Link href="/">
            <ExternalLink className="size-4" />
            Ver sitio público
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
