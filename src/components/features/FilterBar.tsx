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
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search memories..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              onChange({ ...filters, mediaType: filters.mediaType === 'photo' ? 'all' : 'photo' })
            }
            className={`flex items-center gap-1.5 px-3 h-10 rounded-lg text-xs font-medium transition-all border ${
              filters.mediaType === 'photo'
                ? 'bg-gold/15 text-gold border-gold/30'
                : 'bg-secondary/40 text-muted-foreground border-transparent hover:bg-secondary/60'
            }`}
          >
            <Image className="size-3.5" />
            Photos
          </button>
          <button
            onClick={() =>
              onChange({ ...filters, mediaType: filters.mediaType === 'video' ? 'all' : 'video' })
            }
            className={`flex items-center gap-1.5 px-3 h-10 rounded-lg text-xs font-medium transition-all border ${
              filters.mediaType === 'video'
                ? 'bg-gold/15 text-gold border-gold/30'
                : 'bg-secondary/40 text-muted-foreground border-transparent hover:bg-secondary/60'
            }`}
          >
            <Film className="size-3.5" />
            Videos
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="size-4 text-muted-foreground shrink-0" />
        <select
          value={filters.eventCategory}
          onChange={(e) => onChange({ ...filters, eventCategory: e.target.value as FilterState['eventCategory'] })}
          className="h-8 px-3 rounded-lg bg-secondary/60 border border-border/40 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-gold/50 cursor-pointer"
        >
          {EVENT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select
          value={filters.grade}
          onChange={(e) => onChange({ ...filters, grade: e.target.value })}
          className="h-8 px-3 rounded-lg bg-secondary/60 border border-border/40 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-gold/50 cursor-pointer"
        >
          {GRADES.map((g) => (
            <option key={g.value} value={g.value}>{g.label}</option>
          ))}
        </select>
        <select
          value={filters.schoolYear}
          onChange={(e) => onChange({ ...filters, schoolYear: e.target.value })}
          className="h-8 px-3 rounded-lg bg-secondary/60 border border-border/40 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-gold/50 cursor-pointer"
        >
          {SCHOOL_YEARS.map((y) => (
            <option key={y.value} value={y.value}>{y.label}</option>
          ))}
        </select>

        <div className="flex items-center gap-3 ml-auto">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 h-8 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            >
              <X className="size-3" />
              Clear
            </button>
          )}
          <span className="text-xs text-muted-foreground tabular-nums">
            {resultCount} {resultCount === 1 ? 'memory' : 'memories'}
          </span>
        </div>
      </div>
    </div>
  );
}
