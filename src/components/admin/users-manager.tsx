"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Pencil, Plus, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  approveUserAction,
  createUserAction,
  deleteUserAction,
  rejectUserAction,
  updateUserAction,
} from "@/lib/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type AccountStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface UserRow {
  id: string;
  email: string;
  name: string | null;
  accountStatus: AccountStatus;
  roles: { id: string; name: string }[];
}

export interface RoleOption {
  id: string;
  name: string;
}

function StatusBadge({ status }: { status: AccountStatus }) {
  if (status === "PENDING") {
    return (
      <Badge variant="secondary" className="border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
        Pendiente
      </Badge>
    );
  }
  if (status === "REJECTED") {
    return <Badge variant="destructive">Rechazado</Badge>;
  }
  return (
    <Badge className="border-transparent bg-emerald-600 text-white hover:bg-emerald-600/90 dark:bg-emerald-600">
      Aprobado
    </Badge>
  );
}

export function UsersManager({
  users,
  roles,
  currentUserId,
}: {
  users: UserRow[];
  roles: RoleOption[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [accountStatus, setAccountStatus] = useState<AccountStatus>("APPROVED");
  const [selectedRoles, setSelectedRoles] = useState<Record<string, boolean>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const counts = useMemo(
    () => ({
      all: users.length,
      PENDING: users.filter((u) => u.accountStatus === "PENDING").length,
      APPROVED: users.filter((u) => u.accountStatus === "APPROVED").length,
      REJECTED: users.filter((u) => u.accountStatus === "REJECTED").length,
    }),
    [users],
  );

  const filtered = useMemo(() => {
    if (tab === "all") return users;
    return users.filter((u) => u.accountStatus === tab);
  }, [users, tab]);

  function resetForm() {
    setEditId(null);
    setEmail("");
    setName("");
    setPassword("");
    setAccountStatus("APPROVED");
    setSelectedRoles({});
  }

  function openCreate() {
    resetForm();
    setOpen(true);
  }

  function openEdit(user: UserRow) {
    setEditId(user.id);
    setEmail(user.email);
    setName(user.name ?? "");
    setPassword("");
    setAccountStatus(user.accountStatus);
    const map: Record<string, boolean> = {};
    for (const r of roles) {
      map[r.id] = user.roles.some((x) => x.id === r.id);
    }
    setSelectedRoles(map);
    setOpen(true);
  }

  function toggleRole(roleId: string, checked: boolean) {
    setSelectedRoles((prev) => ({ ...prev, [roleId]: checked }));
  }

  function roleIdsFromSelection() {
    return Object.entries(selectedRoles)
      .filter(([, v]) => v)
      .map(([id]) => id);
  }

  function submit() {
    start(async () => {
      const roleIds = roleIdsFromSelection();
      if (editId) {
        const res = await updateUserAction({
          id: editId,
          email,
          name: name || undefined,
          password: password || undefined,
          roleIds,
          accountStatus,
        });
        if (!res.ok) {
          toast.error(res.error);
          return;
        }
        toast.success("Usuario actualizado");
      } else {
        if (password.length < 8) {
          toast.error("La contraseña debe tener al menos 8 caracteres");
          return;
        }
        const res = await createUserAction({
          email,
          name: name || undefined,
          password,
          roleIds,
        });
        if (!res.ok) {
          toast.error(res.error);
          return;
        }
        toast.success("Usuario creado (aprobado por defecto)");
      }
      setOpen(false);
      resetForm();
      router.refresh();
    });
  }

  function confirmDelete() {
    if (!deleteId) return;
    start(async () => {
      const res = await deleteUserAction({ id: deleteId });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Usuario eliminado");
      setDeleteId(null);
      router.refresh();
    });
  }

  function approve(id: string) {
    start(async () => {
      const res = await approveUserAction({ id });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Usuario aprobado");
      router.refresh();
    });
  }

  function reject(id: string) {
    start(async () => {
      const res = await rejectUserAction({ id });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Usuario rechazado");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex flex-wrap gap-2 rounded-lg border border-border/60 bg-muted/30 p-1"
          role="tablist"
          aria-label="Filtrar por estado"
        >
          {(
            [
              { key: "all", label: "Todos" },
              { key: "PENDING", label: "Pendientes" },
              { key: "APPROVED", label: "Aprobados" },
              { key: "REJECTED", label: "Rechazados" },
            ] as const
          ).map(({ key, label }) => (
            <Button
              key={key}
              type="button"
              variant={tab === key ? "default" : "ghost"}
              size="sm"
              className="h-9 gap-1.5 rounded-md px-3"
              onClick={() => setTab(key)}
            >
              {label}
              <span className="tabular-nums opacity-70">
                (
                {key === "all"
                  ? counts.all
                  : key === "PENDING"
                    ? counts.PENDING
                    : key === "APPROVED"
                      ? counts.APPROVED
                      : counts.REJECTED}
                )
              </span>
            </Button>
          ))}
        </div>
        <Button onClick={openCreate} size="sm" className="shrink-0 gap-1.5 shadow-sm">
          <Plus className="size-4" />
          Nuevo usuario
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Nombre</TableHead>
              <TableHead className="font-semibold">Roles</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="w-[200px] text-right font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No hay usuarios en esta vista.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id} className="group">
                  <TableCell className="max-w-[200px] truncate font-medium">{user.email}</TableCell>
                  <TableCell className="text-muted-foreground">{user.name ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.roles.map((r) => r.name).join(", ") || "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.accountStatus} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center justify-end gap-1">
                      {user.accountStatus === "PENDING" ? (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-9 border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                            disabled={pending}
                            title="Aprobar"
                            onClick={() => approve(user.id)}
                          >
                            <CheckCircle2 className="size-4" />
                          </Button>
                          {user.id !== currentUserId ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="size-9 border-destructive/40 text-destructive hover:bg-destructive/10"
                              disabled={pending}
                              title="Rechazar"
                              onClick={() => reject(user.id)}
                            >
                              <XCircle className="size-4" />
                            </Button>
                          ) : null}
                        </>
                      ) : null}
                      {user.accountStatus === "REJECTED" ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9 border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                          disabled={pending}
                          onClick={() => approve(user.id)}
                        >
                          Aprobar
                        </Button>
                      ) : null}
                      <Button variant="ghost" size="icon" className="size-9" onClick={() => openEdit(user)} title="Editar">
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(user.id)}
                        title="Eliminar"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label htmlFor="u-email">Email</Label>
              <Input
                id="u-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="u-name">Nombre</Label>
              <Input id="u-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {editId ? (
              <div className="space-y-2">
                <Label>Estado de la cuenta</Label>
                <Select value={accountStatus} onValueChange={(v) => setAccountStatus(v as AccountStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendiente de aprobación</SelectItem>
                    <SelectItem value="APPROVED">Aprobado (acceso al panel)</SelectItem>
                    <SelectItem value="REJECTED">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="u-password">{editId ? "Nueva contraseña (opcional)" : "Contraseña"}</Label>
              <Input
                id="u-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label>Roles</Label>
              <div className="space-y-2 rounded-md border border-border/60 p-3">
                {roles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Crea roles primero.</p>
                ) : (
                  roles.map((r) => (
                    <label key={r.id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={Boolean(selectedRoles[r.id])}
                        onCheckedChange={(c) => toggleRole(r.id, c === true)}
                      />
                      {r.name}
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={pending || !email.trim() || (!editId && password.length < 8)}
              onClick={() => submit()}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>Se borrarán también sus sesiones y cuentas vinculadas.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDelete()}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
