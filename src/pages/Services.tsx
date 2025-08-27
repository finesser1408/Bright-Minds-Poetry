
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import SectionHeader from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Heart, MessageCircle, BookOpen, Sparkles, Globe } from 'lucide-react';

const Services = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      <Hero 
        backgroundImage="/lovable-uploads/eb0ae85c-cc80-479e-bbfc-354ecf4178a5.png"
        title="Our Poetry Community"
        subtitle="Connect, share, and grow with poets from around the world in our vibrant literary community."
        buttonText="Join Our Community"
        buttonLink="/community"
      />
      
      {/* Main Service Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto">
          <SectionHeader 
            title="What We Offer"
            subtitle="Bright Minds Poetry is more than a platform—it's a thriving global community where poets connect, inspire, and grow together."
            centered
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mt-8 md:mt-12">
            <div className="animate-slide-up order-2 lg:order-1">
              <h3 className="text-2xl md:text-3xl font-playfair font-bold mb-4 md:mb-6">
                <span className="text-crimson">The Poetry</span> Community
              </h3>
              
              <p className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base lg:text-lg">
                Join a vibrant global community where poets from every corner of the world come together to share their unique voices and creative expressions. Our platform is more than just a place to post poems—it's a supportive space to connect, inspire, and grow alongside fellow poets.
              </p>
              
              <p className="text-gray-700 mb-6 md:mb-8 text-sm md:text-base">
                Whether you are a seasoned poet or just beginning your journey, Bright Minds Poetry welcomes you to learn, collaborate, and find inspiration. Join us in celebrating the beauty of words and the power of poetic connection—your voice matters, and the world is waiting to hear it.
              </p>
              
              <Button asChild className="bg-crimson hover:bg-crimson/90 text-white text-base md:text-lg px-6 md:px-8 py-2 md:py-3 w-full sm:w-auto">
                <Link to="/community">Join Our Community</Link>
              </Button>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-xl border-2 border-crimson order-1 lg:order-2">
              <img 
                src="/lovable-uploads/6edb5562-fff6-4fa7-90c6-8c9302543b87.png" 
                alt="Poetry Community" 
                className="w-full h-48 md:h-64 lg:h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Community Features */}
      <section className="py-12 md:py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <SectionHeader 
            title="Community Features"
            subtitle="Discover what makes our poetry community special and how you can be part of it."
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
            <CommunityFeature 
              icon={<Users size={28} className="md:w-8 md:h-8" />}
              title="Connect with Poets"
              description="Meet fellow poets from around the world, share experiences, and build lasting friendships within our supportive community."
            />
            
            <CommunityFeature 
              icon={<Heart size={28} className="md:w-8 md:h-8" />}
              title="Share Your Work"
              description="Showcase your poems and receive encouragement from a community that celebrates creativity and artistic expression."
            />
            
            <CommunityFeature 
              icon={<MessageCircle size={28} className="md:w-8 md:h-8" />}
              title="Engage in Discussions"
              description="Participate in meaningful conversations about poetry, writing techniques, and the creative process with passionate writers."
            />
            
            <CommunityFeature 
              icon={<BookOpen size={28} className="md:w-8 md:h-8" />}
              title="Discover New Voices"
              description="Explore diverse poetry from talented writers worldwide and find inspiration for your own creative journey."
            />
            
            <CommunityFeature 
              icon={<Sparkles size={28} className="md:w-8 md:h-8" />}
              title="Collaborative Projects"
              description="Join collaborative poetry projects and be part of something bigger than individual expression."
            />
            
            <CommunityFeature 
              icon={<Globe size={28} className="md:w-8 md:h-8" />}
              title="Global Platform"
              description="Be part of a worldwide network of poets who believe in the transformative power of words and poetry."
            />
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section 
        className="py-12 md:py-20 px-4 relative"
        style={{
          backgroundImage: `url(/lovable-uploads/b4d94ec4-3ae5-42af-80c6-40b87e4d6472.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>
        
        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-white mb-4 md:mb-6">
            Ready to Join Our <span className="text-crimson">Poetry Family</span>?
          </h2>
          
          <p className="text-white/90 max-w-2xl mx-auto mb-6 md:mb-10 text-sm md:text-base lg:text-lg">
            Experience the joy of belonging to a passionate, supportive network that celebrates your poetic journey every step of the way. Your voice matters, and we can't wait to hear it.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-crimson hover:bg-crimson/90 text-white text-base md:text-lg px-6 md:px-8 py-2 md:py-3">
              <Link to="/community">Join the Community</Link>
            </Button>
            
            <Button asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 text-base md:text-lg px-6 md:px-8 py-2 md:py-3">
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

interface CommunityFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const CommunityFeature = ({ icon, title, description }: CommunityFeatureProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
      <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-crimson/10 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-crimson/20 transition-colors">
        <div className="text-crimson">
          {icon}
        </div>
      </div>
      
      <h3 className="text-lg md:text-xl font-playfair font-semibold mb-2 md:mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 text-sm md:text-base">
        {description}
      </p>
    </div>
  );
};

export default Services;
