"use client";

import * as m from "framer-motion/m";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useTransition } from "react";
import { AddToCalendarButton } from "@/components/cultural-events/add-to-calendar-button";
import { EventCard } from "@/components/cultural-events/event-card";
import { Button } from "@/components/ui/button";
import type { CulturalEventsHomePayload } from "@/lib/get-cultural-events-home";
import { formatMonthLabel } from "@/lib/month-range";
import { EXPO_OUT } from "@/lib/motion";

function addMonths(year: number, month: number, delta: number) {
  const zeroBased = month - 1 + delta;
  const nextYear = year + Math.floor(zeroBased / 12);
  const nextMonth = ((zeroBased % 12) + 12) % 12;
  return { year: nextYear, month: nextMonth + 1 };
}

export function MonthNavigator({ initialPayload }: { initialPayload: CulturalEventsHomePayload }) {
  const [payload, setPayload] = useState(initialPayload);
  const [pending, startTransition] = useTransition();

  function goToMonth(year: number, month: number) {
    startTransition(async () => {
      const mes = `${year}-${String(month).padStart(2, "0")}`;
      const res = await fetch(`/api/cultural-events?mes=${mes}`);
      if (!res.ok) return;
      const data = (await res.json()) as CulturalEventsHomePayload;
      setPayload(data);
    });
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-center gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={pending}
          aria-label="Mes anterior"
          onClick={() => {
            const { year, month } = addMonths(payload.year, payload.month, -1);
            goToMonth(year, month);
          }}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="min-w-[10rem] text-center font-body text-lg font-semibold capitalize">
          {formatMonthLabel(payload.year, payload.month)}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={pending}
          aria-label="Mes siguiente"
          onClick={() => {
            const { year, month } = addMonths(payload.year, payload.month, 1);
            goToMonth(year, month);
          }}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {payload.events.length === 0 ? (
        <p className="text-center font-body text-muted-foreground">
          No hay eventos programados para este mes.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {payload.events.map((event, i) => (
            <m.div
              key={event.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: EXPO_OUT }}
            >
              <EventCard event={event} actions={<AddToCalendarButton event={event} />} />
            </m.div>
          ))}
        </div>
      )}
    </div>
  );
}
