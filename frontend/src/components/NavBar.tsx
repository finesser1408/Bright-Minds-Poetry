
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

function isAuthenticated() {
  return Boolean(localStorage.getItem('accessToken'));
}

function handleLogout() {
  localStorage.removeItem('accessToken');
  window.location.href = '/';
}

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-md py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-playfair font-bold text-white">
            BRIGHT<span className="text-crimson">MINDS</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center justify-center flex-1">
          <nav className="flex space-x-8">
            <NavLink to="/">HOME</NavLink>
            <NavLink to="/about">ABOUT</NavLink>
            <NavLink to="/services">SERVICES</NavLink>
            <NavLink to="/gallery">GALLERY</NavLink>
            <NavLink to="/contact">CONTACT</NavLink>
            <NavLink to="/community">COMMUNITY</NavLink>
          </nav>
        </div>

        <div className="hidden md:flex items-center space-x-4 w-[200px] justify-end">
          {/* Logout button removed as requested */}
        </div>

        <Button 
          variant="ghost" 
          size="icon"
          className="text-white md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu size={24} />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>HOME</MobileNavLink>
            <MobileNavLink to="/about" onClick={() => setIsMenuOpen(false)}>ABOUT</MobileNavLink>
            <MobileNavLink to="/services" onClick={() => setIsMenuOpen(false)}>SERVICES</MobileNavLink>
            <MobileNavLink to="/gallery" onClick={() => setIsMenuOpen(false)}>GALLERY</MobileNavLink>
            <MobileNavLink to="/contact" onClick={() => setIsMenuOpen(false)}>CONTACT</MobileNavLink>
            <MobileNavLink to="/community" onClick={() => setIsMenuOpen(false)}>COMMUNITY</MobileNavLink>
          {/* Logout button removed from mobile menu as requested */}
          </div>
        </div>
      )}
    </header>
  );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link 
    to={to} 
    className="text-white font-medium hover:text-crimson transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-crimson after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ 
  to, 
  children, 
  onClick 
}: { 
  to: string; 
  children: React.ReactNode; 
  onClick: () => void;
}) => (
  <Link 
    to={to} 
    className="text-white font-medium text-lg py-2 hover:text-crimson transition-colors border-b border-white/10"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default NavBar;
