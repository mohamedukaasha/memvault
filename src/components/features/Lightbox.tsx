import { X, Heart, ChevronLeft, ChevronRight, Play, Calendar, User, Tag, Trash2, Edit3, Save, Layers } from 'lucide-react';
import type { MemoryItem, EventCategory } from '@/types';
import { useMemoryStore } from '@/stores/memoryStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EVENT_CATEGORIES, GRADES, SCHOOL_YEARS } from '@/constants/config';
import PasswordModal from './PasswordModal';

interface LightboxProps {
  memory: MemoryItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function Lightbox({ memory, onClose, onPrev, onNext, hasPrev, hasNext }: LightboxProps) {
  const { likedIds, toggleLike, updateMemory, deleteMemory } = useMemoryStore();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<EventCategory>('other');
  const [editGrade, setEditGrade] = useState('');
  const [editSchoolYear, setEditSchoolYear] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [passwordModal, setPasswordModal] = useState<{
    isOpen: boolean;
    onSuccess: () => void;
    title: string;
    description: string;
  }>({
    isOpen: false,
    onSuccess: () => { },
    title: '',
    description: '',
  });

  useEffect(() => {
    if (memory) {
      setEditTitle(memory.title);
      setEditDescription(memory.description);
      setEditCategory(memory.eventCategory);
      setEditGrade(memory.grade);
      setEditSchoolYear(memory.schoolYear);
      setIsEditing(false);
    }
  }, [memory]);

  if (!memory) return null;

  const isLiked = likedIds.includes(memory.id);

  const handleUpdate = async () => {
    if (!editTitle.trim()) return;
    setIsSaving(true);
    try {
      await updateMemory(memory.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        eventCategory: editCategory,
        grade: editGrade,
        schoolYear: editSchoolYear,
      });
      setIsEditing(false);
      toast({
        title: 'Memory Updated',
        description: 'Changes have been saved successfully.',
      });
    } catch (err) {
      toast({
        title: 'Update Failed',
        description: 'There was an error saving your changes.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    setPasswordModal({
      isOpen: true,
      title: 'Delete Memory',
      description: `Enter the admin password to permanently delete "${memory.title}". This action cannot be undone.`,
      onSuccess: async () => {
        setIsDeleting(true);
        try {
          await deleteMemory(memory.id);
          onClose();
          toast({
            title: 'Memory Deleted',
            description: 'The memory has been removed from the vault.',
          });
        } catch (err) {
          toast({
            title: 'Delete Failed',
            description: 'There was an error deleting the memory.',
            variant: 'destructive',
          });
        } finally {
          setIsDeleting(false);
        }
      }
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-6xl mx-auto sm:mx-4 grid grid-cols-1 lg:grid-cols-12 gap-0 bg-card sm:rounded-2xl overflow-hidden border-t sm:border border-border/40 h-full sm:h-auto max-h-[100dvh] sm:max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="lg:col-span-8 relative bg-black flex items-center justify-center min-h-[40vh] sm:min-h-[500px]">
            {memory.mediaType === 'video' ? (
              <video
                src={memory.mediaUrl}
                controls
                autoPlay
                className="w-full h-full object-contain max-h-[50vh] lg:max-h-[85vh]"
              />
            ) : (
              <img
                src={memory.mediaUrl}
                alt={memory.title}
                className="w-full h-full object-contain max-h-[50vh] lg:max-h-[85vh]"
              />
            )}
            {hasPrev && (
              <button
                onClick={onPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors border border-white/10"
                aria-label="Previous"
              >
                <ChevronLeft className="size-5 text-white" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={onNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors border border-white/10"
                aria-label="Next"
              >
                <ChevronRight className="size-5 text-white" />
              </button>
            )}
          </div>

          <div className="lg:col-span-4 p-5 sm:p-8 flex flex-col overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-6">
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-secondary/60 border border-border/50 text-base font-bold text-bright focus:outline-none focus:ring-1 focus:ring-gold/50"
                  placeholder="Memory Title"
                  autoFocus
                />
              ) : (
                <h2 className="text-xl sm:text-2xl font-black text-bright leading-tight tracking-tight">{memory.title}</h2>
              )}
              <button
                onClick={onClose}
                className="shrink-0 size-10 rounded-xl bg-secondary/60 flex items-center justify-center hover:bg-secondary transition-all hover:rotate-90"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            {isEditing ? (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border/50 text-sm text-subtle focus:outline-none focus:ring-1 focus:ring-gold/50 resize-none mb-6"
                rows={4}
                placeholder="Description"
              />
            ) : (
              <p className="text-sm text-subtle leading-relaxed mb-6">
                {memory.description}
              </p>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <User className="size-4 text-gold shrink-0" />
                <span className="text-muted-foreground w-24">Uploaded by</span>
                <span className="text-bright font-medium">{memory.uploadedBy}</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Calendar className="size-4 text-gold shrink-0" />
                <span className="text-muted-foreground w-24">School Year</span>
                {isEditing ? (
                  <select
                    value={editSchoolYear}
                    onChange={(e) => setEditSchoolYear(e.target.value)}
                    className="flex-1 h-9 px-2 rounded-lg bg-secondary/60 border border-border/40 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-gold/50"
                  >
                    {SCHOOL_YEARS.filter(y => y.value !== 'all').map(y => (
                      <option key={y.value} value={y.value}>{y.label}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-bright font-medium">{memory.schoolYear}</span>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Tag className="size-4 text-gold shrink-0" />
                <span className="text-muted-foreground w-24">Event</span>
                {isEditing ? (
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as EventCategory)}
                    className="flex-1 h-9 px-2 rounded-lg bg-secondary/60 border border-border/40 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-gold/50"
                  >
                    {EVENT_CATEGORIES.filter(c => c.value !== 'all').map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-bright font-medium capitalize">
                    {memory.eventCategory.replace('-', ' ')}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Layers className="size-4 text-gold shrink-0" />
                <span className="text-muted-foreground w-24">Grade</span>
                {isEditing ? (
                  <select
                    value={editGrade}
                    onChange={(e) => setEditGrade(e.target.value)}
                    className="flex-1 h-9 px-2 rounded-lg bg-secondary/60 border border-border/40 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-gold/50"
                  >
                    {GRADES.filter(g => g.value !== 'all').map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-bright font-medium">{memory.grade}</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {memory.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-secondary text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Admin Actions Area */}
            <div className="flex items-center gap-2 mb-4 pt-4 border-t border-border/20">
              {isEditing ? (
                <>
                  <button
                    onClick={handleUpdate}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gold text-background text-xs font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="size-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    ) : (
                      <Save className="size-3.5" />
                    )}
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-2.5 rounded-lg bg-secondary text-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-secondary/50 text-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors border border-border/40"
                  >
                    <Edit3 className="size-3.5" /> Edit Details
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-3 py-2.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500/20 transition-colors border border-red-500/20 disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <div className="size-3.5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/30">
              <button
                onClick={() => toggleLike(memory.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${isLiked
                  ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                  : 'bg-secondary hover:bg-secondary/80 text-muted-foreground border border-transparent'
                  }`}
              >
                <Heart className={`size-4 ${isLiked ? 'fill-red-400' : ''}`} />
                {memory.likes}
              </button>
              <div className="ml-auto flex items-center gap-1.5">
                {!isEditing && (
                  <>
                    <span className="px-3 py-1.5 text-xs font-semibold rounded-md bg-gold/15 text-gold">
                      {memory.grade}
                    </span>
                    <span className="px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-muted-foreground">
                      {memory.schoolYear}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <PasswordModal
        isOpen={passwordModal.isOpen}
        title={passwordModal.title}
        description={passwordModal.description}
        onClose={() => setPasswordModal(prev => ({ ...prev, isOpen: false }))}
        onSuccess={passwordModal.onSuccess}
      />
    </AnimatePresence>
  );
}
