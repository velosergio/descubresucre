"use client";

import * as m from "framer-motion/m";
import { AlertTriangle, Bot, Send, User, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Label } from "@/components/ui/label";
import { CHAT_SUGGESTIONS, CHAT_THINKING_PHRASES } from "@/lib/chat-suggestions";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  variant?: "error";
}

function ThinkingIndicator() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPhraseIndex((i) => (i + 1) % CHAT_THINKING_PHRASES.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3 rounded-2xl rounded-bl-md border border-border/60 bg-muted/50 px-4 py-3">
      <div className="flex h-4 items-end gap-0.5" aria-hidden>
        <span
          className="w-1 h-full origin-bottom rounded-full bg-primary motion-safe:animate-chat-wave"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-1 h-full origin-bottom rounded-full bg-secondary motion-safe:animate-chat-wave"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-1 h-full origin-bottom rounded-full bg-tropical-gold motion-safe:animate-chat-wave"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <span className="font-body text-sm text-muted-foreground" role="status">
        {CHAT_THINKING_PHRASES[phraseIndex]}
      </span>
    </div>
  );
}

interface ChatPanelProps {
  onClose: () => void;
  initialMessage?: string;
  /** El morph hacia este panel ya lo anima la View Transitions API; se omite la entrada de framer-motion. */
  viewTransition?: boolean;
}

const POLL_MAX_MS = 120_000;

async function pollJob(jobId: string): Promise<{ reply: string } | { error: string }> {
  const start = Date.now();
  let delay = 400;
  while (Date.now() - start < POLL_MAX_MS) {
    const r = await fetch(`/api/chat/job/${jobId}`);
    if (!r.ok) {
      const errorData: { error?: string } = await r.json().catch(() => ({}));
      return { error: errorData.error || `No se pudo consultar el estado (${r.status})` };
    }
    const data: { status?: string; reply?: string; error?: string } = await r.json();
    if (data.status === "DONE" && data.reply) return { reply: data.reply };
    if (data.status === "ERROR") return { error: data.error || "Error al procesar la respuesta" };
    await new Promise((res) => setTimeout(res, delay));
    delay = Math.min(Math.round(delay * 1.2), 2000);
  }
  return { error: "Tiempo de espera agotado. Intenta de nuevo." };
}

export function ChatPanel({ onClose, initialMessage, viewTransition = false }: ChatPanelProps) {
  const [sessionKey] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const processedInitial = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll when messages/loading change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessagesToApi = useCallback(
    async (payload: { role: "user" | "assistant"; content: string }[]) => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionKey,
            messages: payload,
          }),
        });

        if (!res.ok) {
          const errorData: { error?: string } = await res.json().catch(() => ({}));
          setMessages((p) => [
            ...p,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              variant: "error",
              content:
                errorData.error ||
                "No se pudo enviar el mensaje. Comprueba la configuración del asistente.",
            },
          ]);
          return;
        }

        const data: { jobId?: string; error?: string } = await res.json();

        if (!data.jobId) {
          setMessages((p) => [
            ...p,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              variant: "error",
              content:
                data.error ||
                "No se pudo enviar el mensaje. Comprueba la configuración del asistente.",
            },
          ]);
          return;
        }

        const outcome = await pollJob(data.jobId);
        if ("error" in outcome) {
          setMessages((p) => [
            ...p,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              variant: "error",
              content: outcome.error,
            },
          ]);
        } else {
          setMessages((p) => [
            ...p,
            { id: crypto.randomUUID(), role: "assistant", content: outcome.reply },
          ]);
        }
      } catch {
        setMessages((p) => [
          ...p,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            variant: "error",
            content: "Error de conexión. Vuelve a intentar en un momento.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionKey],
  );

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;
      setIsLoading(true);

      const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: trimmed };
      const next = [...messages, userMsg];
      setMessages(next);

      const payload = next.map((m) => ({ role: m.role, content: m.content }));
      void sendMessagesToApi(payload);
    },
    [isLoading, messages, sendMessagesToApi],
  );

  useEffect(() => {
    if (initialMessage && !processedInitial.current) {
      processedInitial.current = true;
      handleSend(initialMessage);
    }
  }, [initialMessage, handleSend]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = input;
    setInput("");
    handleSend(t);
  };

  const enterExitProps = viewTransition
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 16 },
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
      };

  return (
    <m.div
      {...enterExitProps}
      style={viewTransition ? { viewTransitionName: "chat-morph" } : undefined}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border/80 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <Bot className="size-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold tracking-tight md:text-xl">
              Guía Sucre
            </h2>
            <p className="text-xs text-muted-foreground md:text-sm">Asistente turístico</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Cerrar chat"
        >
          <X className="size-5" />
        </button>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 pb-4">
          {messages.length === 0 && !isLoading && (
            <div className="py-12 text-center">
              <Bot className="mx-auto mb-4 size-14 text-primary/80" />
              <p className="font-display text-lg font-semibold text-foreground">
                ¡Hola! Soy tu guía en Sucre
              </p>
              <p className="mx-auto mt-2 max-w-sm font-body text-sm text-muted-foreground">
                Pregúntame por playas, festivales, gastronomía o lo que quieras descubrir.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {CHAT_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSend(s)}
                    className="font-body rounded-full border border-border/80 bg-muted/40 px-4 py-2 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div
                  className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${
                    msg.variant === "error" ? "bg-tropical-coral/10" : "bg-primary/10"
                  }`}
                >
                  {msg.variant === "error" ? (
                    <AlertTriangle className="size-4 text-tropical-coral" />
                  ) : (
                    <Bot className="size-4 text-primary" />
                  )}
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm md:max-w-[75%] md:text-base ${
                  msg.role === "user"
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : msg.variant === "error"
                      ? "rounded-bl-md border border-tropical-coral/30 bg-tropical-coral/5 text-foreground shadow-sm"
                      : "rounded-bl-md border border-border/60 bg-card text-card-foreground shadow-sm"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="font-body whitespace-pre-wrap">{msg.content}</span>
                )}
              </div>
              {msg.role === "user" && (
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary/20">
                  <User className="size-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="size-4 text-primary" />
              </div>
              <ThinkingIndicator />
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-border/80 bg-background/95 px-4 py-4 backdrop-blur md:px-8">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl gap-2">
          <Label htmlFor="chat-panel-input" className="sr-only">
            Escribe tu pregunta
          </Label>
          <input
            id="chat-panel-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta…"
            disabled={isLoading}
            className="min-h-12 flex-1 rounded-xl border border-border/80 bg-muted/40 px-4 py-3 font-body text-sm text-foreground outline-none ring-primary/30 placeholder:text-muted-foreground focus:ring-2 md:text-base"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:opacity-45 hover:opacity-95"
            aria-label="Enviar mensaje"
          >
            <Send className="size-5" />
          </button>
        </form>
      </div>
    </m.div>
  );
}
