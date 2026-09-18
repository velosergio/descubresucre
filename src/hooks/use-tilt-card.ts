import { useCallback, useRef } from "react";

const MAX_TILT_DEG = 8;
const RETURN_TRANSITION = "650ms cubic-bezier(0.16, 1.4, 0.3, 1)";

/** Inclinación 3D magnética atada al cursor, con retorno tipo resorte al salir. */
export function useTiltCard<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const frame = useRef<number | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * MAX_TILT_DEG * 2;
    const rotateX = (0.5 - py) * MAX_TILT_DEG * 2;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--tilt-rx", `${rotateX.toFixed(2)}deg`);
      el.style.setProperty("--tilt-ry", `${rotateY.toFixed(2)}deg`);
      el.style.setProperty("--tilt-tz", "18px");
      el.style.setProperty("--tilt-transition", "70ms linear");
      el.style.setProperty("--tilt-shadow-x", `${(-rotateY * 1.4).toFixed(1)}px`);
      el.style.setProperty("--tilt-shadow-y", `${(rotateX * 1.4 + 22).toFixed(1)}px`);
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    el.style.setProperty("--tilt-rx", "0deg");
    el.style.setProperty("--tilt-ry", "0deg");
    el.style.setProperty("--tilt-tz", "0px");
    el.style.setProperty("--tilt-transition", RETURN_TRANSITION);
    el.style.setProperty("--tilt-shadow-x", "0px");
    el.style.setProperty("--tilt-shadow-y", "14px");
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
