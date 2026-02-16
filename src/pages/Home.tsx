import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Image, Film, Upload, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemoryStore } from '@/stores/memoryStore';
import MemoryCard from '@/components/features/MemoryCard';
import StatsBar from '@/components/features/StatsBar';
import Lightbox from '@/components/features/Lightbox';
import PasswordModal from '@/components/features/PasswordModal';
import { useState, useCallback, useEffect } from 'react';
import type { MemoryItem } from '@/types';
import heroImg from '@/assets/hero.jpg';

export default function Home() {
  const { memories, fetchMemories } = useMemoryStore();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  const approved = memories.filter((m) => m.status === 'approved');
  const featured = approved.slice(0, 8);
  const [lightboxItem, setLightboxItem] = useState<MemoryItem | null>(null);

  const currentIndex = lightboxItem ? featured.findIndex((m) => m.id === lightboxItem.id) : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setLightboxItem(featured[currentIndex - 1]);
  }, [currentIndex, featured]);

  const handleNext = useCallback(() => {
    if (currentIndex < featured.length - 1) setLightboxItem(featured[currentIndex + 1]);
  }, [currentIndex, featured]);

  const handleNewMemory = () => {
    setIsPasswordModalOpen(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="School memories"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
        </div>

        <div className="relative w-full px-6 lg:px-10 pb-16 pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 mb-6">
                  <div className="size-1.5 rounded-full bg-gold animate-pulse" />
                  <span className="text-xs font-semibold text-gold uppercase tracking-wider">Now Accepting Submissions</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-bright leading-[1.1] text-balance">
                  Every Moment<br />
                  <span className="text-gold">Deserves to Be</span><br />
                  Remembered
                </h1>
                <p className="mt-5 text-base sm:text-lg text-subtle max-w-xl leading-relaxed text-pretty">
                  The vault where your high school memories live forever. Photos, videos, and
                  stories from every grade, every event, every unforgettable moment.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-3 mt-8"
              >
                <Link
                  to="/gallery"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-background text-sm font-bold hover:bg-amber-400 transition-colors"
                >
                  Browse Gallery
                  <ArrowRight className="size-4" />
                </Link>
                <button
                  onClick={handleNewMemory}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary/70 text-foreground text-sm font-semibold border border-border/50 hover:bg-secondary transition-colors"
                >
                  <Upload className="size-4" />
                  Submit Memory
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-5"
            >
              <StatsBar memories={approved} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="px-6 lg:px-10 py-16 border-t border-border/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Image, label: 'Photos', desc: 'High-res snapshots of every event' },
            { icon: Film, label: 'Videos', desc: 'Relive the action in motion' },
            { icon: FolderOpen, label: 'Albums', desc: 'Curated collections by students' },
            { icon: Upload, label: 'Submit', desc: 'Upload your own memories', action: handleNewMemory },
          ].map((feat, i) => (
            <motion.div
              key={feat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-start gap-4 p-5 rounded-xl bg-surface border border-border/30 hover:border-gold/20 transition-colors cursor-pointer"
              onClick={feat.action}
            >
              <div className="size-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                <feat.icon className="size-5 text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-bright">{feat.label}</h3>
                <p className="text-xs text-subtle mt-0.5">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Memories */}
      <section className="px-6 lg:px-10 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-bright">
              Featured <span className="text-gold">Memories</span>
            </h2>
            <p className="text-sm text-subtle mt-1">The moments everyone&apos;s talking about</p>
          </div>
          <Link
            to="/gallery"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-amber-400 transition-colors"
          >
            View All <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="masonry-grid">
          {featured.map((memory, i) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              index={i}
              onClick={setLightboxItem}
            />
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold"
          >
            View All Memories <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {lightboxItem && (
        <Lightbox
          memory={lightboxItem}
          onClose={() => setLightboxItem(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < featured.length - 1}
        />
      )}

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => navigate('/submit')}
        title="Access Submit Form"
        description="Enter the admin password to share a new memory with the community."
      />
    </div>
  );
}
