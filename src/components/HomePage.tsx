"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import HeroSection from "@/components/HeroSection";
import PromoCards from "@/components/PromoCards";
import ActivitiesSection from "@/components/ActivitiesSection";
import EventsSection from "@/components/EventsSection";
import CulturalAgenda from "@/components/CulturalAgenda";
import ConvocatoriasSection from "@/components/ConvocatoriasSection";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";
import { ChatPanel } from "@/components/ChatPanel";

export default function HomePage() {
  const [view, setView] = useState<"landing" | "chat">("landing");
  const [chatKey, setChatKey] = useState(0);
  const [initialMessage, setInitialMessage] = useState<string | undefined>();

  const openChat = (msg?: string) => {
    setChatKey((k) => k + 1);
    setInitialMessage(msg);
    setView("chat");
  };

  const closeChat = () => {
    setView("landing");
    setInitialMessage(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <m.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <HeroSection onChatMessage={(msg) => openChat(msg)} />
            <PromoCards />
            <ActivitiesSection />
            <EventsSection />
            <CulturalAgenda />
            <MapSection />
            <ConvocatoriasSection />
            <Footer />
          </m.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {view === "chat" ? (
          <ChatPanel key={chatKey} onClose={closeChat} initialMessage={initialMessage} />
        ) : null}
      </AnimatePresence>

      {view === "landing" && (
        <m.button
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          type="button"
          onClick={() => openChat(undefined)}
          className="fixed right-6 bottom-6 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
          aria-label="Abrir chat"
        >
          <MessageCircle className="size-6" />
        </m.button>
      )}
    </div>
  );
}
