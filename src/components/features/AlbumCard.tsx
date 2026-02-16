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
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-card border border-border/60 cursor-pointer hover:border-gold/40 hover:shadow-2xl hover:shadow-gold/5 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] sm:aspect-[3/4] md:aspect-[4/3] overflow-hidden">
        <img
          src={album.coverUrl}
          alt={album.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {onDelete && (
          <button
            onClick={handleDelete}
            className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/60 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white backdrop-blur-md border border-white/10"
            title="Delete Album"
          >
            <Trash2 className="size-4" />
          </button>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-0.5 rounded-md bg-gold/10 backdrop-blur-md border border-gold/20 flex items-center gap-1.5">
              <Images className="size-3 text-gold" />
              <span className="text-[10px] font-black text-gold uppercase tracking-wider">
                {album.itemCount} Items
              </span>
            </div>
          </div>
          <h3 className="text-lg md:text-xl font-black text-white leading-tight line-clamp-2 tracking-tight">
            {album.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <p className="text-sm text-subtle line-clamp-2 mb-6 font-medium leading-relaxed">
          {album.description || "A beautiful collection of memories waiting to be explored."}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-border/40">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-full bg-muted flex items-center justify-center border border-border/60">
              <span className="text-[10px] font-bold text-subtle">
                {album.createdBy.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-[11px] font-bold text-subtle truncate max-w-[100px] uppercase tracking-wide">
              {album.createdBy}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-black text-gold/60 uppercase tracking-widest group-hover:text-gold transition-colors">
            View <span className="hidden sm:inline">Album</span>
          </div>
        </div>
      </div>

      {/* Hover Highlight */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </motion.div>
  );
}
