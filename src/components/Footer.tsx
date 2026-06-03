import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Twitter, Linkedin, Github } from 'lucide-react';
import Logo from './Logo';

const cols = [
  {
    title: 'Product',
    links: [
      { to: '/topics', label: 'Topics' },
      { to: '/upsc', label: 'UPSC' },
      { to: '/ai-tutor', label: 'AI Tutor' },
      { to: '/companies', label: 'Companies' },
      { to: '/leaderboard', label: 'Leaderboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/features', label: 'Features' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/careers', label: 'Careers' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { to: '/guides', label: 'Study Guides' },
      { to: '/blog', label: 'Blog' },
      { to: '/faq', label: 'FAQ' },
      { to: '/achievements', label: 'Achievements' },
      { to: '/support', label: 'Support' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/terms', label: 'Terms' },
      { to: '/privacy', label: 'Privacy' },
      { to: '/cookies', label: 'Cookies' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="relative mt-16 border-t border-border/60 bg-background">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="inline-flex items-center gap-2">
              <Logo size="md" />
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary-glow">
                <Sparkles className="h-3 w-3" /> AI
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Know it. Crack it. AI-powered interview and UPSC preparation, built for ambitious learners.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { href: 'https://twitter.com', Icon: Twitter, label: 'Twitter' },
                { href: 'https://linkedin.com', Icon: Linkedin, label: 'LinkedIn' },
                { href: 'https://github.com', Icon: Github, label: 'GitHub' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-card transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/90 mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CrackIt. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Crafted with intent. Powered by AI.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
