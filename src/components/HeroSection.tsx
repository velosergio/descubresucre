import { useState } from "react";
import { Send, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-sucre.jpg";

interface HeroSectionProps {
  onChatMessage: (msg: string) => void;
}

const HeroSection = ({ onChatMessage }: HeroSectionProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onChatMessage(input.trim());
    setInput("");
  };

  const suggestions = [
    "¿Qué playas visitar en Sucre?",
    "Festivales culturales este mes",
    "¿Dónde comer en Tolú?",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={heroImg}
        alt="Vista aérea del departamento de Sucre, Colombia"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 gradient-hero" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-6">
            <MapPin className="w-4 h-4 text-tropical-gold" />
            <span className="text-primary-foreground/90 text-sm font-body font-medium">
              Departamento de Sucre, Colombia
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-primary-foreground leading-tight mb-6">
            Descubre la magia de{" "}
            <span className="text-tropical-gold">Sucre</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 font-body max-w-2xl mx-auto mb-10">
            Playas paradisíacas, cultura vibrante y sabores inolvidables te
            esperan. Pregúntale a nuestro asistente todo lo que quieras saber.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative max-w-2xl mx-auto mb-6"
        >
          <div className="glass-input rounded-2xl flex items-center gap-2 p-2">
            <Sparkles className="w-5 h-5 text-tropical-gold ml-3 shrink-0" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="¿Qué te gustaría descubrir sobre Sucre?"
              className="flex-1 bg-transparent text-primary-foreground placeholder:text-primary-foreground/50 outline-none py-3 px-2 font-body"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl p-3 transition-colors shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onChatMessage(s)}
              className="text-sm text-primary-foreground/70 hover:text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-sm rounded-full px-4 py-2 transition-all font-body"
            >
              {s}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
