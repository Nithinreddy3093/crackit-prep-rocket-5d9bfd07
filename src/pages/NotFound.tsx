
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-crackit-100 dark:bg-crackit-900">
          <div className="relative w-10 h-10">
            <div className="w-10 h-10 rounded-full bg-crackit-300 dark:bg-crackit-700 animate-pulse-glow"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-crackit-800 dark:text-crackit-300">404</span>
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Page not found</h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Oops! We couldn't find the page you're looking for.
        </p>
        
        <div className="crack-line mb-8 w-full h-px bg-gray-200 dark:bg-gray-700"></div>
        
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
          The page at <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{location.pathname}</span> doesn't exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" className="bg-crackit-600 hover:bg-crackit-700">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link to="/topics">
              <Search className="mr-2 h-4 w-4" />
              Browse Topics
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
