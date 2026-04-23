import { useState, Suspense, lazy } from "react";
import { toast } from "@/hooks/use-toast";
import { CommunityAuth } from "@/components/community/CommunityAuth";
import { ThemeProvider } from "@/contexts/ThemeContext";

const CommunityDashboard = lazy(() => import('@/components/community/CommunityDashboard').then(m => ({ default: m.CommunityDashboard })));
const CommunityMemberView = lazy(() => import('@/components/community/CommunityMemberView').then(m => ({ default: m.CommunityMemberView })));
const CommunityFeed = lazy(() => import('@/components/community/CommunityFeed').then(m => ({ default: m.CommunityFeed })));
const Footer = lazy(() => import('@/components/Footer'));
const NavBar = lazy(() => import('@/components/NavBar'));
const Hero = lazy(() => import('@/components/Hero'));

const Community = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);

  const handleAuthenticated = (data: { name: string; email: string }) => {
    setUserData(data);
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserData(null);
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Only show NavBar when user is not authenticated */}
        {!isAuthenticated && (
          <Suspense fallback={<div className="h-32 flex items-center justify-center">Loading nav bar...</div>}>
            <NavBar />
          </Suspense>
        )}
        
        {/* Hero Section */}
        {!isAuthenticated ? (
          <Suspense fallback={<div className="h-24 flex items-center justify-center">Loading hero...</div>}>
            <Hero 
              backgroundImage="/lovable-uploads/6edb5562-fff6-4fa7-90c6-8c9302543b87.png"
              title={<><span>Join Our Poetry Community</span><br /><span className="block text-xl md:text-2xl font-semibold text-crimson mt-2">Where Words Dance And Emotions Flow</span></>}
              subtitle="Connect with fellow poets, share your work, and engage in meaningful literary discussions."
              buttonText="Sign In"
              buttonLink="#community-auth"
            />
          </Suspense>
        ) : (
          <div 
            className="relative min-h-[350px] flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/lovable-uploads/eb0ae85c-cc80-479e-bbfc-354ecf4178a5.png')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
            <div className="container mx-auto px-4 z-10 pt-16 text-center">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-white mb-6 animate-fade-in">
                  Welcome to Your <span className="text-crimson">Creative Hub</span>
                </h1>
                <p className="text-white/90 text-xl md:text-2xl max-w-3xl mx-auto mb-8 animate-fade-in">
                  Share your poetry, discover inspiring voices, and connect with a vibrant community of writers
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
                  <div className="px-6 py-3 bg-crimson/20 backdrop-blur-sm rounded-full text-white border border-crimson/30">
                    ✨ Express your creativity
                  </div>
                  <div className="px-6 py-3 bg-blue-500/20 backdrop-blur-sm rounded-full text-white border border-blue-500/30">
                    💝 Connect with poets
                  </div>
                  <div className="px-6 py-3 bg-purple-500/20 backdrop-blur-sm rounded-full text-white border border-purple-500/30">
                    🌟 Discover new voices
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="relative">
          {!isAuthenticated ? (
            <div className="container mx-auto px-4 py-16">
              <div id="community-auth" className="max-w-lg mx-auto">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
                  <CommunityAuth onAuthenticated={handleAuthenticated} />
                </div>
              </div>
            </div>
          ) : (
            <Suspense fallback={<div className="h-24 flex items-center justify-center">Loading community...</div>}>
              <CommunityMemberView userData={userData!} onSignOut={handleSignOut} />
            </Suspense>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Community;
