import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  isDestructive?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmLabel = "Confirm",
  isDestructive = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-paper/90 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-sm bg-paper border border-mist shadow-2xl p-8 animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-mist hover:text-ink transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-xl text-ink mb-4">{title}</h3>
        <p className="font-sans text-sm text-faint leading-relaxed mb-8">
          {description}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`w-full py-3 text-xs uppercase tracking-widest border transition-colors ${
              isDestructive 
                ? 'border-red-900/30 text-red-900 hover:bg-red-50' 
                : 'border-ink text-ink hover:bg-mist/10'
            }`}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 text-xs uppercase tracking-widest text-faint hover:text-ink transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;