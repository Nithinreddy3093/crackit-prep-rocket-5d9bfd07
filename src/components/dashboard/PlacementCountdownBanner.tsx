import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Briefcase, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const KEY_DATE = 'crackit_placement_target_date';
const KEY_LABEL = 'crackit_placement_target_label';

interface Props {
  readiness: number; // 0–100, derived from avg score
}

const PlacementCountdownBanner: React.FC<Props> = ({ readiness }) => {
  const navigate = useNavigate();
  const [date, setDate] = useState<string>(() => localStorage.getItem(KEY_DATE) || '');
  const [label, setLabel] = useState<string>(() => localStorage.getItem(KEY_LABEL) || '');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (date) localStorage.setItem(KEY_DATE, date);
    if (label) localStorage.setItem(KEY_LABEL, label);
  }, [date, label]);

  const daysLeft = date
    ? Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86400000))
    : null;

  if (!date || editing) {
    return (
      <div className="rounded-2xl glass p-4 sm:p-5 flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Briefcase className="h-4 w-4 text-primary-glow" /> Set your placement target
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            We'll turn it into a live countdown and tune your daily missions.
          </p>
        </div>
        <Input
          placeholder="e.g. TCS NQT"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="sm:w-44"
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="sm:w-44"
        />
        <Button
          variant="premium"
          disabled={!date}
          onClick={() => setEditing(false)}
        >
          Save
        </Button>
        {editing && (
          <Button variant="ghost" size="icon" onClick={() => setEditing(false)} aria-label="Cancel">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass-strong p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="h-11 w-11 rounded-xl bg-gradient-indigo flex items-center justify-center shrink-0">
          <Calendar className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-primary-glow">Placement countdown</div>
          <div className="font-display text-lg sm:text-xl font-bold text-foreground truncate">
            {label || 'Your target'} in <span className="gradient-text">{daysLeft}</span> day{daysLeft === 1 ? '' : 's'}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Readiness</div>
          <div className="text-lg font-bold gradient-text">{readiness}%</div>
        </div>
        <Button size="sm" variant="outline" onClick={() => navigate('/placement-prep')}>
          Open plan
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setEditing(true)} aria-label="Edit target">
          Edit
        </Button>
      </div>
    </div>
  );
};

export default PlacementCountdownBanner;
