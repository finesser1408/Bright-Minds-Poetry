
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

import { ReactNode } from 'react';

interface HeroProps {
  backgroundImage: string;
  title: React.ReactNode;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const Hero = ({ 
  backgroundImage, 
  title, 
  subtitle, 
  buttonText, 
  buttonLink 
}: HeroProps) => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>
      
      <div className="container mx-auto px-4 z-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-white mb-4 md:mb-6 animate-fade-in leading-tight">
          {title}
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8 md:mb-10 animate-fade-in px-4">
          {subtitle}
        </p>
        
        <Button
          asChild
          className="bg-crimson hover:bg-crimson/90 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg animate-fade-in w-full sm:w-auto"
        >
          <Link to={buttonLink}>{buttonText}</Link>
        </Button>
      </div>
    </section>
  );
};

export default Hero;
