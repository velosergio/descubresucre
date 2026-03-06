import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import PromoCards from "@/components/PromoCards";
import ActivitiesSection from "@/components/ActivitiesSection";
import EventsSection from "@/components/EventsSection";
import CulturalAgenda from "@/components/CulturalAgenda";
import ConvocatoriasSection from "@/components/ConvocatoriasSection";
import Footer from "@/components/Footer";
import ChatModal from "@/components/ChatModal";

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string>();

  const handleChatMessage = (msg: string) => {
    setInitialMessage(msg);
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onChatMessage={handleChatMessage} />
      <PromoCards />
      <ActivitiesSection />
      <EventsSection />
      <CulturalAgenda />
      <ConvocatoriasSection />
      <Footer />

      {/* Floating chat button */}
      {!chatOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
          onClick={() => {
            setInitialMessage(undefined);
            setChatOpen(true);
          }}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
          aria-label="Abrir chat"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}

      <ChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        initialMessage={initialMessage}
      />
    </div>
  );
};

export default Index;
