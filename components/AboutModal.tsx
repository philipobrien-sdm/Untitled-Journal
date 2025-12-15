import React from 'react';
import { X } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-paper/90 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-md bg-paper border border-mist shadow-2xl p-8 animate-fade-in max-h-[85vh] overflow-y-auto no-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-mist hover:text-ink transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-xl text-ink mb-8">Untitled Journal</h3>
        
        <div className="space-y-8 font-serif text-base text-ink leading-relaxed">
          <p>
            A quiet journal that does not improve, coach, heal, or optimize.
            It only accumulates shape over time.
          </p>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <p className="font-sans text-xs uppercase tracking-widest text-faint border-b border-mist pb-1">No</p>
              <ul className="list-none space-y-2 text-sm text-faint">
                <li>Streaks</li>
                <li>Advice</li>
                <li>Progress metrics</li>
                <li>"Good" or "Bad"</li>
                <li>Intervention</li>
              </ul>
            </div>

             <div className="space-y-3">
              <p className="font-sans text-xs uppercase tracking-widest text-faint border-b border-mist pb-1">Only</p>
              <ul className="list-none space-y-2 text-sm text-faint">
                <li>Evidence</li>
                <li>Repetition</li>
                <li>Duration</li>
                <li>Silence</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <p>
                The app is useless short-term—intentionally.
            </p>
            <p className="italic text-faint">
                The mirror must not speak first. You write. The app only reflects what is already there.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-mist/30">
             <button
            onClick={onClose}
            className="w-full py-3 text-xs uppercase tracking-widest border border-mist hover:border-ink text-faint hover:text-ink transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;