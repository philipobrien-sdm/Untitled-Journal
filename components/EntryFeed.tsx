import React, { useMemo } from 'react';
import { Entry } from '../types';
import { VAGUE_TIME_LABELS } from '../constants';

interface EntryFeedProps {
  entries: Entry[];
}

const getVagueTime = (timestamp: string): string => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = diff / (1000 * 60 * 60);
  const days = hours / 24;

  if (hours < 1) return VAGUE_TIME_LABELS.NOW;
  if (hours < 24) return VAGUE_TIME_LABELS.TODAY;
  if (hours < 48) return VAGUE_TIME_LABELS.YESTERDAY;
  if (days < 7) return VAGUE_TIME_LABELS.WEEK;
  if (days < 30) return VAGUE_TIME_LABELS.EARLIER;
  if (days < 90) return VAGUE_TIME_LABELS.SOME_TIME;
  return VAGUE_TIME_LABELS.LONG_TIME;
};

const EntryFeed: React.FC<EntryFeedProps> = ({ entries }) => {
  // Group entries by vague time label to avoid repetitive labels
  const groupedEntries = useMemo(() => {
    const groups: { label: string; items: Entry[] }[] = [];
    
    entries.forEach(entry => {
      const label = getVagueTime(entry.timestamp);
      const lastGroup = groups[groups.length - 1];
      
      if (lastGroup && lastGroup.label === label) {
        lastGroup.items.push(entry);
      } else {
        groups.push({ label, items: [entry] });
      }
    });
    return groups;
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center text-mist font-serif italic">
        Silence.
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto pt-10 px-6 pb-32">
      {groupedEntries.map((group, groupIdx) => (
        <div key={groupIdx} className="mb-16 fade-in" style={{ animationDelay: `${groupIdx * 100}ms` }}>
          <div className="sticky top-0 bg-gradient-to-b from-paper via-paper to-transparent pb-4 pt-4 z-10 mb-6">
            <span className="text-xs font-sans font-medium text-faint uppercase tracking-widest">
              {group.label}
            </span>
          </div>
          <div className="space-y-12">
            {group.items.map(entry => (
              <div key={entry.id} className="group">
                <p className="font-serif text-lg leading-relaxed text-ink whitespace-pre-wrap">
                  {entry.text}
                </p>
                {/* Optional: could show exact timestamp on hover, but we are keeping it minimal */}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="h-24 flex items-center justify-center">
        <div className="w-1 h-1 bg-mist rounded-full" />
      </div>
    </div>
  );
};

export default EntryFeed;
