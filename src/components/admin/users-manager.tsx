"use client";

import { type Dispatch, useMemo, useReducer, useState, useTransition } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

type AccountStatus = "PENDING" | "APPROVED" | "REJECTED";
type UserTab = "all" | AccountStatus;

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

interface UserFormState {
  editId: string | null;
  email: string;
  name: string;
  password: string;
  accountStatus: AccountStatus;
  selectedRoles: Record<string, boolean>;
}

type UserFormAction =
  | { type: "reset" }
  | { type: "setEmail"; value: string }
  | { type: "setName"; value: string }
  | { type: "setPassword"; value: string }
  | { type: "setAccountStatus"; value: AccountStatus }
  | { type: "setRole"; roleId: string; checked: boolean }
  | {
      type: "loadForEdit";
      payload: {
        id: string;
        email: string;
        name: string;
        accountStatus: AccountStatus;
        selectedRoles: Record<string, boolean>;
      };
    };

const INITIAL_FORM: UserFormState = {
  editId: null,
  email: "",
  name: "",
  password: "",
  accountStatus: "APPROVED",
  selectedRoles: {},
};

function userFormReducer(state: UserFormState, action: UserFormAction): UserFormState {
  switch (action.type) {
    case "reset":
      return INITIAL_FORM;
    case "setEmail":
      return { ...state, email: action.value };
    case "setName":
      return { ...state, name: action.value };
    case "setPassword":
      return { ...state, password: action.value };
    case "setAccountStatus":
      return { ...state, accountStatus: action.value };
    case "setRole":
      return {
        ...state,
        selectedRoles: { ...state.selectedRoles, [action.roleId]: action.checked },
      };
    case "loadForEdit":
      return {
        editId: action.payload.id,
        email: action.payload.email,
        name: action.payload.name,
        password: "",
        accountStatus: action.payload.accountStatus,
        selectedRoles: action.payload.selectedRoles,
      };
    default:
      return state;
  }
}

function StatusBadge({ status }: { status: AccountStatus }) {
  if (status === "PENDING") {
    return (
      <Badge variant="secondary" className="border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
        Pendiente
      </Badge>
    );
  }
  if (status === "REJECTED") return <Badge variant="destructive">Rechazado</Badge>;
  return (
    <Badge className="border-transparent bg-emerald-600 text-white hover:bg-emerald-600/90 dark:bg-emerald-600">
      Aprobado
    </Badge>
  );
}

function UserStatusTabs({
  tab,
  counts,
  onChange,
  onCreate,
}: {
  tab: UserTab;
  counts: { all: number; PENDING: number; APPROVED: number; REJECTED: number };
  onChange: (tab: UserTab) => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2 rounded-lg border border-border/60 bg-muted/30 p-1" role="tablist" aria-label="Filtrar por estado">
        {[
          { key: "all" as const, label: "Todos", count: counts.all },
          { key: "PENDING" as const, label: "Pendientes", count: counts.PENDING },
          { key: "APPROVED" as const, label: "Aprobados", count: counts.APPROVED },
          { key: "REJECTED" as const, label: "Rechazados", count: counts.REJECTED },
        ].map(({ key, label, count }) => (
          <Button
            key={key}
            type="button"
            variant={tab === key ? "default" : "ghost"}
            size="sm"
            className="h-9 gap-1.5 rounded-md px-3"
            onClick={() => onChange(key)}
          >
            {label}
            <span className="tabular-nums opacity-70">({count})</span>
          </Button>
        ))}
      </div>
      <Button onClick={onCreate} size="sm" className="w-full gap-1.5 shadow-sm sm:w-auto sm:shrink-0">
        <Plus className="size-4" />
        Nuevo usuario
      </Button>
    </div>
  );
}

