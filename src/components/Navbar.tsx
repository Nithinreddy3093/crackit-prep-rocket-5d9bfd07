
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogIn, LogOut, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import MobileBottomNav from '@/components/MobileBottomNav';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-30 w-full bg-background/90 dark:bg-darkBlue-900/90 backdrop-blur-md shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse-glow"></div>
              </div>
              <span className="ml-2 text-xl font-bold text-foreground">Crackit</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className="px-3 py-2 text-foreground opacity-80 hover:opacity-100 font-medium transition-colors">
                    Home
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/topics" className="px-3 py-2 text-foreground opacity-80 hover:opacity-100 font-medium transition-colors">
                    Topics
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/ai-tutor" className="px-3 py-2 text-foreground opacity-80 hover:opacity-100 font-medium transition-colors">
                    AI Tutor
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/resources" className="px-3 py-2 text-foreground opacity-80 hover:opacity-100 font-medium transition-colors">
                    Resources
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/leaderboard" className="px-3 py-2 text-foreground opacity-80 hover:opacity-100 font-medium transition-colors">
                    Leaderboard
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/hr-interview" className="px-3 py-2 text-foreground opacity-80 hover:opacity-100 font-medium transition-colors">
                    HR Practice
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/pricing" className="px-3 py-2 text-foreground opacity-80 hover:opacity-100 font-medium transition-colors">
                    Pricing
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/about" className="px-3 py-2 text-foreground opacity-80 hover:opacity-100 font-medium transition-colors">
                    About
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/contact" className="px-3 py-2 text-foreground opacity-80 hover:opacity-100 font-medium transition-colors">
                    Contact
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <div className="ml-4 flex items-center space-x-2">
              <ThemeToggle />
              
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    variant="ghost" 
                    className="text-foreground opacity-80 hover:opacity-100 hover:bg-accent"
                  >
                    <User className="mr-1 h-4 w-4" />
                    {user?.name || 'Profile'}
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="border-border text-foreground hover:bg-accent"
                  >
                    <LogOut className="mr-1 h-4 w-4" />
                    Log Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button asChild variant="ghost" className="text-foreground opacity-80 hover:opacity-100 hover:bg-accent">
                    <Link to="/login">
                      <LogIn className="mr-1 h-4 w-4" />
                      Log In
                    </Link>
                  </Button>
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link to="/signup">
                      <User className="mr-1 h-4 w-4" />
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary focus:outline-none"
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
        <div className="md:hidden bg-background dark:bg-darkBlue-800 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground opacity-80 hover:bg-accent hover:opacity-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/topics" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground opacity-80 hover:bg-accent hover:opacity-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Topics
            </Link>
            <Link 
              to="/ai-tutor" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground opacity-80 hover:bg-accent hover:opacity-100"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Tutor
            </Link>
            <Link 
              to="/resources" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground opacity-80 hover:bg-accent hover:opacity-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <Link 
              to="/leaderboard" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground opacity-80 hover:bg-accent hover:opacity-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboard
            </Link>
            <Link 
              to="/hr-interview" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground opacity-80 hover:bg-accent hover:opacity-100"
              onClick={() => setIsMenuOpen(false)}
            >
              HR Practice
            </Link>
            <Link 
              to="/pricing" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground opacity-80 hover:bg-accent hover:opacity-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground opacity-80 hover:bg-accent hover:opacity-100"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground opacity-80 hover:bg-accent hover:opacity-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            <div className="px-2 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-foreground opacity-80 hover:bg-accent hover:opacity-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-foreground opacity-80 hover:bg-accent hover:opacity-100"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-foreground opacity-80 hover:bg-accent hover:opacity-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </nav>
  );
};

export default Navbar;
