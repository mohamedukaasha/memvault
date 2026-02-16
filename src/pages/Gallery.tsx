import { useState, useMemo, useCallback, useEffect } from 'react';
import { useMemoryStore } from '@/stores/memoryStore';
import FilterBar from '@/components/features/FilterBar';
import MemoryCard from '@/components/features/MemoryCard';
import Lightbox from '@/components/features/Lightbox';
import type { FilterState, MemoryItem } from '@/types';
import { motion } from 'framer-motion';
import emptyImg from '@/assets/empty-state.jpg';

const defaultFilters: FilterState = {
  eventCategory: 'all',
  grade: 'all',
  schoolYear: 'all',
  mediaType: 'all',
  search: '',
};

export default function Gallery() {
  const { memories, fetchMemories } = useMemoryStore();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [lightboxItem, setLightboxItem] = useState<MemoryItem | null>(null);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  const filtered = useMemo(() => {
    return memories
      .filter((m) => m.status === 'approved')
      .filter((m) => filters.eventCategory === 'all' || m.eventCategory === filters.eventCategory)
      .filter((m) => filters.grade === 'all' || m.grade === filters.grade)
      .filter((m) => filters.schoolYear === 'all' || m.schoolYear === filters.schoolYear)
      .filter((m) => filters.mediaType === 'all' || m.mediaType === filters.mediaType)
      .filter(
        (m) =>
          filters.search === '' ||
          m.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          m.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          m.tags.some((t) => t.toLowerCase().includes(filters.search.toLowerCase()))
      );
  }, [memories, filters]);

  const currentIndex = lightboxItem ? filtered.findIndex((m) => m.id === lightboxItem.id) : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setLightboxItem(filtered[currentIndex - 1]);
  }, [currentIndex, filtered]);

  const handleNext = useCallback(() => {
    if (currentIndex < filtered.length - 1) setLightboxItem(filtered[currentIndex + 1]);
  }, [currentIndex, filtered]);

  return (
    <div className="px-6 lg:px-10 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-black text-bright">
          Memory <span className="text-gold">Gallery</span>
        </h1>
        <p className="text-sm text-subtle mt-1">
          Browse every captured moment from across the years
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-8"
      >
        <FilterBar filters={filters} onChange={setFilters} resultCount={filtered.length} />
      </motion.div>

      {filtered.length > 0 ? (
        <div className="masonry-grid">
          {filtered.map((memory, i) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              index={i}
              onClick={setLightboxItem}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="size-48 rounded-2xl overflow-hidden mb-6 opacity-60">
            <img src={emptyImg} alt="No memories found" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-lg font-bold text-bright mb-2">No memories found</h3>
          <p className="text-sm text-subtle text-center max-w-sm">
            Adjust your filters or search to discover more moments. Every memory is waiting to be found.
          </p>
          <button
            onClick={() => setFilters(defaultFilters)}
            className="mt-4 px-5 py-2.5 rounded-xl bg-gold text-background text-sm font-bold hover:bg-amber-400 transition-colors"
          >
            Reset Filters
          </button>
        </motion.div>
      )}

      {lightboxItem && (
        <Lightbox
          memory={lightboxItem}
          onClose={() => setLightboxItem(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < filtered.length - 1}
        />
      )}
    </div>
  );
}
