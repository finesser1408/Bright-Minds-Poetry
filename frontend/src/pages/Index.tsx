
import NavBar from '@/components/NavBar';
import React, { Suspense } from 'react';
const Footer = React.lazy(() => import('@/components/Footer'));
const Hero = React.lazy(() => import('@/components/Hero'));
const SectionHeader = React.lazy(() => import('@/components/SectionHeader'));
const ServiceCard = React.lazy(() => import('@/components/ServiceCard'));
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
        <Hero 
          backgroundImage="/lovable-uploads/eb0ae85c-cc80-479e-bbfc-354ecf4178a5.png"
          title="Where Words Become Magic"
          subtitle="Discover the art of poetry with Bright Minds Poetry - where creativity knows no bounds."
          buttonText="Explore Our Work"
          buttonLink="/gallery"
        />
      </Suspense>
      
      {/* About Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="/lovable-uploads/b4d94ec4-3ae5-42af-80c6-40b87e4d6472.png" 
                alt="Bright Minds Poetry" 
                className="rounded-lg shadow-xl animate-float w-full h-auto"
                loading="lazy"
              />
            </div>
            
            <div className="animate-slide-up order-1 lg:order-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold mb-4">
                <span className="text-crimson">About</span> Bright Minds Poetry
              </h2>
              
              <p className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base">
              Bright Minds Poetry is a vibrant global community where poets from every corner of the world come together to share their unique voices and creative expressions. Our platform is more than just a place to post poems—it's a supportive space to connect, inspire, and grow alongside fellow poets. Here, you can showcase your work, discover new perspectives, and engage in meaningful conversations with writers who share your passion for poetry. Whether you are a seasoned poet or just beginning your journey, Bright Minds Poetry welcomes you to learn, collaborate, and find inspiration. Join us in celebrating the beauty of words and the power of poetic connection—your voice matters, and the world is waiting to hear it. 
              </p>
              
              <p className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base">
                Our community of poets, writers, and literature enthusiasts comes together to celebrate creativity, 
                expression, and the beauty of language. Through publications and readings.
                we aim to keep the poetic tradition alive and thriving.
              </p>
              
              <Button asChild className="bg-crimson hover:bg-crimson/90 text-white w-full sm:w-auto">
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-12 md:py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="mb-6 md:mb-8">
            <Suspense fallback={<div className="h-16 flex items-center justify-center">Loading section...</div>}>
              <SectionHeader 
                title="Our Service"
                subtitle="Experience the heart of Bright Minds Poetry: our vibrant, uplifting community."
                centered
              />
            </Suspense>
          </div>
          <div className="flex justify-center">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-300 border border-purple-100">
              <Suspense fallback={<div className="h-24 flex items-center justify-center">Loading service...</div>}>
                <ServiceCard 
                  title="The Poetry Community"
                  description="Join a thriving, welcoming community where poets of all backgrounds come together to share, inspire, and grow. Participate in interactive workshops, live readings, and collaborative projects. Discover new friends, mentors, and creative partners. At Bright Minds Poetry, you're not just a member—you're family. Experience the joy of belonging to a passionate, supportive network that celebrates your poetic journey every step of the way!"
                  icon={<Users size={28} className="text-purple-500 mb-2" />}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section 
        className="py-12 md:py-20 px-4 relative"
        style={{
          backgroundImage: `url(/lovable-uploads/6edb5562-fff6-4fa7-90c6-8c9302543b87.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
        
        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-white mb-4 md:mb-6">
            Ready to Begin Your <span className="text-crimson">Poetic Journey</span>?
          </h2>
          
          <p className="text-white/90 max-w-2xl mx-auto mb-6 md:mb-10 text-sm md:text-base">
            Join our community of poets, writers, and literature enthusiasts. Whether you're just starting out or looking to 
            refine your craft, we have something for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-crimson hover:bg-crimson/90 text-white">
              <Link to="/contact">Contact Us</Link>
            </Button>
            
            <Button asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Suspense fallback={<div className="h-24 flex items-center justify-center">Loading footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;

