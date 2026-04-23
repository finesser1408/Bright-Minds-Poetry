
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-lg w-full">
        <h1 className="text-6xl md:text-8xl font-playfair font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-playfair font-semibold mb-4">Page Not Found</h2>
        <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button asChild className="bg-crimson hover:bg-crimson/90 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg w-full sm:w-auto">
          <Link to="/">Return to Home</Link>
        </Button>
        
        <div className="mt-8 md:mt-12">
          <p className="text-gray-500 text-sm md:text-base">
            Looking for inspiration instead? Here's a poem fragment:
          </p>
          <blockquote className="mt-4 italic text-gray-700 font-playfair text-sm md:text-base">
            "In the labyrinth of lost pages,<br />
            Words wander, seeking their story.<br />
            Return to the beginning,<br />
            Where all journeys find their path."
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
