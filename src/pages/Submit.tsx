import { useState, useEffect } from 'react';
import { useMemoryStore } from '@/stores/memoryStore';
import { EVENT_CATEGORIES, GRADES, SCHOOL_YEARS } from '@/constants/config';
import { Upload, Image, Film, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import type { EventCategory, MediaType } from '@/types';
import { supabase } from '@/lib/supabase';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import PasswordModal from '@/components/features/PasswordModal';

export default function Submit() {
  const { addMemory, albums, fetchAlbums } = useMemoryStore();
  const { toast } = useToast();

  const [submitted, setSubmitted] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('photo');
  const [eventCategory, setEventCategory] = useState<EventCategory>('graduation');
  const [grade, setGrade] = useState('12th');
  const [schoolYear, setSchoolYear] = useState('2024-2025');
  const [uploaderName, setUploaderName] = useState('');
  const [tags, setTags] = useState('');
  const [albumId, setAlbumId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const canSubmit = title.trim() && description.trim() && uploaderName.trim() && file && !uploading;

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: mediaType === 'photo'
      ? { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }
      : { 'video/*': ['.mp4', '.mov'] },
    maxFiles: 1
  });

  const handleSubmit = async () => {
    if (!canSubmit || !file) return;
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${mediaType}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('memories')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('memories')
        .getPublicUrl(filePath);

      const memoryData = {
        id: uuidv4(),
        title: title.trim(),
        description: description.trim(),
        mediaType,
        mediaUrl: publicUrl,
        thumbnailUrl: publicUrl, // For videos, you might want to generate a different thumbnail later
        eventCategory,
        grade,
        schoolYear,
        albumId: albumId || undefined,
        uploadedBy: uploaderName.trim(),
        uploadedAt: new Date().toISOString().split('T')[0],
        status: 'approved' as const,
        likes: 0,
        tags: tags
          .split(',')
          .map((t) => t.trim().toLowerCase().replace(/\s+/g, '-'))
          .filter(Boolean),
      };

      const { error: dbError } = await supabase
        .from('memories')
        .insert([
          {
            id: memoryData.id,
            title: memoryData.title,
            description: memoryData.description,
            media_type: memoryData.mediaType, // Note: Snake case for DB likely
            media_url: memoryData.mediaUrl,
            thumbnail_url: memoryData.thumbnailUrl,
            event_category: memoryData.eventCategory,
            grade: memoryData.grade,
            school_year: memoryData.schoolYear,
            uploaded_by: memoryData.uploadedBy,
            uploaded_at: memoryData.uploadedAt,
            status: memoryData.status,
            likes: memoryData.likes,
            tags: memoryData.tags,
            album_id: memoryData.albumId
          }
        ]);

      if (dbError) {
        console.error("Database error:", dbError);
        toast({
          title: 'Database Warning',
          description: 'Memory uploaded to storage, but database insert failed.',
          variant: 'destructive',
        });
      }

      // Add to local store regardless
      addMemory(memoryData);

      toast({
        title: 'Memory Submitted!',
        description: 'Your memory has been uploaded and is now live!',
      });

      setSubmitted(true);
    } catch (error: any) {
      console.error('Error submitting memory:', error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'There was an error uploading your memory.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="px-6 lg:px-10 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-black text-bright">
          Submit a <span className="text-gold">Memory</span>
        </h1>
        <p className="text-sm text-subtle mt-1">
          Share your moments — they&apos;ll appear in the gallery instantly
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 max-w-lg mx-auto text-center"
          >
            <div className="size-20 rounded-full bg-emerald-500/15 flex items-center justify-center mb-6">
              <CheckCircle2 className="size-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-bright mb-2">Memory Live!</h2>
            <p className="text-sm text-subtle mb-8 leading-relaxed">
              Your memory has been successfully uploaded and added to the gallery
              for everyone to see and enjoy.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setTitle('');
                  setDescription('');
                  setUploaderName('');
                  setTags('');
                  setFile(null);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-background text-sm font-bold hover:bg-amber-400 transition-colors"
              >
                <Upload className="size-4" />
                Submit Another
              </button>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-semibold border border-border/50 hover:bg-secondary/80 transition-colors"
              >
                <ArrowLeft className="size-4" />
                Back to Gallery
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="max-w-4xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-5">
                <div className="p-6 rounded-xl bg-card border border-border/40 space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-bright mb-1.5">Memory Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Championship Victory Celebration"
                      className="w-full h-11 px-4 rounded-lg bg-secondary/60 border border-border/50 text-sm text-foreground focus:ring-1 focus:ring-gold/50 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-bright mb-1.5">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell the story behind this memory..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-secondary/60 border border-border/50 text-sm text-foreground focus:ring-1 focus:ring-gold/50 transition-all outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-bright mb-1.5">Your Name</label>
                    <input
                      type="text"
                      value={uploaderName}
                      onChange={(e) => setUploaderName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full h-11 px-4 rounded-lg bg-secondary/60 border border-border/50 text-sm text-foreground focus:ring-1 focus:ring-gold/50 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-bright mb-1.5">Tags</label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="graduation, sports, etc."
                      className="w-full h-11 px-4 rounded-lg bg-secondary/60 border border-border/50 text-sm text-foreground focus:ring-1 focus:ring-gold/50 transition-all outline-none"
                    />
                  </div>
                </div>

                <div
                  {...getRootProps()}
                  className={`p-6 rounded-xl border-2 border-dashed transition-colors cursor-pointer ${isDragActive ? 'border-gold bg-gold/5' : 'border-border/50 bg-card/50 hover:border-gold/30'}`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center py-8">
                    {file ? (
                      <div className="text-center">
                        <CheckCircle2 className="size-10 text-emerald-500 mb-4 mx-auto" />
                        <p className="text-sm font-semibold text-bright mb-1">{file.name}</p>
                        <p className="text-xs text-subtle">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="size-10 text-gold mb-4" />
                        <p className="text-sm font-semibold text-bright">Drop file here or click to browse</p>
                        <p className="text-xs text-subtle mt-1">{mediaType === 'photo' ? 'Images up to 10MB' : 'Videos up to 100MB'}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-5">
                <div className="p-5 rounded-xl bg-card border border-border/40 space-y-4">
                  <h3 className="text-sm font-bold text-bright">Media Type</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setMediaType('photo')}
                      className={`px-3 py-3 rounded-lg text-sm font-semibold border transition-all ${mediaType === 'photo' ? 'bg-gold/15 text-gold border-gold/30' : 'bg-secondary/40 text-muted-foreground'}`}
                    >
                      Photo
                    </button>
                    <button
                      onClick={() => setMediaType('video')}
                      className={`px-3 py-3 rounded-lg text-sm font-semibold border transition-all ${mediaType === 'video' ? 'bg-gold/15 text-gold border-gold/30' : 'bg-secondary/40 text-muted-foreground'}`}
                    >
                      Video
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-card border border-border/40 space-y-4">
                  <h3 className="text-sm font-bold text-bright">Details</h3>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as EventCategory)}
                    className="w-full h-10 px-3 rounded-lg bg-secondary/60 border border-border/40 text-sm text-foreground outline-none"
                  >
                    {EVENT_CATEGORIES.filter(c => c.value !== 'all').map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-secondary/60 border border-border/40 text-sm text-foreground outline-none"
                  >
                    {GRADES.filter(g => g.value !== 'all').map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                  <select
                    value={schoolYear}
                    onChange={(e) => setSchoolYear(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-secondary/60 border border-border/40 text-sm text-foreground outline-none"
                  >
                    {SCHOOL_YEARS.filter(y => y.value !== 'all').map(y => (
                      <option key={y.value} value={y.value}>{y.label}</option>
                    ))}
                  </select>
                  <select
                    value={albumId}
                    onChange={(e) => setAlbumId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-secondary/60 border border-border/40 text-sm text-foreground outline-none"
                  >
                    <option value="">No Album</option>
                    {albums.map(album => (
                      <option key={album.id} value={album.id}>{album.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  disabled={!canSubmit}
                  className={`w-full py-4 rounded-xl text-sm font-bold transition-all ${canSubmit ? 'bg-gold text-background hover:bg-amber-400' : 'bg-secondary text-muted-foreground opacity-60 cursor-not-allowed'}`}
                >
                  {uploading ? 'Uploading...' : 'Submit Memory'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handleSubmit}
        title="Verify Submission"
        description="Enter the admin password to finalize your memory upload."
      />
    </div>
  );
}
