import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/447348226461"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp (+44 73 4822 6461)"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#D4AF37]/95 backdrop-blur-md hover:bg-[#DFBE52] text-[#0A0A0A] text-xs font-semibold border border-[#C29B24] shadow-[0_12px_30px_-6px_rgba(212,175,55,0.55)] hover:shadow-[0_16px_36px_-6px_rgba(212,175,55,0.68)] hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
    >
      <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>Chat with us</span>
    </a>
  );
};
