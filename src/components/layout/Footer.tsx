import { Camera } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import PasswordModal from '@/components/features/PasswordModal';

export default function Footer() {
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleNewMemory = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPasswordModalOpen(true);
  };

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="size-8 rounded-lg bg-gold flex items-center justify-center">
                <Camera className="size-4 text-background" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold text-bright tracking-tight">
                Mem<span className="text-gold">Vault</span>
              </span>
            </div>
            <p className="text-sm text-subtle leading-relaxed max-w-sm">
              Preserving the moments that matter most. Every laugh, every victory,
              every goodbye — locked in forever.
            </p>
          </div>
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold text-bright mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/gallery" className="text-sm text-subtle hover:text-gold transition-colors">Gallery</Link>
              <Link to="/albums" className="text-sm text-subtle hover:text-gold transition-colors">Albums</Link>
              <button
                onClick={handleNewMemory}
                className="text-left text-sm text-subtle hover:text-gold transition-colors"
              >
                Submit Memory
              </button>
            </div>
          </div>
          <div className="md:col-span-4">
            <h4 className="text-sm font-semibold text-bright mb-3">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {['Graduation', 'Sports', 'Prom', 'Field Trips', 'Clubs'].map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-muted-foreground"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 MemVault. All memories belong to those who lived them.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Made by</span>
            <a
              href="https://www.linkedin.com/in/mohamed-ukaasha-kk-a2334335a/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold font-bold hover:text-bright transition-all duration-300 hover:scale-105"
            >
              Mohamed Ukaasha KK
            </a>
          </div>
        </div>
      </div>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => navigate('/submit')}
        title="Quick Submit"
        description="Verify your identity to jump straight to the submission form."
      />
    </footer>
  );
}
