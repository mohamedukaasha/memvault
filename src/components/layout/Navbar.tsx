import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NAV_LINKS } from '@/constants/config';
import { Camera, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PasswordModal from '@/components/features/PasswordModal';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleNavLinkClick = (e: React.MouseEvent, to: string) => {
    if (to === '/submit') {
      e.preventDefault();
      setIsPasswordModalOpen(true);
    } else {
      setMobileOpen(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-6 lg:px-10 h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="size-9 rounded-lg bg-gold flex items-center justify-center">
              <Camera className="size-5 text-background" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-bright tracking-tight">
              Mem<span className="text-gold">Vault</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={(e) => handleNavLinkClick(e, link.to)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                    ? 'text-gold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </Link>
              );
            })}
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="ml-2 size-9 rounded-lg bg-gold flex items-center justify-center hover:bg-amber-400 transition-all duration-300 shadow-lg shadow-gold/10 hover:shadow-gold/20 hover:scale-105 active:scale-95"
              title="Submit Memory"
            >
              <Camera className="size-5 text-background" strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="size-9 rounded-lg bg-gold flex items-center justify-center shadow-lg shadow-gold/10"
              title="Submit Memory"
            >
              <Camera className="size-5 text-background" strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-secondary/60 transition-colors text-bright"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="flex flex-col p-4 gap-1">
                {NAV_LINKS.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={(e) => handleNavLinkClick(e, link.to)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                        ? 'text-gold bg-secondary/40'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                        }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => {
          navigate('/submit');
          setMobileOpen(false);
        }}
        title="Admin Authentication"
        description="Please verify your access to enter the submission portal."
      />
    </>
  );
}
