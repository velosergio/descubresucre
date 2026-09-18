"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TableRowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex gap-1">
      <Button type="button" variant="ghost" size="icon" onClick={onEdit} aria-label="Editar">
        <Pencil className="size-4" />
      </Button>
      <Button type="button" variant="ghost" size="icon" onClick={onDelete} aria-label="Eliminar">
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </div>
  );
}
