import { MapPin, Mail, Phone } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground/80 py-12 px-4">
    <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-display font-bold text-xl text-primary-foreground mb-3">
          Sucre <span className="text-tropical-gold">Turístico</span>
        </h3>
        <p className="font-body text-sm text-primary-foreground/60">
          Tu guía digital para explorar las maravillas del departamento de Sucre, Colombia.
        </p>
      </div>
      <div>
        <h4 className="font-display font-semibold text-primary-foreground mb-3">Contacto</h4>
        <div className="space-y-2 font-body text-sm">
          <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-tropical-gold" /> Sincelejo, Sucre, Colombia</p>
          <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-tropical-gold" /> turismo@sucre.gov.co</p>
          <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-tropical-gold" /> +57 (5) 282 0000</p>
        </div>
      </div>
      <div>
        <h4 className="font-display font-semibold text-primary-foreground mb-3">Enlaces</h4>
        <div className="space-y-2 font-body text-sm">
          <p className="hover:text-tropical-gold cursor-pointer transition-colors">Gobernación de Sucre</p>
          <p className="hover:text-tropical-gold cursor-pointer transition-colors">ProColombia</p>
          <p className="hover:text-tropical-gold cursor-pointer transition-colors">Ministerio de Cultura</p>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-primary-foreground/10 text-center font-body text-xs text-primary-foreground/40">
      © 2026 Sucre Turístico. Todos los derechos reservados.
    </div>
  </footer>
);

export default Footer;
