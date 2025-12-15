import React, { useState, useEffect } from 'react';
import { PenLine, BookOpen, User, Settings as SettingsIcon } from 'lucide-react';
import EntryInput from './components/EntryInput';
import EntryFeed from './components/EntryFeed';
import Reflection from './components/Reflection';
import Settings from './components/Settings';
import { AppView, Entry } from './types';
import { getEntries } from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.WRITE);
  const [entries, setEntries] = useState<Entry[]>([]);

  const loadEntries = () => {
    const data = getEntries();
    setEntries(data);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleEntrySaved = () => {
    loadEntries();
    // After keeping, strictly stay on write or maybe go to feed? 
    // "Save -> One action: Keep -> No confirmation message"
    // Conceptually, it just clears and is ready for more, or we drift to silence.
    // Let's stay on WRITE view but reset (handled in component).
  };

  const handleReset = () => {
    setEntries([]);
    setView(AppView.WRITE);
  };

  const handleGenerate = () => {
    loadEntries();
    setView(AppView.READ);
  };

  const handleImport = () => {
    loadEntries();
    setView(AppView.READ);
  };

  const NavButton = ({ target, icon: Icon, label }: { target: AppView; icon: any; label: string }) => (
    <button
      onClick={() => setView(target)}
      className={`p-4 transition-colors duration-300 flex flex-col items-center gap-1 group ${view === target ? 'text-ink' : 'text-mist hover:text-faint'}`}
      title={label}
    >
      <Icon strokeWidth={1.5} className="w-5 h-5 transition-transform duration-500 group-hover:-translate-y-0.5" />
      {/* Label hidden, only visual icon for minimalism */}
    </button>
  );

  return (
    <div className="min-h-screen bg-paper selection:bg-mist selection:text-ink flex flex-col">
      {/* Main Content Area */}
      <main className="flex-grow relative">
        {view === AppView.WRITE && <EntryInput onKeep={handleEntrySaved} />}
        {view === AppView.READ && <EntryFeed entries={entries} />}
        {view === AppView.REFLECT && <Reflection entries={entries} />}
        {view === AppView.SETTINGS && <Settings onReset={handleReset} onGenerate={handleGenerate} onImport={handleImport} />}
      </main>

      {/* Sticky Bottom Navigation - "Persistent Call-to-Action" */}
      <nav className="sticky bottom-0 w-full bg-paper/90 backdrop-blur-sm border-t border-mist/20 py-2">
        <div className="max-w-md mx-auto flex justify-between px-8">
            <NavButton target={AppView.WRITE} icon={PenLine} label="Entry" />
            <NavButton target={AppView.READ} icon={BookOpen} label="Evidence" />
            <NavButton target={AppView.REFLECT} icon={User} label="Mirror" />
            <NavButton target={AppView.SETTINGS} icon={SettingsIcon} label="Settings" />
        </div>
      </nav>
    </div>
  );
};

export default App;