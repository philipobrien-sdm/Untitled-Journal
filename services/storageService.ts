import { Entry, Reflection } from '../types';
import { MOCK_ENTRIES_POOL } from '../data/mockEntries';

const STORAGE_KEY_ENTRIES = 'untitled_journal_entries';
const STORAGE_KEY_REFLECTIONS = 'untitled_journal_reflections';

export const saveEntry = (text: string): Entry => {
  const entries = getEntries();
  const newEntry: Entry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    text,
  };
  const updatedEntries = [newEntry, ...entries];
  localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(updatedEntries));
  return newEntry;
};

export const getEntries = (): Entry[] => {
  const raw = localStorage.getItem(STORAGE_KEY_ENTRIES);
  return raw ? JSON.parse(raw) : [];
};

export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEY_ENTRIES);
  localStorage.removeItem(STORAGE_KEY_REFLECTIONS);
};

export const getReflections = (): Reflection[] => {
  const raw = localStorage.getItem(STORAGE_KEY_REFLECTIONS);
  return raw ? JSON.parse(raw) : [];
};

export const saveReflection = (patterns: string[], type: Reflection['type']): Reflection => {
  const reflections = getReflections();
  const newReflection: Reflection = {
    id: crypto.randomUUID(),
    generatedAt: new Date().toISOString(),
    patterns,
    type,
  };
  // Only keep the latest reflection of each type to maintain minimalism
  const filtered = reflections.filter(r => r.type !== type);
  const updated = [newReflection, ...filtered];
  localStorage.setItem(STORAGE_KEY_REFLECTIONS, JSON.stringify(updated));
  return newReflection;
};

export const importEntries = (importedData: any[]): number => {
  if (!Array.isArray(importedData)) {
    return 0;
  }

  // Basic validation: must have id, timestamp, text
  const validEntries: Entry[] = importedData.filter(item => 
    typeof item.id === 'string' &&
    typeof item.timestamp === 'string' &&
    typeof item.text === 'string'
  );

  if (validEntries.length === 0) {
    return 0;
  }

  const currentEntries = getEntries();
  const currentIds = new Set(currentEntries.map(e => e.id));
  
  // Only add entries that don't exist yet
  const newEntries = validEntries.filter(e => !currentIds.has(e.id));
  
  if (newEntries.length === 0) return 0;

  const combined = [...newEntries, ...currentEntries];
  // Sort descending by date
  combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(combined));
  return newEntries.length;
};

// --- MOCK DATA FOR DEMO ---
export const injectMockData = () => {
  const existingEntries = getEntries();
  const newEntries: Entry[] = [];
  const now = new Date();
  
  // Create a copy of the pool to pick from
  const pool = [...MOCK_ENTRIES_POOL];
  const entriesToGenerate = 50; 
  
  // Randomly select distinct entries from the pool
  const selectedTexts: string[] = [];
  for (let i = 0; i < entriesToGenerate; i++) {
    if (pool.length === 0) break;
    const randomIndex = Math.floor(Math.random() * pool.length);
    selectedTexts.push(pool[randomIndex]);
    pool.splice(randomIndex, 1); // Remove to avoid duplicates
  }

  // Distribute entries over the last 120 days
  selectedTexts.forEach(text => {
    // Random date within last 120 days
    const date = new Date(now);
    const daysBack = Math.floor(Math.random() * 120);
    date.setDate(date.getDate() - daysBack);
    
    // Add some random time variation
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));

    newEntries.push({
      id: crypto.randomUUID(),
      timestamp: date.toISOString(),
      text
    });
  });
  
  // Combine with existing and sort
  const allEntries = [...newEntries, ...existingEntries];
  allEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(allEntries));
};