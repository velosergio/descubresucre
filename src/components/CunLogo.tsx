import Image from "next/image";
import { cn } from "@/lib/utils";

// Proporciones del viewBox recortado de cada SVG en public/brand.
const VARIANTS = {
  logo: { src: "/brand/logo-cun.svg", width: 1600, height: 995 },
  "logo-white": { src: "/brand/logo-cun-white.svg", width: 1600, height: 995 },
  isotipo: { src: "/brand/isotipo-cun.svg", width: 1880, height: 566 },
  "isotipo-white": { src: "/brand/isotipo-cun-white.svg", width: 1880, height: 566 },
} as const;

type CunLogoProps = {
  variant: keyof typeof VARIANTS;
  /** La altura se fija por clase (p. ej. `h-12`); el ancho sigue la proporción. */
  className?: string;
  priority?: boolean;
};

/** Logo de la Corporación Unificada Nacional de Educación Superior (CUN). */
export default function CunLogo({ variant, className, priority }: CunLogoProps) {
  const { src, width, height } = VARIANTS[variant];
  return (
    <Image
      src={src}
      width={width}
      height={height}
      alt="CUN · Corporación Unificada Nacional de Educación Superior"
      unoptimized
      priority={priority}
      className={cn("w-auto", className)}
    />
  );
}
