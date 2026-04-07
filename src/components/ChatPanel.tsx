"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Bot, User } from "lucide-react";
import * as m from "framer-motion/m";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  onClose: () => void;
  initialMessage?: string;
}

const POLL_MAX_MS = 120_000;

async function pollJob(jobId: string): Promise<{ reply: string } | { error: string }> {
  const start = Date.now();
  let delay = 400;
  while (Date.now() - start < POLL_MAX_MS) {
    const r = await fetch(`/api/chat/job/${jobId}`);
    const data: { status?: string; reply?: string; error?: string } = await r.json();
    if (data.status === "DONE" && data.reply) return { reply: data.reply };
    if (data.status === "ERROR") return { error: data.error || "Error al procesar la respuesta" };
    await new Promise((res) => setTimeout(res, delay));
    delay = Math.min(Math.round(delay * 1.2), 2000);
  }
  return { error: "Tiempo de espera agotado. Intenta de nuevo." };
}

export function ChatPanel({ onClose, initialMessage }: ChatPanelProps) {
  const sessionKeyRef = useRef(crypto.randomUUID());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const processedInitial = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessagesToApi = useCallback(async (payload: { role: "user" | "assistant"; content: string }[]) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionKey: sessionKeyRef.current,
          messages: payload,
        }),
      });
      const data: { jobId?: string; error?: string } = await res.json();

      if (!data.jobId) {
        setMessages((p) => [
          ...p,
          {
            id: crypto.randomUUID(),
            role: "assistant",
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
          { id: crypto.randomUUID(), role: "assistant", content: `⚠️ ${outcome.error}` },
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
          content: "Error de conexión. Vuelve a intentar en un momento.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;
      setIsLoading(true);

      const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: trimmed };
      setMessages((prev) => {
        const next = [...prev, userMsg];
        const payload = next.map((m) => ({ role: m.role, content: m.content }));
        void sendMessagesToApi(payload);
        return next;
      });
    },
    [isLoading, sendMessagesToApi],
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

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border/80 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
            <Bot className="size-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold tracking-tight md:text-xl">Guía Sucre</h2>
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

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-4 pb-4">
          {messages.length === 0 && !isLoading && (
            <div className="py-12 text-center text-muted-foreground">
              <Bot className="mx-auto mb-4 size-14 text-primary/80" />
              <p className="font-body text-base">¿Qué te gustaría descubrir sobre Sucre?</p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="size-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm md:max-w-[75%] md:text-base ${
                  msg.role === "user"
                    ? "rounded-br-md bg-primary text-primary-foreground"
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
              <div className="rounded-2xl rounded-bl-md border border-border/60 bg-muted/50 px-4 py-3">
                <div className="flex gap-1">
                  <span
                    className="size-2 rounded-full bg-muted-foreground/40 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="size-2 rounded-full bg-muted-foreground/40 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="size-2 rounded-full bg-muted-foreground/40 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-border/80 bg-background/95 px-4 py-4 backdrop-blur md:px-8">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl gap-2">
          <input
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
            aria-label="Enviar"
          >
            <Send className="size-5" />
          </button>
        </form>
      </div>
    </m.div>
  );
}
