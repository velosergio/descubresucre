let loadPromise: Promise<void> | null = null;

const CALLBACK_NAME = "__descubresucreGoogleMapsInit";
const LOAD_TIMEOUT_MS = 20_000;
const SCRIPT_SELECTOR =
  'script[data-google-maps="true"], script[src*="maps.googleapis.com/maps/api/js"]';

type MapsWindow = Window & {
  __descubresucreGoogleMapsInit?: () => void;
  gm_authFailure?: () => void;
};

/** Motivo del fallo: red/script bloqueado, tiempo agotado o clave rechazada por Google. */
export class GoogleMapsLoadError extends Error {
  constructor(
    readonly reason: "script" | "timeout" | "auth",
    message: string,
  ) {
    super(message);
    this.name = "GoogleMapsLoadError";
  }
}

const authFailureListeners = new Set<() => void>();

/**
 * Google no rechaza la carga cuando la clave es inválida o falta facturación: pinta su propio
 * mensaje de error dentro del mapa y llama a `window.gm_authFailure`. Esto permite detectarlo.
 */
export function onGoogleMapsAuthFailure(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const win = window as MapsWindow;
  win.gm_authFailure = () => {
    for (const cb of authFailureListeners) cb();
  };
  authFailureListeners.add(listener);
  return () => {
    authFailureListeners.delete(listener);
  };
}

function mapsConstructorReady(): boolean {
  return typeof window.google?.maps?.Map === "function";
}

function waitUntilMapsReady(timeoutMs: number): Promise<void> {
  if (mapsConstructorReady()) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      if (mapsConstructorReady()) {
        resolve();
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        reject(new GoogleMapsLoadError("timeout", "No se pudo cargar Google Maps"));
        return;
      }
      window.setTimeout(tick, 50);
    };
    tick();
  });
}

/** Devuelve una promesa que rechaza si el script falla; `null` si ya había uno en la página. */
function injectMapsScript(apiKey: string): Promise<never> | null {
  if (document.querySelector(SCRIPT_SELECTOR)) return null;

  const win = window as MapsWindow;
  win[CALLBACK_NAME] = () => {
    delete win[CALLBACK_NAME];
  };

  return new Promise<never>((_, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=${CALLBACK_NAME}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onerror = () => {
      delete win[CALLBACK_NAME];
      script.remove();
      reject(new GoogleMapsLoadError("script", "Google Maps no respondió"));
    };
    document.head.appendChild(script);
  });
}

/** Limpia un intento fallido (script y promesa) para que el botón «Reintentar» pueda volver a cargar. */
export function resetGoogleMapsLoader(): void {
  loadPromise = null;
  if (typeof document === "undefined") return;
  for (const script of document.querySelectorAll('script[data-google-maps="true"]')) {
    script.remove();
  }
}

/** Carga una sola vez Maps JavaScript API (callback clásico; no depende de importLibrary). */
export function loadGoogleMapsApi(apiKey: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps solo carga en el navegador"));
  }
  if (mapsConstructorReady()) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const scriptFailure = injectMapsScript(apiKey);
      const ready = waitUntilMapsReady(LOAD_TIMEOUT_MS);
      await (scriptFailure ? Promise.race([ready, scriptFailure]) : ready);
    } catch (error) {
      loadPromise = null;
      throw error;
    }
  })();

  return loadPromise;
}
