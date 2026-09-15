import Image from "next/image";
import { toServedMediaUrl } from "@/lib/media-url";

type Props = {
  src: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
};

export function PolaroidImage({ src, alt, priority = false, className }: Props) {
  const served = src ? toServedMediaUrl(src) : null;
  return (
    <figure className={`sn-polaroid ${className ?? ""}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[hsl(var(--sn-paper))]">
        {served ? (
          <Image
            src={served}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
            priority={priority}
            unoptimized
          />
        ) : (
          <div
            className="flex h-full min-h-[10rem] items-center justify-center px-4 text-center font-body text-sm text-[hsl(var(--sn-ink)/0.55)]"
            role="img"
            aria-label={alt}
          >
            {alt}
          </div>
        )}
      </div>
    </figure>
  );
}
