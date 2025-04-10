
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-crackit-600 to-crackit-800 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse-glow"></div>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Crackit</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-crackit-600 dark:hover:text-crackit-400 font-medium">
              Home
            </Link>
            <Link to="/topics" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-crackit-600 dark:hover:text-crackit-400 font-medium">
              Topics
            </Link>
            <Link to="/pricing" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-crackit-600 dark:hover:text-crackit-400 font-medium">
              Pricing
            </Link>
            <Link to="/about" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-crackit-600 dark:hover:text-crackit-400 font-medium">
              About
            </Link>
            
            <div className="ml-4 flex items-center space-x-2">
              <Button asChild variant="outline" size="sm" className="border-crackit-500 text-crackit-600 hover:text-crackit-700 hover:bg-crackit-50">
                <Link to="/login">
                  <LogIn className="mr-1 h-4 w-4" />
                  Log In
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-crackit-600 hover:bg-crackit-700">
                <Link to="/signup">
                  <User className="mr-1 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-crackit-600 dark:hover:text-crackit-400 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-crackit-50 dark:hover:bg-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/topics" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-crackit-50 dark:hover:bg-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Topics
            </Link>
            <Link 
              to="/pricing" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-crackit-50 dark:hover:bg-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-crackit-50 dark:hover:bg-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 space-y-2">
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-crackit-50 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium bg-crackit-600 text-white hover:bg-crackit-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
