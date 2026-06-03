import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import CompanyLogo from './CompanyLogo';

interface CompanyCardProps {
  name: string;
  /** legacy: explicit logo URL */
  logo?: string;
  /** preferred: company slug used by CompanyLogo lookup */
  slug?: string;
  description: string;
  to: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  name,
  logo,
  slug,
  description,
  to,
}) => {
  // Derive slug from the link `/companies/<slug>` when not supplied.
  const resolvedSlug =
    slug ?? to.split('/').filter(Boolean).pop()?.toLowerCase();

  return (
    <Link
      to={to}
      className="group relative flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border/60 hover:border-primary/50 hover:shadow-glow transition-all duration-300"
    >
      <div className="flex items-center gap-4 p-5">
        <CompanyLogo name={name} slug={resolvedSlug} src={logo} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground truncate">{name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {description}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-card border border-border/60 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="w-4 h-4 text-primary" />
        </span>
      </div>

      <div className="px-5 pb-5 pt-2 mt-auto border-t border-border/40 flex flex-wrap gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary">
          Technical
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400">
          Aptitude
        </span>
      </div>
    </Link>
  );
};

export default CompanyCard;
