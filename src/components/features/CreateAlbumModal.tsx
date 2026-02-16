import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Image as ImageIcon, Loader2, Globe, Lock, User, Info, UploadCloud } from 'lucide-react';
import { useMemoryStore } from '@/stores/memoryStore';
import { supabase } from '@/lib/supabase';

interface CreateAlbumModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateAlbumModal({ isOpen, onClose }: CreateAlbumModalProps) {
    const { addAlbum } = useMemoryStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        createdBy: '',
        isPublic: true,
    });

    useEffect(() => {
        if (isOpen) {
            // Focus name input when modal opens
            setTimeout(() => nameInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        processFile(file);
    };

    const processFile = (file: File | undefined) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (PNG, JPG, etc.)');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File is too large. Please upload an image smaller than 10MB.');
            return;
        }

        setCoverFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        processFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!coverFile || !formData.name) return;

        setIsSubmitting(true);
        try {
            const fileExt = coverFile.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `album-covers/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('memories')
                .upload(filePath, coverFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('memories')
                .getPublicUrl(filePath);

            await addAlbum({
                id: crypto.randomUUID(),
                name: formData.name.trim(),
                description: formData.description.trim(),
                coverUrl: publicUrl,
                createdBy: formData.createdBy.trim() || 'Anonymous Student',
                createdAt: new Date().toISOString(),
                isPublic: formData.isPublic,
            });

            handleClose();
        } catch (err) {
            console.error('Failed to create album:', err);
            alert('Failed to create album. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onClose();
        // Reset form after exit animation
        setTimeout(() => {
            setFormData({ name: '', description: '', createdBy: '', isPublic: true });
            setPreviewUrl(null);
            setCoverFile(null);
        }, 300);
    };

    const MAX_DESC_LENGTH = 150;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-background/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: '100%', scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: '100%', scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-lg sm:max-w-md bg-card border-x border-t sm:border border-border rounded-t-[2.5rem] sm:rounded-[2rem] shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden max-h-[92vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 sm:p-7 border-b border-border/50">
                            <div>
                                <h2 className="text-xl font-black text-bright tracking-tight">Create Album</h2>
                                <p className="text-xs text-subtle mt-0.5">Organize your favorite memories</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2.5 rounded-full hover:bg-muted text-subtle transition-all hover:rotate-90"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {/* Form Body - Scrollable */}
                        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 overflow-y-auto custom-scrollbar">
                            {/* Album Name */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-subtle flex items-center gap-2">
                                    <Info className="size-3" />
                                    Album Name
                                </label>
                                <input
                                    ref={nameInputRef}
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Graduation 2024"
                                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-2xl focus:ring-2 focus:ring-gold/30 focus:border-gold/50 outline-none text-bright transition-all"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold uppercase tracking-wider text-subtle flex items-center gap-2">
                                        <Plus className="size-3" />
                                        Description
                                    </label>
                                    <span className={`text-[10px] font-medium ${formData.description.length > MAX_DESC_LENGTH ? 'text-destructive' : 'text-subtle'}`}>
                                        {formData.description.length}/{MAX_DESC_LENGTH}
                                    </span>
                                </div>
                                <textarea
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 200) })}
                                    placeholder="Tell the story of this collection..."
                                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-2xl focus:ring-2 focus:ring-gold/30 focus:border-gold/50 outline-none text-bright resize-none transition-all"
                                />
                            </div>

                            {/* Image Upload Area */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-subtle flex items-center gap-2">
                                    <UploadCloud className="size-3" />
                                    Cover Image
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`relative aspect-[16/10] rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group flex flex-col items-center justify-center gap-2
                                        ${isDragging ? 'border-gold bg-gold/5 scale-[0.98]' : 'border-border hover:border-gold/40 hover:bg-muted/30'}
                                        ${previewUrl ? 'border-none' : ''}`}
                                >
                                    {previewUrl ? (
                                        <>
                                            <img src={previewUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full text-xs font-bold text-bright border border-white/10">
                                                    Change Image
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className={`p-4 rounded-full bg-muted transition-colors ${isDragging ? 'bg-gold/10 text-gold' : 'text-subtle group-hover:text-gold'}`}>
                                                <ImageIcon className="size-6" />
                                            </div>
                                            <div className="text-center">
                                                <span className="text-sm font-semibold text-bright block">Click or Drag to Upload</span>
                                                <span className="text-[10px] text-subtle uppercase font-bold tracking-widest mt-1">PNG, JPG up to 10MB</span>
                                            </div>
                                        </>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Details Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-subtle flex items-center gap-2">
                                        <User className="size-3" />
                                        Author
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.createdBy}
                                        onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                                        placeholder="Your Name"
                                        className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-2xl focus:ring-2 focus:ring-gold/30 outline-none text-bright transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-subtle flex items-center gap-2">
                                        {formData.isPublic ? <Globe className="size-3" /> : <Lock className="size-3" />}
                                        Visibility
                                    </label>
                                    <select
                                        value={formData.isPublic ? 'public' : 'private'}
                                        onChange={(e) => setFormData({ ...formData, isPublic: e.target.value === 'public' })}
                                        className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-2xl focus:ring-2 focus:ring-gold/30 outline-none text-bright transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="public">Public Collection</option>
                                        <option value="private">Private (Only me)</option>
                                    </select>
                                </div>
                            </div>

                            {/* footer/Submit */}
                            <div className="pt-2">
                                <button
                                    disabled={isSubmitting || !coverFile || !formData.name}
                                    className="w-full py-4 rounded-2xl bg-gold text-background font-black text-sm uppercase tracking-widest hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-gold/20"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="size-5 animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="size-5" />
                                            <span>Create Album</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

