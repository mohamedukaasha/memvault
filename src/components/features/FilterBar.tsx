import { EVENT_CATEGORIES, GRADES, SCHOOL_YEARS } from '@/constants/config';
import { Search, SlidersHorizontal, Image, Film, X } from 'lucide-react';
import type { FilterState } from '@/types';

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
}

export default function FilterBar({ filters, onChange, resultCount }: FilterBarProps) {
  const hasActiveFilters =
    filters.eventCategory !== 'all' ||
    filters.grade !== 'all' ||
    filters.schoolYear !== 'all' ||
    filters.mediaType !== 'all' ||
    filters.search !== '';

  const resetFilters = () =>
    onChange({ eventCategory: 'all', grade: 'all', schoolYear: 'all', mediaType: 'all', search: '' });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-subtle" />
          <input
            type="text"
            placeholder="Search memories..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border/60 text-sm text-bright placeholder:text-subtle/50 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/40 transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              onChange({ ...filters, mediaType: filters.mediaType === 'photo' ? 'all' : 'photo' })
            }
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 h-11 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${filters.mediaType === 'photo'
                ? 'bg-gold text-background border-gold'
                : 'bg-card text-subtle border-border/60 hover:border-gold/30 hover:bg-muted/50'
              }`}
          >
            <Image className="size-4" />
            Photos
          </button>
          <button
            onClick={() =>
              onChange({ ...filters, mediaType: filters.mediaType === 'video' ? 'all' : 'video' })
            }
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 h-11 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${filters.mediaType === 'video'
                ? 'bg-gold text-background border-gold'
                : 'bg-card text-subtle border-border/60 hover:border-gold/30 hover:bg-muted/50'
              }`}
          >
            <Film className="size-4" />
            Videos
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-1">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="hidden xs:flex items-center justify-center size-8 rounded-lg bg-muted/50 border border-border/40 shrink-0">
            <SlidersHorizontal className="size-4 text-subtle" />
          </div>
          <select
            value={filters.eventCategory}
            onChange={(e) => onChange({ ...filters, eventCategory: e.target.value as FilterState['eventCategory'] })}
            className="flex-1 xs:flex-none h-9 px-3 rounded-lg bg-card border border-border/60 text-xs font-bold text-subtle uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-gold/50 cursor-pointer hover:border-gold/30 transition-colors appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
          >
            {EVENT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <select
            value={filters.grade}
            onChange={(e) => onChange({ ...filters, grade: e.target.value })}
            className="flex-1 xs:flex-none h-9 px-3 rounded-lg bg-card border border-border/60 text-xs font-bold text-subtle uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-gold/50 cursor-pointer hover:border-gold/30 transition-colors appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
          >
            {GRADES.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
          <select
            value={filters.schoolYear}
            onChange={(e) => onChange({ ...filters, schoolYear: e.target.value })}
            className="flex-1 xs:flex-none h-9 px-3 rounded-lg bg-card border border-border/60 text-xs font-bold text-subtle uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-gold/50 cursor-pointer hover:border-gold/30 transition-colors appearance-none pr-8"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
          >
            {SCHOOL_YEARS.map((y) => (
              <option key={y.value} value={y.value}>{y.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-4 w-full md:w-auto md:ml-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-subtle/50 tabular-nums">
            Found {resultCount} {resultCount === 1 ? 'memory' : 'memories'}
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 h-8 rounded-full text-[10px] font-black uppercase tracking-widest text-destructive hover:bg-destructive/10 border border-destructive/20 transition-all active:scale-95"
            >
              <X className="size-3" />
              Reset All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
