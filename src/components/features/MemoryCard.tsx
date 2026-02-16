import { Heart, Play } from 'lucide-react';
import { useMemoryStore } from '@/stores/memoryStore';
import type { MemoryItem } from '@/types';
import { motion } from 'framer-motion';

interface MemoryCardProps {
  memory: MemoryItem;
  index: number;
  onClick: (memory: MemoryItem) => void;
}

export default function MemoryCard({ memory, index, onClick }: MemoryCardProps) {
  const { likedIds, toggleLike } = useMemoryStore();
  const isLiked = likedIds.includes(memory.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="masonry-item group"
    >
      <div
        className="relative rounded-xl overflow-hidden bg-card border border-border/40 cursor-pointer transition-all duration-300 hover:border-gold/30 hover:shadow-lg hover:shadow-amber-900/10"
        onClick={() => onClick(memory)}
      >
        <div className="relative overflow-hidden">
          <img
            src={memory.thumbnailUrl}
            alt={memory.title}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {memory.mediaType === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Play className="size-5 text-white ml-0.5" fill="white" />
              </div>
            </div>
          )}
          {memory.status === 'pending' && (
            <div className="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-500/90 text-black">
              Pending
            </div>
          )}
        </div>
        <div className="p-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-bright truncate">
                {memory.title}
              </h3>
              <p className="text-xs text-subtle mt-0.5 line-clamp-2">
                {memory.description}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(memory.id);
              }}
              className="shrink-0 p-1.5 rounded-lg hover:bg-secondary/60 transition-colors"
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart
                className={`size-4 transition-colors ${
                  isLiked ? 'text-red-500 fill-red-500' : 'text-muted-foreground'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-border/30">
            <span className="text-[11px] font-medium text-gold-dim uppercase tracking-wide">
              {memory.eventCategory.replace('-', ' ')}
            </span>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {memory.likes} ♥
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
