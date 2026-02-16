import { useState, useEffect } from 'react';
import { useMemoryStore } from '@/stores/memoryStore';
import AlbumCard from '@/components/features/AlbumCard';
import CreateAlbumModal from '@/components/features/CreateAlbumModal';
import PasswordModal from '@/components/features/PasswordModal';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, Ghost } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Albums() {
  const { albums, fetchAlbums, deleteAlbum } = useMemoryStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [passwordModal, setPasswordModal] = useState<{
    isOpen: boolean;
    onSuccess: () => void;
    title: string;
  }>({
    isOpen: false,
    onSuccess: () => { },
    title: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const handleCreateAlbumClick = () => {
    setPasswordModal({
      isOpen: true,
      title: 'Create New Album',
      onSuccess: () => setIsCreateModalOpen(true)
    });
  };

  const handleNewMemoryClick = () => {
    setPasswordModal({
      isOpen: true,
      title: 'Submit New Memory',
      onSuccess: () => navigate('/submit')
    });
  };

  const handleDeleteAlbum = (id: string, name: string) => {
    setPasswordModal({
      isOpen: true,
      title: `Delete "${name}" Album`,
      onSuccess: async () => {
        try {
          await deleteAlbum(id);
          // Show some toast or success message if we had a toast system
        } catch (error) {
          console.error('Failed to delete album:', error);
          alert('Failed to delete album. Please try again.');
        }
      }
    });
  };

  return (
    <div className="px-4 md:px-6 lg:px-10 py-6 md:py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-1"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-bright tracking-tight">
            Memory <span className="text-gold">Albums</span>
          </h1>
          <p className="text-sm md:text-base text-subtle font-medium">
            Curated collections crafted by students and staff
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2.5 sm:gap-4"
        >
          <button
            onClick={handleCreateAlbumClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3.5 rounded-2xl border border-border bg-card text-bright text-sm font-black uppercase tracking-widest hover:bg-muted hover:border-gold/30 transition-all active:scale-95 shadow-xl shadow-black/20"
          >
            <Plus className="size-4 text-gold shrink-0" />
            <span>New Album</span>
          </button>
          <button
            onClick={handleNewMemoryClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3.5 rounded-2xl bg-gold text-background text-sm font-black uppercase tracking-widest hover:bg-amber-400 transition-all active:scale-95 shadow-lg shadow-gold/20"
          >
            <LayoutGrid className="size-4 shrink-0" />
            <span>New Memory</span>
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Persistent Create Card - Always shows at start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onClick={handleCreateAlbumClick}
          className="group relative aspect-[4/3] sm:aspect-[3/4] md:aspect-[4/3] rounded-3xl border-2 border-dashed border-border/60 hover:border-gold/40 bg-card/40 hover:bg-card/60 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="size-14 sm:size-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gold/10 transition-all duration-500">
            <Plus className="size-7 sm:size-8 text-subtle group-hover:text-gold" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-subtle group-hover:text-bright uppercase tracking-tight transition-colors">
            Create Album
          </h3>
          <p className="text-[10px] text-subtle/40 font-bold uppercase tracking-[0.2em] mt-2 group-hover:text-subtle/60 transition-colors">
            New Collection
          </p>
        </motion.div>

        {albums.map((album, i) => (
          <AlbumCard
            key={album.id}
            album={album}
            index={i}
            onDelete={handleDeleteAlbum}
          />
        ))}

        {/* Show a skeleton hint if no albums yet (Empty state integrated into grid) */}
        {albums.length === 0 && (
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="hidden xs:flex aspect-[4/3] sm:aspect-[3/4] md:aspect-[4/3] rounded-3xl border border-border/20 bg-card/10 items-center justify-center overflow-hidden relative grayscale opacity-20"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <Ghost className="size-12 text-subtle/20" />
              </div>
            ))}
          </>
        )}
      </div>

      <CreateAlbumModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <PasswordModal
        isOpen={passwordModal.isOpen}
        title={passwordModal.title}
        onClose={() => setPasswordModal(prev => ({ ...prev, isOpen: false }))}
        onSuccess={passwordModal.onSuccess}
      />
    </div>
  );
}

