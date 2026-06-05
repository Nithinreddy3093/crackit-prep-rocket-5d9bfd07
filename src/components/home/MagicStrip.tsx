import React from 'react';
import { Link } from 'react-router-dom';
import { Target, BookOpen, CalendarCheck, ArrowRight } from 'lucide-react';

const items = [
  {
    icon: Target,
    title: "Today's mission, not 10,000 articles",
    body: "We pick the one weak spot you should fix in 15 minutes — instead of dropping a syllabus on your head.",
    cta: 'See how it works',
    to: '/dashboard',
  },
  {
    icon: BookOpen,
    title: 'Concept cards that stick',
    body: "Definition, example, gotcha, micro-quiz. 60 seconds beats a 20-tab W3Schools rabbit hole.",
    cta: 'Browse concept cards',
    to: '/learn',
  },
  {
    icon: CalendarCheck,
    title: 'Your placement date matters',
    body: "Set TCS NQT, your campus drive, or any target — we turn it into a live countdown with daily nudges.",
    cta: 'Start placement plan',
    to: '/placement-prep',
  },
];

const MagicStrip: React.FC = () => (
  <section className="relative py-14 sm:py-20">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-glow">
          Why CrackIt
        </span>
        <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          GFG is an encyclopedia. <br className="hidden sm:block" />
          <span className="gradient-text">CrackIt is a coach.</span>
        </h2>
        <p className="mt-3 text-muted-foreground">
          A real coach knows what you got wrong yesterday, what to drill today, and when your interview is. So do we.
        </p>
      </div>

      <div className="mt-10 grid md:grid-cols-3 gap-5">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Link
              key={it.title}
              to={it.to}
              className="group rounded-2xl glass-strong p-6 hover:border-primary/40 transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-indigo flex items-center justify-center shadow-glow">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.body}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-glow group-hover:gap-2 transition-all">
                {it.cta} <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

export default MagicStrip;
