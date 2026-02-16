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
          className="flex items-center gap-2.5 sm:gap-3"
        >
          <button
            onClick={handleCreateAlbumClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-2xl border border-border bg-card text-bright text-sm font-bold hover:bg-muted hover:border-gold/30 transition-all active:scale-95 shadow-lg shadow-black/20"
          >
            <Plus className="size-4 text-gold" />
            <span className="hidden xs:inline">New Album</span>
            <span className="xs:hidden">Album</span>
          </button>
          <button
            onClick={handleNewMemoryClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-2xl bg-gold text-background text-sm font-bold hover:bg-amber-400 transition-all active:scale-95 shadow-lg shadow-gold/20"
          >
            <LayoutGrid className="size-4" />
            <span className="hidden xs:inline">New Memory</span>
            <span className="xs:hidden">Memory</span>
          </button>
        </motion.div>
      </div>

      {albums.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {albums.map((album, i) => (
            <AlbumCard
              key={album.id}
              album={album}
              index={i}
              onDelete={handleDeleteAlbum}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 md:py-32 text-center bg-card/50 border border-border/50 rounded-[2.5rem] border-dashed"
        >
          <div className="size-20 rounded-3xl bg-muted/80 flex items-center justify-center mb-6 shadow-inner">
            <Ghost className="size-10 text-subtle/60" />
          </div>
          <h3 className="text-2xl font-black text-bright mb-3">No albums yet</h3>
          <p className="text-subtle max-w-xs mx-auto mb-8 text-sm md:text-base leading-relaxed">
            Every great journey starts with a single step. Start a new collection to group your favorite memories together.
          </p>
          <button
            onClick={handleCreateAlbumClick}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-bright text-background font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
          >
            <Plus className="size-5" />
            Create First Album
          </button>
        </motion.div>
      )}

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

