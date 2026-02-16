import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    title?: string;
    description?: string;
}

export default function PasswordModal({
    isOpen,
    onClose,
    onSuccess,
    title = "Admin Access",
    description = "Please enter the password to continue."
}: PasswordModalProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setPassword('');
            setError(false);
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(false);
        setIsVerifying(true);

        // Artificial delay for premium feel
        await new Promise(resolve => setTimeout(resolve, 600));

        if (password === '8thBatchOfUhiis@2026') {
            onSuccess();
            onClose();
        } else {
            setError(true);
            setIsVerifying(false);
            // Shake effect logic is handled by motion.div below
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: '100%', scale: 1 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            x: error ? [0, -10, 10, -10, 10, 0] : 0
                        }}
                        exit={{ opacity: 0, y: '100%', scale: 1 }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 400,
                            x: { duration: 0.4 }
                        }}
                        className="relative w-full max-w-[440px] bg-card border-x border-t sm:border border-border rounded-t-[2.5rem] sm:rounded-[2rem] shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden p-8 sm:mb-0"
                    >
                        {/* Mobile Drag Handle */}
                        <div className="flex justify-center -mt-4 pb-4 sm:hidden">
                            <div className="w-12 h-1.5 rounded-full bg-border/40" />
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2.5 rounded-full hover:bg-muted text-subtle transition-all hover:rotate-90"
                        >
                            <X className="size-5" />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className={`p-4 rounded-3xl transition-colors duration-500 ${error ? 'bg-destructive/10 text-destructive' : 'bg-gold/10 text-gold'}`}>
                                {error ? <AlertCircle className="size-8" /> : <Lock className="size-8" />}
                            </div>

                            <div className="space-y-1">
                                <h2 className="text-xl font-black text-bright tracking-tight">{title}</h2>
                                <p className="text-sm text-subtle leading-relaxed">{description}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="w-full space-y-4 pt-2">
                                <div className="relative group">
                                    <input
                                        ref={inputRef}
                                        type="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError(false);
                                        }}
                                        placeholder="••••••••"
                                        className={`w-full px-4 py-4 bg-muted/50 border rounded-2xl outline-none text-center text-lg tracking-[0.5em] font-bold text-bright transition-all
                                            ${error
                                                ? 'border-destructive focus:ring-4 focus:ring-destructive/20'
                                                : 'border-border focus:border-gold focus:ring-4 focus:ring-gold/20'
                                            }`}
                                    />
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-subtle/50">
                                        <ShieldCheck className="size-5" />
                                    </div>
                                </div>

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs font-bold text-destructive uppercase tracking-widest"
                                    >
                                        Incorrect Password
                                    </motion.p>
                                )}

                                <button
                                    disabled={!password || isVerifying}
                                    className="w-full py-4 rounded-2xl bg-gold text-background font-black text-sm uppercase tracking-widest hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold/20 flex items-center justify-center gap-2"
                                >
                                    {isVerifying ? (
                                        <Loader2 className="size-5 animate-spin" />
                                    ) : (
                                        "Unlock Access"
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
