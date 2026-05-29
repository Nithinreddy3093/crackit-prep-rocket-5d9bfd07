import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, LogIn, LogOut, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import MobileBottomNav from '@/components/MobileBottomNav';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/topics', label: 'Topics' },
  { to: '/upsc', label: 'UPSC' },
  { to: '/ai-tutor', label: 'AI Tutor' },
  { to: '/resources', label: 'Resources' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
    <nav
      className={cn(
        'sticky top-0 z-30 w-full border-b transition-all duration-300',
        scrolled
          ? 'bg-background/75 backdrop-blur-xl border-border/80 shadow-soft'
          : 'bg-background/40 backdrop-blur-md border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <span className="relative w-9 h-9 rounded-xl bg-gradient-indigo flex items-center justify-center shadow-glow">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse-glow" />
                <span className="absolute inset-0 rounded-xl ring-1 ring-white/10" />
              </span>
              <span className="ml-2.5 text-xl font-bold font-display tracking-tight text-foreground">
                Crack<span className="gradient-text">It</span>
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-glow">
              <Sparkles className="h-3 w-3" />
              AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <ul className="flex items-center gap-0.5">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={cn(
                        'relative px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        active
                          ? 'text-foreground'
                          : 'text-foreground/65 hover:text-foreground'
                      )}
                    >
                      {link.label}
                      {active && (
                        <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-gradient-indigo rounded-full" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="ml-4 flex items-center gap-2 pl-4 border-l border-border/60">
              <ThemeToggle />
              {isAuthenticated ? (
                <>
                  <Button onClick={() => navigate('/dashboard')} variant="ghost" size="sm">
                    <User className="mr-1 h-4 w-4" />
                    {user?.name?.split(' ')[0] || 'Profile'}
                  </Button>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    <LogOut className="mr-1 h-4 w-4" />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/login">
                      <LogIn className="mr-1 h-4 w-4" />
                      Log In
                    </Link>
                  </Button>
                  <Button asChild variant="premium" size="sm">
                    <Link to="/signup">
                      <Sparkles className="mr-1 h-4 w-4" />
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-card/60 min-h-[44px] min-w-[44px]"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85vw] max-w-sm p-0 bg-background/95 backdrop-blur-xl border-l border-border/60 flex flex-col"
              >
                <SheetHeader className="px-5 pt-5 pb-4 border-b border-border/60">
                  <SheetTitle className="flex items-center gap-2 text-left">
                    <span className="relative w-8 h-8 rounded-lg bg-gradient-indigo flex items-center justify-center shadow-glow">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-glow" />
                    </span>
                    <span className="font-display text-lg">
                      Crack<span className="gradient-text">It</span>
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-glow">
                      <Sparkles className="h-3 w-3" />
                      AI
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                  {navLinks.map((link) => {
                    const active = isActive(link.to);
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          'flex items-center px-4 py-3 rounded-lg text-base font-medium min-h-[44px] transition-colors',
                          active
                            ? 'bg-primary/15 text-foreground border border-primary/20'
                            : 'text-foreground/75 hover:bg-card/60 hover:text-foreground'
                        )}
                      >
                        {link.label}
                        {active && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                <div className="px-4 py-4 border-t border-border/60 space-y-2 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                  {isAuthenticated ? (
                    <>
                      <Button
                        onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <User className="mr-2 h-4 w-4" />
                        {user?.name?.split(' ')[0] || 'Profile'}
                      </Button>
                      <Button
                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                          <LogIn className="mr-2 h-4 w-4" />
                          Log In
                        </Link>
                      </Button>
                      <Button asChild variant="premium" className="w-full">
                        <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Get Started
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

    </nav>
    <MobileBottomNav />
    </>
  );
};

export default Navbar;
