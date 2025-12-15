import React, { useState, useEffect, useRef } from 'react';
import { SOFT_STARTERS } from '../constants';
import { saveEntry } from '../services/storageService';

interface EntryInputProps {
  onKeep: () => void;
}

const EntryInput: React.FC<EntryInputProps> = ({ onKeep }) => {
  const [text, setText] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Pick a random starter or nothing
    const starter = SOFT_STARTERS[Math.floor(Math.random() * SOFT_STARTERS.length)];
    setPlaceholder(starter);
  }, []);

  const handleKeep = () => {
    if (!text.trim()) return;
    saveEntry(text);
    setText('');
    onKeep();
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  return (
    <div className="w-full max-w-2xl mx-auto pt-20 px-6 fade-in">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-xl md:text-2xl font-serif text-ink placeholder:text-mist focus:outline-none resize-none overflow-hidden leading-relaxed"
        rows={1}
        autoFocus
        spellCheck={false}
      />
      
      <div className={`mt-12 transition-opacity duration-700 ${text.trim().length > 0 ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={handleKeep}
          className="text-sm font-sans tracking-widest text-faint hover:text-ink transition-colors uppercase"
        >
          Keep
        </button>
      </div>
    </div>
  );
};

export default EntryInput;
