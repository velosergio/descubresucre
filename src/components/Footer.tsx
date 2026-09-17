import { MapPin } from "lucide-react";
import Link from "next/link";

const siteLinkClass =
  "block hover:text-tropical-gold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-tropical-gold";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground/80 py-12 px-4">
    <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-display font-bold text-xl text-primary-foreground mb-3">
          Sucre <span className="text-tropical-gold">Vivo</span>
        </h3>
        <p className="font-body text-sm text-primary-foreground/60">
          Tu guía digital para explorar las maravillas del departamento de Sucre, Colombia.
        </p>
      </div>
      <div>
        <h4 className="font-display font-semibold text-primary-foreground mb-3">Ubicación</h4>
        <p className="flex items-center gap-2 font-body text-sm">
          <MapPin className="w-4 h-4 text-tropical-gold" aria-hidden /> Sincelejo, Sucre, Colombia
        </p>
      </div>
      <div>
        <h4 className="font-display font-semibold text-primary-foreground mb-3">Enlaces</h4>
        <div className="space-y-2 font-body text-sm">
          <Link href="/" className={siteLinkClass}>
            Inicio
          </Link>
          <Link href="/sucre-natural" className={siteLinkClass}>
            Sucre Natural
          </Link>
          <a
            href="https://www.sucre.gov.co/"
            className={siteLinkClass}
            target="_blank"
            rel="noreferrer"
          >
            Gobernación de Sucre
          </a>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-primary-foreground/10 text-center font-body text-xs text-primary-foreground/40">
      © 2026 Sucre Vivo. Todos los derechos reservados.
    </div>
  </footer>
);

export default Footer;
