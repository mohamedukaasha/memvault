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
    description?: string;
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
      description: 'Enter the admin password to create a new curated collection.',
      onSuccess: () => setIsCreateModalOpen(true)
    });
  };

  const handleNewMemoryClick = () => {
    setPasswordModal({
      isOpen: true,
      title: 'Submit New Memory',
      description: 'The submission form is restricted to students and staff. Please enter the password.',
      onSuccess: () => navigate('/submit')
    });
  };

  const handleDeleteAlbum = (id: string, name: string) => {
    setPasswordModal({
      isOpen: true,
      title: `Delete "${name}" Album`,
      description: `Please enter the admin password to confirm the deletion of "${name}". This cannot be undone.`,
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
    <div className="px-5 md:px-6 lg:px-10 py-6 md:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-1.5"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 mb-2">
            <LayoutGrid className="size-3 text-gold" />
            <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Collections</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-bright tracking-tight leading-none">
            Memory <span className="text-gold">Albums</span>
          </h1>
          <p className="text-sm md:text-base text-subtle font-medium max-w-md">
            Handpicked collections of the most meaningful moments shared by our community.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={handleCreateAlbumClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 rounded-2xl border border-border bg-card text-bright text-[11px] sm:text-xs font-black uppercase tracking-widest hover:bg-muted hover:border-gold/30 transition-all active:scale-95 shadow-xl shadow-black/20"
          >
            <Plus className="size-4 text-gold" />
            <span>New Album</span>
          </button>
          <button
            onClick={handleNewMemoryClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 rounded-2xl bg-gold text-background text-[11px] sm:text-xs font-black uppercase tracking-widest hover:bg-amber-400 transition-all active:scale-95 shadow-lg shadow-gold/20"
          >
            <LayoutGrid className="size-4" />
            <span>New Memory</span>
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {/* Persistent Create Card - Always shows at start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onClick={handleCreateAlbumClick}
          className="group relative aspect-video sm:aspect-[4/5] md:aspect-[4/5] lg:aspect-[3/4] rounded-[2.5rem] border-2 border-dashed border-border/60 hover:border-gold/40 bg-card/40 hover:bg-card/60 cursor-pointer transition-all duration-500 flex flex-col items-center justify-center p-8 text-center"
        >
          <div className="size-16 sm:size-20 rounded-3xl bg-muted/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gold/10 transition-all duration-700 shadow-inner">
            <Plus className="size-8 sm:size-10 text-subtle group-hover:text-gold transition-colors" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-subtle group-hover:text-bright uppercase tracking-tight transition-colors">
            Create Album
          </h3>
          <p className="text-xs text-subtle/40 font-bold uppercase tracking-[0.2em] mt-3 group-hover:text-subtle/60 transition-colors">
            New Collection
          </p>

          {/* Decorative elements for premium feel */}
          <div className="absolute inset-4 rounded-[2rem] border border-white/0 group-hover:border-white/5 transition-colors duration-500 pointer-events-none" />
        </motion.div>

        {albums.map((album, i) => (
          <AlbumCard
            key={album.id}
            album={album}
            index={i}
            onDelete={handleDeleteAlbum}
          />
        ))}

        {/* Show a skeleton hint if no albums yet */}
        {albums.length === 0 && (
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="hidden sm:flex aspect-[4/5] md:aspect-[4/5] lg:aspect-[3/4] rounded-[2.5rem] border border-border/20 bg-card/10 items-center justify-center overflow-hidden relative grayscale opacity-20"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <Ghost className="size-16 text-subtle/20" />
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

