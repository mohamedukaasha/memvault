import type { Album } from '@/types';
import { motion } from 'framer-motion';
import { Images, Trash2 } from 'lucide-react';

interface AlbumCardProps {
  album: Album;
  index: number;
  onDelete?: (id: string, name: string) => void;
}

export default function AlbumCard({ album, index, onDelete }: AlbumCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(album.id, album.name);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-[2.5rem] overflow-hidden bg-card border border-border/60 cursor-pointer hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/5 transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-video sm:aspect-[4/5] md:aspect-[4/5] lg:aspect-[3/4] overflow-hidden">
        <img
          src={album.coverUrl}
          alt={album.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
        />

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {onDelete && (
          <button
            onClick={handleDelete}
            className="absolute top-5 right-5 p-3 rounded-2xl bg-black/60 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white backdrop-blur-xl border border-white/10 shadow-2xl"
            title="Delete Album"
          >
            <Trash2 className="size-4" />
          </button>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="px-2.5 py-1 rounded-lg bg-gold/20 backdrop-blur-md border border-gold/30 flex items-center gap-1.5">
              <Images className="size-3 text-gold" />
              <span className="text-[10px] font-black text-gold uppercase tracking-widest">
                {album.itemCount} Items
              </span>
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight line-clamp-2 tracking-tight">
            {album.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between bg-gradient-to-b from-card to-background/50">
        <p className="text-sm text-subtle line-clamp-3 mb-8 font-medium leading-relaxed opacity-80">
          {album.description || "A beautiful collection of memories waiting to be explored and shared with the community."}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-border/40">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-muted flex items-center justify-center border border-border/60 shadow-inner">
              <span className="text-xs font-black text-subtle">
                {album.createdBy.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-subtle/50 uppercase tracking-widest">Created By</span>
              <span className="text-xs font-black text-bright uppercase tracking-wide truncate max-w-[120px]">
                {album.createdBy}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-black text-gold uppercase tracking-[0.15em] group-hover:gap-3 transition-all">
            View <span className="hidden xs:inline">Album</span>
            <div className="size-1.5 rounded-full bg-gold animate-pulse" />
          </div>
        </div>
      </div>

      {/* Hover Highlight */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
    </motion.div>
  );
}
