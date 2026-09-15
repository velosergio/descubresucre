"use client";

import {
  Binoculars,
  ImageIcon,
  Images,
  LayoutDashboard,
  LayoutGrid,
  Leaf,
  LogOut,
  MapPin,
  Palmtree,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const mainNav = [{ href: "/admin", label: "Resumen", icon: LayoutDashboard }];

const personalizarNav: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}[] = [
  { href: "/admin/personalizar", label: "Vista general", icon: LayoutGrid, exact: true },
  { href: "/admin/personalizar/galeria", label: "Galería", icon: Images },
  { href: "/admin/personalizar/banner", label: "Banner principal", icon: ImageIcon },
  { href: "/admin/personalizar/destinos-imperdibles", label: "Destinos imperdibles", icon: MapPin },
  { href: "/admin/personalizar/sucre-natural", label: "Sucre Natural", icon: Palmtree },
  { href: "/admin/personalizar/biodiversidad", label: "Biodiversidad", icon: Leaf },
  {
    href: "/admin/personalizar/experiencias-naturaleza",
    label: "Experiencias naturaleza",
    icon: Binoculars,
  },
];

const adminNav = [
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/roles", label: "Roles", icon: Shield },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

function isNavActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin" || pathname === "/admin/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AdminSidebarTrigger({ className }: { className?: string }) {
  const { isMobile, state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const label = isMobile ? "Abrir menú" : collapsed ? "Expandir menú" : "Colapsar menú";
  const Icon = isMobile || collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("size-7", className)}
          onClick={toggleSidebar}
          aria-label={label}
          aria-expanded={isMobile ? undefined : !collapsed}
        >
          <Icon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side={collapsed ? "right" : "bottom"} hidden={isMobile}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

interface AdminShellProps {
  children: React.ReactNode;
  userLabel: string;
  isAdmin: boolean;
}

export function AdminShell({ children, userLabel, isAdmin }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-border/80">
        <SidebarHeader className="flex-row items-center gap-2 px-3 py-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold tracking-tight">Sucre Vivo</p>
            <p className="truncate text-xs text-muted-foreground">Panel de administración</p>
          </div>
          <AdminSidebarTrigger className="hidden size-7 shrink-0 md:inline-flex" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Panel</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNav.map((item) => {
                  const active = isNavActive(pathname, item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {isAdmin ? (
            <>
              <SidebarGroup>
                <SidebarGroupLabel>Personalizar</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {personalizarNav.map((item) => {
                      const active = item.exact
                        ? pathname === item.href || pathname === `${item.href}/`
                        : isNavActive(pathname, item.href);
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                            <Link href={item.href}>
                              <item.icon className="size-4" />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Administración</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminNav.map((item) => {
                      const active = isNavActive(pathname, item.href);
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                            <Link href={item.href}>
                              <item.icon className="size-4" />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </>
          ) : null}
        </SidebarContent>
        <SidebarFooter className="gap-2 border-t border-border/60 p-2">
          <p className="truncate px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            {userLabel}
          </p>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Salir" onClick={() => void signOut({ callbackUrl: "/" })}>
                <LogOut className="size-4" />
                <span>Salir</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b border-border/80 px-4 md:hidden">
          <AdminSidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <span className="text-sm font-medium">Admin</span>
        </header>
        <div className="flex-1 p-4 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
