import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Lightbulb, AlertTriangle, CheckCircle2, Search, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CONCEPT_CARDS, getConceptCard, type ConceptCard } from '@/data/conceptCards';

const CardView: React.FC<{ card: ConceptCard }> = ({ card }) => {
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState(false);
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <button onClick={() => navigate('/learn')} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> All cards
      </button>
      <div className="text-xs uppercase tracking-wider text-primary-glow">{card.topicLabel}</div>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-foreground">{card.title}</h1>
      <p className="mt-2 text-base sm:text-lg text-muted-foreground">{card.oneLiner}</p>

      <section className="mt-8 rounded-2xl glass-strong p-5 sm:p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BookOpen className="h-4 w-4 text-primary-glow" /> Definition
        </div>
        <p className="mt-2 text-foreground/85 leading-relaxed">{card.definition}</p>
      </section>

      <section className="mt-4 rounded-2xl glass p-5 sm:p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Lightbulb className="h-4 w-4 text-primary-glow" /> Example
        </div>
        <pre className="mt-2 text-xs sm:text-sm bg-background/40 border border-border/60 rounded-lg p-3 overflow-x-auto text-foreground/90 whitespace-pre-wrap">{card.example}</pre>
      </section>

      <section className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
          <AlertTriangle className="h-4 w-4" /> Interview gotcha
        </div>
        <p className="mt-2 text-foreground/85 leading-relaxed">{card.gotcha}</p>
      </section>

      <section className="mt-6 rounded-2xl glass-strong p-5 sm:p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <CheckCircle2 className="h-4 w-4 text-primary-glow" /> Quick check
        </div>
        <p className="mt-3 font-medium text-foreground">{card.micro.q}</p>
        {revealed ? (
          <p className="mt-2 text-sm text-primary-glow font-semibold">Answer: {card.micro.a}</p>
        ) : (
          <Button size="sm" variant="outline" className="mt-3" onClick={() => setRevealed(true)}>
            Reveal answer
          </Button>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="premium" onClick={() => navigate(`/quiz/${card.topicId}`)}>
          Practice {card.topicLabel} now <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={() => navigate('/learn')}>
          Browse more cards
        </Button>
      </div>
    </article>
  );
};

const LearnIndex: React.FC = () => {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return CONCEPT_CARDS;
    return CONCEPT_CARDS.filter(
      (c) =>
        c.title.toLowerCase().includes(s) ||
        c.oneLiner.toLowerCase().includes(s) ||
        c.topicLabel.toLowerCase().includes(s) ||
        c.tags.some((t) => t.includes(s))
    );
  }, [q]);

  const grouped = useMemo(() => {
    const m = new Map<string, ConceptCard[]>();
    filtered.forEach((c) => {
      const arr = m.get(c.topicLabel) ?? [];
      arr.push(c);
      m.set(c.topicLabel, arr);
    });
    return Array.from(m.entries());
  }, [filtered]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-glow">
          <BookOpen className="h-3.5 w-3.5" /> Concept cards
        </span>
        <h1 className="mt-4 font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
          Look it up. <span className="gradient-text">Lock it in.</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          The 60-second alternative to a 20-tab W3Schools rabbit hole. Definition, example, gotcha, micro-quiz — done.
        </p>
      </div>

      <div className="mt-8 max-w-xl mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search concepts: SOLID, joins, TCP, recursion…"
          className="pl-9 h-11"
        />
      </div>

      <div className="mt-10 space-y-10">
        {grouped.length === 0 && (
          <p className="text-center text-muted-foreground">No cards match "{q}" yet.</p>
        )}
        {grouped.map(([topic, cards]) => (
          <section key={topic}>
            <h2 className="font-display text-xl font-bold text-foreground mb-4">{topic}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((c, i) => (
                <motion.button
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => navigate(`/learn/${c.id}`)}
                  className="text-left rounded-2xl glass p-5 hover:border-primary/40 transition-all group"
                >
                  <div className="text-[10px] uppercase tracking-wider text-primary-glow">{c.topicLabel}</div>
                  <div className="mt-1 font-semibold text-foreground">{c.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.oneLiner}</div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-primary-glow group-hover:gap-2 transition-all">
                    Open card <ArrowRight className="h-3 w-3" />
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

const Learn: React.FC = () => {
  const { cardId } = useParams<{ cardId?: string }>();
  const card = cardId ? getConceptCard(cardId) : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{card ? `${card.title} — Concept Card | CrackIt` : 'Concept Cards — 60-second tech revision | CrackIt'}</title>
        <meta name="description" content={card ? card.oneLiner : 'Bite-sized concept cards with definition, example, gotcha and a quick check. The W3Schools/GFG alternative built for placement prep.'} />
      </Helmet>
      <Navbar />
      <main className="flex-1">
        {card ? <CardView card={card} /> : <LearnIndex />}
      </main>
      <Footer />
    </div>
  );
};

export default Learn;