function UsersTable({
  users,
  currentUserId,
  pending,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}: {
  users: UserRow[];
  currentUserId: string;
  pending: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEdit: (user: UserRow) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-3 md:hidden">
        {users.length === 0 ? (
          <div className="rounded-xl border border-border/80 bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
            No hay usuarios en esta vista.
          </div>
        ) : (
          users.map((user) => (
            <article key={user.id} className="space-y-3 rounded-xl border border-border/80 bg-card p-4 shadow-sm">
              <div className="space-y-2">
                <p className="truncate font-medium">{user.email}</p>
                <p className="text-sm text-muted-foreground">{user.name ?? "—"}</p>
                <p className="text-sm text-muted-foreground">{user.roles.map((r) => r.name).join(", ") || "—"}</p>
                <StatusBadge status={user.accountStatus} />
              </div>
              <div className="flex flex-wrap gap-2">
                {user.accountStatus === "PENDING" ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                      disabled={pending}
                      onClick={() => onApprove(user.id)}
                    >
                      <CheckCircle2 className="mr-1 size-4" />
                      Aprobar
                    </Button>
                    {user.id !== currentUserId ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 border-destructive/40 text-destructive hover:bg-destructive/10"
                        disabled={pending}
                        onClick={() => onReject(user.id)}
                      >
                        <XCircle className="mr-1 size-4" />
                        Rechazar
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
                    onClick={() => onApprove(user.id)}
                  >
                    <CheckCircle2 className="mr-1 size-4" />
                    Aprobar
                  </Button>
                ) : null}
                <Button variant="outline" size="sm" className="h-9" onClick={() => onEdit(user)}>
                  <Pencil className="mr-1 size-4" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="h-9 text-destructive hover:text-destructive" onClick={() => onDelete(user.id)}>
                  <Trash2 className="mr-1 size-4" />
                  Eliminar
                </Button>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm md:block">
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
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No hay usuarios en esta vista.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="group">
                  <TableCell className="max-w-[200px] truncate font-medium">{user.email}</TableCell>
                  <TableCell className="text-muted-foreground">{user.name ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.roles.map((r) => r.name).join(", ") || "—"}</TableCell>
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
                            onClick={() => onApprove(user.id)}
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
                              onClick={() => onReject(user.id)}
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
                          onClick={() => onApprove(user.id)}
                        >
                          Aprobar
                        </Button>
                      ) : null}
                      <Button variant="ghost" size="icon" className="size-9" onClick={() => onEdit(user)} title="Editar">
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 text-destructive hover:text-destructive"
                        onClick={() => onDelete(user.id)}
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
    </div>
  );
}

function UserFormDialog({
  open,
  onOpenChange,
  form,
  roles,
  pending,
  onSubmit,
  dispatch,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UserFormState;
  roles: RoleOption[];
  pending: boolean;
  onSubmit: () => void;
  dispatch: Dispatch<UserFormAction>;
}) {
  const isEdit = Boolean(form.editId);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
          <DialogDescription>Configura datos de acceso, estado y roles del usuario.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2">
            <Label htmlFor="u-email">Email</Label>
            <Input
              id="u-email"
              type="email"
              value={form.email}
              onChange={(e) => dispatch({ type: "setEmail", value: e.target.value })}
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="u-name">Nombre</Label>
            <Input id="u-name" value={form.name} onChange={(e) => dispatch({ type: "setName", value: e.target.value })} />
          </div>
          {isEdit ? (
            <div className="space-y-2">
              <Label>Estado de la cuenta</Label>
              <Select value={form.accountStatus} onValueChange={(v) => dispatch({ type: "setAccountStatus", value: v as AccountStatus })}>
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
            <Label htmlFor="u-password">{isEdit ? "Nueva contraseña (opcional)" : "Contraseña"}</Label>
            <Input
              id="u-password"
              type="password"
              value={form.password}
              onChange={(e) => dispatch({ type: "setPassword", value: e.target.value })}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label>Roles</Label>
            <div className="space-y-2 rounded-md border border-border/60 p-3">
              {roles.length === 0 ? (
                <p className="text-sm text-muted-foreground">Crea roles primero.</p>
              ) : (
                roles.map((role) => (
                  <label key={role.id} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={Boolean(form.selectedRoles[role.id])}
                      onCheckedChange={(checked) => dispatch({ type: "setRole", roleId: role.id, checked: checked === true })}
                    />
                    {role.name}
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={pending || !form.email.trim() || (!isEdit && form.password.length < 8)} onClick={onSubmit}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
  const [tab, setTab] = useState<UserTab>("all");
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, dispatch] = useReducer(userFormReducer, INITIAL_FORM);
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

  const filtered = useMemo(() => (tab === "all" ? users : users.filter((u) => u.accountStatus === tab)), [users, tab]);

  function openCreate() {
    dispatch({ type: "reset" });
    setOpen(true);
  }

  function openEdit(user: UserRow) {
    const selectedRoles: Record<string, boolean> = {};
    for (const role of roles) selectedRoles[role.id] = user.roles.some((x) => x.id === role.id);
    dispatch({
      type: "loadForEdit",
      payload: {
        id: user.id,
        email: user.email,
        name: user.name ?? "",
        accountStatus: user.accountStatus,
        selectedRoles,
      },
    });
    setOpen(true);
  }

  function getSelectedRoleIds() {
    return Object.entries(form.selectedRoles)
      .filter(([, checked]) => checked)
      .map(([id]) => id);
  }

  function submit() {
    start(async () => {
      const roleIds = getSelectedRoleIds();
      if (form.editId) {
        const res = await updateUserAction({
          id: form.editId,
          email: form.email,
          name: form.name || undefined,
          password: form.password || undefined,
          roleIds,
          accountStatus: form.accountStatus,
        });
        if (!res.ok) {
          toast.error(res.error);
          return;
        }
        toast.success("Usuario actualizado");
      } else {
        if (form.password.length < 8) {
          toast.error("La contraseña debe tener al menos 8 caracteres");
          return;
        }
        const res = await createUserAction({
          email: form.email,
          name: form.name || undefined,
          password: form.password,
          roleIds,
        });
        if (!res.ok) {
          toast.error(res.error);
          return;
        }
        toast.success("Usuario creado (aprobado por defecto)");
      }
      setOpen(false);
      dispatch({ type: "reset" });
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

  return (
    <div className="space-y-6">
      <UserStatusTabs tab={tab} counts={counts} onChange={setTab} onCreate={openCreate} />

      <UsersTable
        users={filtered}
        currentUserId={currentUserId}
        pending={pending}
        onApprove={approve}
        onReject={reject}
        onEdit={openEdit}
        onDelete={setDeleteId}
      />

      <UserFormDialog open={open} onOpenChange={setOpen} form={form} roles={roles} pending={pending} onSubmit={submit} dispatch={dispatch} />

      <AlertDialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>Se borrarán también sus sesiones y cuentas vinculadas.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
