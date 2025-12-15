export interface Entry {
  id: string;
  timestamp: string; // ISO Date
  text: string;
}

export enum AppView {
  WRITE = 'WRITE',
  READ = 'READ',
  REFLECT = 'REFLECT',
  SETTINGS = 'SETTINGS',
}

export interface Reflection {
  id: string;
  generatedAt: string;
  patterns: string[];
  type: 'lexical' | 'rhythm' | 'recurrence';
}

export interface Thresholds {
  entryCount: number;
  daysActive: number;
}
