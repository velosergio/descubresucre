"use client";

import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import { ArrowDown, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import ActivitiesSection from "@/components/ActivitiesSection";
import { ChatPanel } from "@/components/ChatPanel";
import ConvocatoriasSection from "@/components/ConvocatoriasSection";
import CulturalEventsSection from "@/components/CulturalEventsSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ImperdiblesSection from "@/components/ImperdiblesSection";
import MapSection from "@/components/MapSection";
import ScrollProgressRail from "@/components/ScrollProgressRail";
import type { CulturalEventsHomePayload } from "@/lib/get-cultural-events-home";
import type { QueHacerHomePayload } from "@/lib/get-que-hacer-home";
import type { ResolvedHeroConfig } from "@/lib/hero-appearance";
import type { ImperdiblesHomePayload } from "@/lib/imperdibles-public";

const CHAT_INTRO_SEEN_KEY = "sucre-vivo:chat-intro-seen";
const CHAT_INTRO_SHOW_DELAY_MS = 2200;
const CHAT_INTRO_AUTO_HIDE_MS = 6000;

export default function HomePage({
  heroConfig,
  imperdiblesPayload,
  queHacerPayload,
  culturalEventsPayload,
  mapsApiKey,
}: {
  heroConfig: ResolvedHeroConfig;
  imperdiblesPayload: ImperdiblesHomePayload;
  queHacerPayload: QueHacerHomePayload;
  culturalEventsPayload: CulturalEventsHomePayload;
  mapsApiKey: string | null;
}) {
  const [view, setView] = useState<"landing" | "chat">("landing");
  const [chatKey, setChatKey] = useState(0);
  const [initialMessage, setInitialMessage] = useState<string | undefined>();
  const [showChatIntro, setShowChatIntro] = useState(false);
  const [morphEnabled, setMorphEnabled] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined" || !("startViewTransition" in document)) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMorphEnabled(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const dismissChatIntro = () => {
    setShowChatIntro(false);
    try {
      localStorage.setItem(CHAT_INTRO_SEEN_KEY, "1");
    } catch {
      // almacenamiento no disponible (modo privado, cookies bloqueadas): no es crítico
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: dismissChatIntro is stable across renders
  useEffect(() => {
    if (view !== "landing") return;
    let alreadySeen = true;
    try {
      alreadySeen = localStorage.getItem(CHAT_INTRO_SEEN_KEY) === "1";
    } catch {
      alreadySeen = true;
    }
    if (alreadySeen) return;

    const showId = window.setTimeout(() => setShowChatIntro(true), CHAT_INTRO_SHOW_DELAY_MS);
    const hideId = window.setTimeout(
      dismissChatIntro,
      CHAT_INTRO_SHOW_DELAY_MS + CHAT_INTRO_AUTO_HIDE_MS,
    );
    return () => {
      window.clearTimeout(showId);
      window.clearTimeout(hideId);
    };
  }, [view]);

  const runStateChange = (applyState: () => void) => {
    if (!morphEnabled) {
      applyState();
      return;
    }
    // El navegador puede rechazar la transición (p. ej. pestaña oculta); el cambio de estado ya ocurrió vía flushSync.
    document.startViewTransition(() => flushSync(applyState)).ready.catch(() => {});
  };

  const openChat = (msg?: string) => {
    runStateChange(() => {
      setChatKey((k) => k + 1);
      setInitialMessage(msg);
      setView("chat");
      dismissChatIntro();
    });
  };

  const closeChat = () => {
    runStateChange(() => {
      setView("landing");
      setInitialMessage(undefined);
    });
  };

  const landingContent = (
    <>
      <HeroSection onChatMessage={(msg) => openChat(msg)} heroConfig={heroConfig} />
      <ImperdiblesSection payload={imperdiblesPayload} />
      <ActivitiesSection payload={queHacerPayload} />
      <CulturalEventsSection payload={culturalEventsPayload} />
      <MapSection mapsApiKey={mapsApiKey} />
      <ConvocatoriasSection />
      <Footer />
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {view === "landing" && <ScrollProgressRail />}

      {morphEnabled ? (
        <>
          {view === "landing" ? <div>{landingContent}</div> : null}
          {view === "chat" ? (
            <ChatPanel
              key={chatKey}
              onClose={closeChat}
              initialMessage={initialMessage}
              viewTransition
            />
          ) : null}
        </>
      ) : (
        <>
          <AnimatePresence mode="wait">
            {view === "landing" ? (
              <m.div
                key="landing"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              >
                {landingContent}
              </m.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {view === "chat" ? (
              <ChatPanel key={chatKey} onClose={closeChat} initialMessage={initialMessage} />
            ) : null}
          </AnimatePresence>
        </>
      )}

      <AnimatePresence>
        {view === "landing" && showChatIntro && (
          <m.div
            key="chat-intro"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            role="status"
            className="fixed right-4 bottom-24 z-40 max-w-56 rounded-2xl bg-foreground px-4 py-3 text-primary-foreground shadow-xl"
          >
            <button
              type="button"
              onClick={dismissChatIntro}
              aria-label="Cerrar sugerencia"
              className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-background text-foreground shadow ring-1 ring-border transition-colors hover:bg-muted"
            >
              <X className="size-3.5" />
            </button>
            <p className="font-body text-sm">
              ¿Buscas algo? Pregúntale a nuestro guía{" "}
              <ArrowDown className="inline size-3.5 shrink-0 align-[-2px]" aria-hidden />
            </p>
            <div
              aria-hidden
              className="absolute right-8 -bottom-1.5 size-3 rotate-45 bg-foreground"
            />
          </m.div>
        )}
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
