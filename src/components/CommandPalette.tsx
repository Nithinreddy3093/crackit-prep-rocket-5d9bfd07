import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from '@/components/ui/command';
import { BookOpen, Target, Trophy, Sparkles, Briefcase, Award, Home, BarChart3 } from 'lucide-react';
import { CONCEPT_CARDS } from '@/data/conceptCards';

export const CommandPalette: React.FC<{ open: boolean; onOpenChange: (o: boolean) => void }> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const go = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search concepts, topics, pages…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Jump to">
          <CommandItem onSelect={() => go('/')}><Home className="mr-2 h-4 w-4" />Home</CommandItem>
          <CommandItem onSelect={() => go('/dashboard')}><BarChart3 className="mr-2 h-4 w-4" />Dashboard</CommandItem>
          <CommandItem onSelect={() => go('/learn')}><BookOpen className="mr-2 h-4 w-4" />Concept cards</CommandItem>
          <CommandItem onSelect={() => go('/topics')}><Target className="mr-2 h-4 w-4" />Topics</CommandItem>
          <CommandItem onSelect={() => go('/placement-prep')}><Briefcase className="mr-2 h-4 w-4" />Placement Prep</CommandItem>
          <CommandItem onSelect={() => go('/leaderboard')}><Trophy className="mr-2 h-4 w-4" />Leaderboard</CommandItem>
          <CommandItem onSelect={() => go('/achievements')}><Award className="mr-2 h-4 w-4" />Achievements</CommandItem>
          <CommandItem onSelect={() => go('/ai-tutor')}><Sparkles className="mr-2 h-4 w-4" />AI Tutor</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Concept cards">
          {CONCEPT_CARDS.map((c) => (
            <CommandItem key={c.id} onSelect={() => go(`/learn/${c.id}`)} value={`${c.title} ${c.topicLabel} ${c.tags.join(' ')}`}>
              <BookOpen className="mr-2 h-4 w-4" />
              <span className="flex-1">{c.title}</span>
              <span className="text-xs text-muted-foreground ml-2">{c.topicLabel}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
