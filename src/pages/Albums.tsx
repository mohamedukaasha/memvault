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
    <div className="px-6 lg:px-10 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl sm:text-4xl font-black text-bright">
            Memory <span className="text-gold">Albums</span>
          </h1>
          <p className="text-sm text-subtle mt-1">
            Curated collections crafted by students and staff
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={handleCreateAlbumClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-bright text-sm font-bold hover:bg-muted transition-colors"
          >
            <Plus className="size-4" />
            New Album
          </button>
          <button
            onClick={handleNewMemoryClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-background text-sm font-bold hover:bg-amber-400 transition-colors"
          >
            <LayoutGrid className="size-4" />
            New Memory
          </button>
        </motion.div>
      </div>

      {albums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Ghost className="size-8 text-subtle" />
          </div>
          <h3 className="text-xl font-bold text-bright mb-2">No albums yet</h3>
          <p className="text-subtle max-w-xs mx-auto mb-6">
            Start a new collection to group your favorite memories together.
          </p>
          <button
            onClick={handleCreateAlbumClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-background font-bold hover:bg-amber-400 transition-colors"
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

