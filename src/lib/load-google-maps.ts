let loadPromise: Promise<void> | null = null;

const CALLBACK_NAME = "__descubresucreGoogleMapsInit";
const LOAD_TIMEOUT_MS = 20_000;
const SCRIPT_SELECTOR =
  'script[data-google-maps="true"], script[src*="maps.googleapis.com/maps/api/js"]';

type MapsWindow = Window & {
  __descubresucreGoogleMapsInit?: () => void;
};

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
        reject(new Error("No se pudo cargar Google Maps"));
        return;
      }
      window.setTimeout(tick, 50);
    };
    tick();
  });
}

function injectMapsScript(apiKey: string): void {
  if (document.querySelector(SCRIPT_SELECTOR)) return;

  const win = window as MapsWindow;
  win[CALLBACK_NAME] = () => {
    delete win[CALLBACK_NAME];
  };

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&callback=${CALLBACK_NAME}`;
  script.async = true;
  script.defer = true;
  script.dataset.googleMaps = "true";
  script.onerror = () => {
    delete win[CALLBACK_NAME];
  };
  document.head.appendChild(script);
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
      injectMapsScript(apiKey);
      await waitUntilMapsReady(LOAD_TIMEOUT_MS);
    } catch (error) {
      loadPromise = null;
      throw error;
    }
  })();

  return loadPromise;
}
