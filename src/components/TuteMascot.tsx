import Image from "next/image";
import { cn } from "@/lib/utils";

// Proporciones del viewBox recortado de cada SVG en public/brand.
const VARIANTS = {
  tute: { src: "/brand/tute.svg", width: 961, height: 935, alt: "Tute, mascota de Sucre Vivo" },
  logo: { src: "/brand/logo-sucre-vivo-tute.svg", width: 1880, height: 912, alt: "Sucre Vivo" },
  "logo-white": {
    src: "/brand/logo-sucre-vivo-tute-white.svg",
    width: 1880,
    height: 912,
    alt: "Sucre Vivo",
  },
} as const;

type TuteMascotProps = {
  variant: keyof typeof VARIANTS;
  /** La altura se fija por clase (p. ej. `h-40`); el ancho sigue la proporción. */
  className?: string;
  priority?: boolean;
};

/** Tute, la mascota de Sucre Vivo, sola o dentro del logo de la plataforma. */
export default function TuteMascot({ variant, className, priority }: TuteMascotProps) {
  const { src, width, height, alt } = VARIANTS[variant];
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt={alt}
      unoptimized
      priority={priority}
      className={cn("w-auto", className)}
    />
  );
}
