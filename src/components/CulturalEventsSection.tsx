"use client";

import * as m from "framer-motion/m";
import { MonthNavigator } from "@/components/cultural-events/month-navigator";
import type { CulturalEventsHomePayload } from "@/lib/get-cultural-events-home";
import { EXPO_OUT } from "@/lib/motion";

export default function CulturalEventsSection({ payload }: { payload: CulturalEventsHomePayload }) {
  return (
    <section id="agenda-cultural" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EXPO_OUT }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Próximos <span className="text-tropical-coral">Eventos</span> y Agenda Cultural
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Descubre los eventos y actividades culturales de Sucre y agrégalos a tu calendario
          </p>
        </m.div>

        <MonthNavigator initialPayload={payload} />
      </div>
    </section>
  );
}
