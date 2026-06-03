import React, { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Curated, reliable logo sources for companies on CrackIt.
 * Uses logo.clearbit.com which serves clean transparent PNGs for known domains.
 * Falls back gracefully to a gradient initial-tile if the image fails.
 */
const COMPANY_DOMAINS: Record<string, string> = {
  infosys: 'infosys.com',
  tcs: 'tcs.com',
  wipro: 'wipro.com',
  accenture: 'accenture.com',
  cognizant: 'cognizant.com',
  ibm: 'ibm.com',
  capgemini: 'capgemini.com',
  hcl: 'hcltech.com',
  techmahindra: 'techmahindra.com',
  deloitte: 'deloitte.com',
  amazon: 'amazon.com',
  microsoft: 'microsoft.com',
  google: 'google.com',
  flipkart: 'flipkart.com',
  zoho: 'zoho.com',
  apple: 'apple.com',
  meta: 'meta.com',
  netflix: 'netflix.com',
};

interface CompanyLogoProps {
  name: string;
  /** lookup key (e.g. "tcs"). Falls back to slugified `name`. */
  slug?: string;
  /** explicit URL override — wins over slug lookup. */
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
};

const resolveSrc = (slug: string, override?: string) => {
  if (override) return override;
  const domain = COMPANY_DOMAINS[slug];
  return domain ? `https://logo.clearbit.com/${domain}` : null;
};

const CompanyLogo: React.FC<CompanyLogoProps> = ({
  name,
  slug,
  src,
  size = 'md',
  className,
}) => {
  const key = (slug ?? name.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const initialSrc = resolveSrc(key, src);
  const [errored, setErrored] = useState(!initialSrc);

  return (
    <div
      className={cn(
        'relative shrink-0 rounded-xl bg-white/95 dark:bg-white p-2 flex items-center justify-center shadow-sm ring-1 ring-border/60 overflow-hidden',
        sizeMap[size],
        className
      )}
    >
      {!errored && initialSrc ? (
        <img
          src={initialSrc}
          alt={`${name} logo`}
          loading="lazy"
          decoding="async"
          width={80}
          height={80}
          className="w-full h-full object-contain"
          onError={() => setErrored(true)}
        />
      ) : (
        <span className="w-full h-full rounded-lg bg-gradient-indigo flex items-center justify-center text-white font-bold text-lg select-none">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
};

export default CompanyLogo;
