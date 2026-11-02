import { MessageCircle } from "lucide-react";

const ContactWhatsAppButton = () => (
  <a
    href="https://wa.me/263715503026"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with Bright Minds Poetry on WhatsApp"
    className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-[#1fb85a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40"
  >
    <MessageCircle size={20} aria-hidden="true" />
    <span>WhatsApp</span>
  </a>
);

export default ContactWhatsAppButton;
