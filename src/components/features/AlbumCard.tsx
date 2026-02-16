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
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative rounded-xl overflow-hidden bg-card border border-border/40 cursor-pointer hover:border-gold/30 hover:shadow-lg hover:shadow-amber-900/10 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={album.coverUrl}
          alt={album.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {onDelete && (
          <button
            onClick={handleDelete}
            className="absolute top-3 right-3 p-2 rounded-lg bg-black/40 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 hover:text-red-300 backdrop-blur-md"
            title="Delete Album"
          >
            <Trash2 className="size-4" />
          </button>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
            {album.name}
          </h3>
        </div>
      </div>
      <div className="p-3.5">
        <p className="text-xs text-subtle line-clamp-2 mb-3">{album.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Images className="size-3.5 text-gold" />
            <span className="text-xs font-semibold text-gold tabular-nums">
              {album.itemCount} items
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            by {album.createdBy}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
