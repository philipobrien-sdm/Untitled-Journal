import React, { useEffect, useState } from 'react';
import { Entry, Reflection as ReflectionType } from '../types';
import { generateLexicalReflection } from '../services/geminiService';
import { saveReflection, getReflections } from '../services/storageService';
import { THRESHOLDS } from '../constants';
import { Sparkles, Lock } from 'lucide-react';

interface ReflectionProps {
  entries: Entry[];
}

const Reflection: React.FC<ReflectionProps> = ({ entries }) => {
  const [reflections, setReflections] = useState<ReflectionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Logic to determine if user qualifies
  const entryCount = entries.length;
  // Simple day calculation (approx)
  const daysActive = entries.length > 0 
    ? (Date.now() - new Date(entries[entries.length - 1].timestamp).getTime()) / (1000 * 60 * 60 * 24)
    : 0;

  const canReflect = entryCount >= THRESHOLDS.LEXICAL;

  useEffect(() => {
    setReflections(getReflections());
  }, []);

  const handleReflect = async () => {
    setIsLoading(true);
    try {
      const patterns = await generateLexicalReflection(entries);
      if (patterns.length > 0) {
        const newReflection = saveReflection(patterns, 'lexical');
        setReflections(prev => [newReflection, ...prev.filter(r => r.id !== newReflection.id)]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!canReflect) {
    return (
      <div className="w-full max-w-lg mx-auto pt-32 px-6 text-center">
        <Lock className="w-5 h-5 text-mist mx-auto mb-6" />
        <p className="font-serif text-faint italic mb-4">
          The mirror is still forming.
        </p>
        <p className="font-sans text-xs text-mist uppercase tracking-widest">
          {entryCount} / {THRESHOLDS.LEXICAL} Fragments collected
        </p>
      </div>
    );
  }

  // Check if we need to auto-generate or show button
  // For the spirit of the app, manual trigger feels like "Visiting the mirror"
  // But strictly, prompt says "Only after enough entries exist does it surface reflections."
  // We will show the latest reflection if it's recent (e.g. same day), else offer to Look.

  const latestReflection = reflections[0];
  // Allow regenerate if last reflection is older than 24h or doesn't exist
  const canRegenerate = !latestReflection || (Date.now() - new Date(latestReflection.generatedAt).getTime() > 86400000);

  return (
    <div className="w-full max-w-2xl mx-auto pt-20 px-6 pb-32 fade-in">
      <div className="mb-16 text-center">
        <h2 className="text-sm font-sans font-medium text-faint uppercase tracking-widest mb-2">
          Inquiries
        </h2>
        <div className="w-8 h-[1px] bg-mist mx-auto" />
      </div>

      {reflections.length > 0 ? (
        <div className="space-y-16">
            {reflections.map(r => (
                <div key={r.id} className="space-y-8">
                     {r.patterns.map((pattern, idx) => (
                        <p key={idx} className="font-serif text-xl md:text-2xl text-ink leading-relaxed text-center">
                            {pattern}
                        </p>
                     ))}
                     <p className="text-center text-xs font-sans text-mist uppercase mt-8">
                        Reflected {new Date(r.generatedAt).toLocaleDateString()}
                     </p>
                </div>
            ))}
        </div>
      ) : (
         <div className="text-center font-serif text-faint italic">
            The surface is clear.
         </div>
      )}

      {canRegenerate && (
        <div className="mt-24 text-center">
          <button 
            onClick={handleReflect}
            disabled={isLoading}
            className="group flex items-center justify-center gap-2 mx-auto text-xs font-sans uppercase tracking-widest text-faint hover:text-ink transition-colors disabled:opacity-50"
          >
            {isLoading ? (
               <span className="animate-pulse">Observing...</span>
            ) : (
                <>
                <Sparkles className="w-3 h-3 group-hover:text-ink transition-colors" />
                <span>Update Reflection</span>
                </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Reflection;