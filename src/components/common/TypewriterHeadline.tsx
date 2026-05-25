import React, { useEffect, useState } from 'react';

interface TypewriterHeadlineProps {
  /** Words/phrases to cycle through. */
  words: string[];
  /** Typing speed in ms per character. */
  typeSpeed?: number;
  /** Deleting speed in ms per character. */
  deleteSpeed?: number;
  /** How long to hold a fully-typed word, in ms. */
  holdMs?: number;
  className?: string;
}

/**
 * Lightweight typewriter that respects prefers-reduced-motion.
 * Renders text with an animated indigo caret.
 */
const TypewriterHeadline: React.FC<TypewriterHeadlineProps> = ({
  words,
  typeSpeed = 70,
  deleteSpeed = 35,
  holdMs = 1500,
  className = '',
}) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduceMotion) {
      setText(words[0] ?? '');
      return;
    }

    const current = words[index % words.length];

    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), holdMs);
      return () => clearTimeout(t);
    }
    if (deleting && text === '') {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const next = deleting
      ? current.slice(0, text.length - 1)
      : current.slice(0, text.length + 1);

    const t = setTimeout(() => setText(next), deleting ? deleteSpeed : typeSpeed);
    return () => clearTimeout(t);
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, holdMs, reduceMotion]);

  return (
    <span className={`gradient-text ai-caret ${className}`} aria-live="polite">
      {text}
    </span>
  );
};

export default TypewriterHeadline;
