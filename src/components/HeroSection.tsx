"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Send, MapPin, Sparkles } from "lucide-react";
import * as m from "framer-motion/m";
import heroImg from "@/assets/hero-sucre.jpg";
import type { ResolvedHeroConfig } from "@/lib/hero-appearance";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  onChatMessage: (msg: string) => void;
  heroConfig: ResolvedHeroConfig;
}

function slideImage(src: string, alt: string, priority: boolean, extra?: string) {
  const isRemoteHttps = /^https:\/\//i.test(src);
  const isLocalUpload = src.startsWith("/uploads/");
  if (isRemoteHttps || src.startsWith("http://localhost") || src.startsWith("http://127.0.0.1")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- URLs HTTPS arbitrarias del admin
      <img src={src} alt={alt} className={cn("absolute inset-0 size-full object-cover", extra)} />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn("object-cover", extra)}
      sizes="100vw"
      priority={priority}
      quality={priority ? 85 : 78}
      unoptimized={isLocalUpload}
    />
  );
}

const HeroBackground = ({ config }: { config: ResolvedHeroConfig }) => {
  const [videoDead, setVideoDead] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    if (config.mode !== "CAROUSEL" || !carouselApi) return;
    const id = window.setInterval(() => {
      carouselApi.scrollNext();
    }, 6000);
    return () => window.clearInterval(id);
  }, [carouselApi, config.mode]);

  if (config.mode === "IMAGE_DEFAULT" || (config.mode === "VIDEO" && videoDead)) {
    return (
      <Image
        src={heroImg}
        alt="Vista aérea del departamento de Sucre, Colombia"
        fill
        className="object-cover"
        sizes="100vw"
        priority
        quality={85}
      />
    );
  }

  if (config.mode === "IMAGE_CUSTOM") {
    return slideImage(config.imageUrl, "Banner Sucre Vivo", true);
  }

  if (config.mode === "VIDEO") {
    return (
      <video
        className="absolute inset-0 size-full object-cover"
        src={config.videoUrl}
        autoPlay
        muted
        playsInline
        loop
        onError={() => setVideoDead(true)}
      />
    );
  }

  if (config.mode === "CAROUSEL") {
    return (
      <Carousel opts={{ loop: true, align: "start" }} className="h-full w-full" setApi={setCarouselApi}>
        <CarouselContent className="-ml-0 ml-0 h-screen">
          {config.slides.map((s, i) => (
            <CarouselItem key={`${s.url}-${i}`} className="basis-full pl-0">
              <div className="relative min-h-screen w-full">
                {slideImage(s.url, s.alt ?? "Sucre", i === 0)}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    );
  }

  return (
    <Image
      src={heroImg}
      alt="Vista aérea del departamento de Sucre, Colombia"
      fill
      className="object-cover"
      sizes="100vw"
      priority
      quality={85}
    />
  );
};

const HeroSection = ({ onChatMessage, heroConfig }: HeroSectionProps) => {
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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <HeroBackground config={heroConfig} />
      </div>
      <div className="gradient-hero absolute inset-0 z-[1]" />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary/20 px-4 py-2 backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-tropical-gold" />
            <span className="font-body text-sm font-medium text-primary-foreground/90">
              Departamento de Sucre, Colombia
            </span>
          </div>

          <h1 className="font-display mb-6 text-4xl leading-tight font-bold text-primary-foreground sm:text-5xl md:text-7xl">
            Descubre la magia de <span className="text-tropical-gold">Sucre</span>
          </h1>

          <p className="font-body mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
            Playas paradisíacas, cultura vibrante y sabores inolvidables te esperan. Pregúntale a nuestro asistente todo lo que quieras
            saber.
          </p>
        </m.div>

        <m.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mx-auto mb-6 max-w-2xl"
        >
          <div className="glass-input flex items-center gap-2 rounded-2xl p-2">
            <Sparkles className="ml-3 h-5 w-5 shrink-0 text-tropical-gold" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="¿Qué te gustaría descubrir sobre Sucre?"
              className="font-body flex-1 bg-transparent px-2 py-3 text-primary-foreground outline-none placeholder:text-primary-foreground/50"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-primary p-3 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </m.form>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChatMessage(s)}
              className="font-body rounded-full bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground/70 backdrop-blur-sm transition-all hover:bg-primary-foreground/20 hover:text-primary-foreground"
            >
              {s}
            </button>
          ))}
        </m.div>
      </div>
    </section>
  );
};

export default HeroSection;
