import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

const SUCRE_SYSTEM = `Eres un asistente turístico experto en el departamento de Sucre, Colombia. Respondes de manera amable, entusiasta y concisa sobre destinos, playas (Tolú, Coveñas, San Onofre, Islas de San Bernardo), gastronomía caribeña, festivales (Fiestas del 20 de Enero, Festival del Burro), cultura, naturaleza, manglares, y recomendaciones de viaje. Si no sabes algo, sugiere contactar la oficina de turismo de Sucre.`;

const ChatModal = ({ isOpen, onClose, initialMessage }: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const processedInitial = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Local AI simulation (replace with Lovable AI when Cloud is enabled)
    const responses: Record<string, string> = {
      playa: "🏖️ **Playas de Sucre**\n\nLas mejores playas del departamento incluyen:\n\n- **Tolú**: Playas tranquilas con atardeceres espectaculares\n- **Coveñas**: Arena blanca y aguas cristalinas, ideal para familias\n- **Islas de San Bernardo**: Un archipiélago paradisíaco con snorkel y buceo\n- **Rincón del Mar**: Playas vírgenes y ambiente relajado\n\n¡No olvides probar la cocada y el agua de coco fresco! 🥥",
      festival: "🎉 **Festivales de Sucre**\n\n- **Fiestas del 20 de Enero** (Sincelejo): Corralejas y desfiles tradicionales\n- **Festival del Frito** (Sincelejo): Gastronomía típica\n- **Festival Nacional del Porro** (San Pelayo): Música y danza\n- **Semana Santa en Sucre**: Procesiones y tradiciones religiosas\n\nCada festival celebra la riqueza cultural del Caribe colombiano 🇨🇴",
      comer: "🍽️ **Gastronomía de Sucre**\n\n- **Arroz de coco con pescado frito**: El plato estrella\n- **Mote de queso**: Sopa tradicional con ñame y queso costeño\n- **Patacones**: Acompañamiento imprescindible\n- **Cóctel de camarones**: Fresco y delicioso en Tolú\n- **Dulces típicos**: Cocada, enyucado, caballito\n\nRestaurantes recomendados en Tolú: La Bonga, Donde Fidel 🐟",
      cultura: "🎭 **Cultura de Sucre**\n\n- **Artesanías Zenú**: La tradición indígena del sombrero vueltiao\n- **Música de gaitas y porros**: Patrimonio musical del Caribe\n- **Catedral de Sincelejo**: Arquitectura colonial\n- **Museo Antropológico**: Historia precolombina\n- **Hamacas de San Jacinto**: Artesanía reconocida mundialmente\n\nSucre es cuna de tradiciones ancestrales vivas 🌺",
    };

    await new Promise((r) => setTimeout(r, 1200));

    const lower = text.toLowerCase();
    let response = "🌴 ¡Excelente pregunta! Sucre es un departamento lleno de maravillas. Tiene playas paradisíacas en el Golfo de Morrosquillo, una gastronomía caribeña increíble, festivales llenos de color y música, y una cultura ancestral fascinante.\n\n¿Te gustaría saber más sobre algún tema en particular? Puedo contarte sobre playas, gastronomía, festivales o cultura. 😊";

    for (const [key, val] of Object.entries(responses)) {
      if (lower.includes(key)) {
        response = val;
        break;
      }
    }

    setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    setIsLoading(false);
  }, [isLoading]);

  useEffect(() => {
    if (isOpen && initialMessage && !processedInitial.current) {
      processedInitial.current = true;
      handleSend(initialMessage);
    }
    if (!isOpen) {
      processedInitial.current = false;
    }
  }, [isOpen, initialMessage, handleSend]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">Guía Sucre</h3>
                  <p className="text-xs text-primary-foreground/70">Tu asistente turístico</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Bot className="w-12 h-12 mx-auto mb-3 text-primary" />
                  <p className="font-body">¡Hola! Soy tu guía turístico de Sucre.</p>
                  <p className="text-sm mt-1">Pregúntame lo que quieras 🌴</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-[80%] font-body text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-secondary" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 bg-transparent outline-none px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-primary text-primary-foreground rounded-lg p-2 disabled:opacity-50 transition-colors hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;
