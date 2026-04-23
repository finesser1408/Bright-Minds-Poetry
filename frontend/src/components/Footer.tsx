
import { Link } from 'react-router-dom';
import { Instagram, Mail } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="bg-gradient-dark text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-playfair font-bold mb-4">
              BRIGHT<span className="text-crimson">MINDS</span> POETRY
            </h3>
            <p className="text-white/80 mb-6">
              Where art meets passion, and words transform into emotions. Join us on a journey of creative expression.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<SiTiktok size={20} />} href="https://www.tiktok.com/@brightminds748" />
              <SocialIcon icon={<Instagram size={20} />} href="https://instagram.com/bri.ghtmindspoetry" />
              <SocialIcon icon={<Mail size={20} />} href="mailto:brightmindspoetry1408@gmail.com" />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-playfair font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/services">Services</FooterLink>
              <FooterLink href="/gallery">Gallery</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-playfair font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-white/80">
              <li>Phone: +263 71 550 3026</li>
              <li>Phone: +263 778 203 483</li>
              <li>Phone: +263 711 611 961</li>
              <li>Email: brightmindspoetry1408@gmail.com</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-white/70">
          <p>© {new Date().getFullYear()} Bright Minds Poetry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }: { icon: React.ReactNode; href: string }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer" 
    className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-b from-pink-400 to-crimson hover:scale-110 transition-transform"
  >
    {icon}
  </a>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link 
      to={href} 
      className="text-white/80 hover:text-crimson transition-colors"
    >
      {children}
    </Link>
  </li>
);

export default Footer;
