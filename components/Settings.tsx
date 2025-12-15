import React, { useState, useRef } from 'react';
import { clearAllData, getEntries, injectMockData, importEntries } from '../services/storageService';
import Modal from './Modal';
import AboutModal from './AboutModal';

interface SettingsProps {
  onReset: () => void;
  onGenerate?: () => void;
  onImport?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onReset, onGenerate, onImport }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const entries = getEntries();
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `untitled-journal-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        const count = importEntries(data);
        
        if (count > 0) {
          setImportStatus(`Restored ${count} memories.`);
          setTimeout(() => {
            setImportStatus('');
            if (onImport) onImport();
          }, 1500);
        } else {
          setImportStatus('No new entries found.');
          setTimeout(() => setImportStatus(''), 2000);
        }
      } catch (err) {
        setImportStatus('Error: File was unreadable.');
        setTimeout(() => setImportStatus(''), 2000);
      }
    };
    reader.readAsText(file);
    // Reset value so same file can be selected again
    event.target.value = ''; 
  };

  const handleDelete = () => {
    clearAllData();
    onReset();
  };

  const handleGenerateData = () => {
    injectMockData();
    if (onGenerate) {
      onGenerate();
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <div className="w-full max-w-lg mx-auto pt-20 px-6 fade-in">
        <h2 className="text-xs font-sans font-medium text-faint uppercase tracking-widest mb-12 border-b border-mist pb-4">
          Data & Privacy
        </h2>

        <div className="space-y-8">
          
          {/* About Section */}
          <div className="flex justify-between items-center group">
            <div>
              <h3 className="font-serif text-lg text-ink">About</h3>
              <p className="text-sm text-faint font-sans mt-1">
                What this is.<br/>
                What this is not.
              </p>
            </div>
            <button 
              onClick={() => setIsAboutModalOpen(true)}
              className="px-4 py-2 border border-mist rounded-sm text-xs uppercase tracking-widest hover:border-ink transition-colors"
            >
              Read
            </button>
          </div>

          {/* Export Section */}
          <div className="flex justify-between items-center group pt-8 border-t border-transparent">
            <div>
              <h3 className="font-serif text-lg text-ink">Export</h3>
              <p className="text-sm text-faint font-sans mt-1">Take everything with you. JSON format.</p>
            </div>
            <button 
              onClick={handleExport}
              className="px-4 py-2 border border-mist rounded-sm text-xs uppercase tracking-widest hover:border-ink transition-colors"
            >
              Download
            </button>
          </div>

          {/* Import Section */}
          <div className="flex justify-between items-center group pt-8 border-t border-transparent">
            <div>
              <h3 className="font-serif text-lg text-ink">Import</h3>
              <p className="text-sm text-faint font-sans mt-1">
                 {importStatus || "Restore from a JSON backup."}
              </p>
            </div>
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
            <button 
              onClick={handleImportClick}
              className="px-4 py-2 border border-mist rounded-sm text-xs uppercase tracking-widest hover:border-ink transition-colors"
            >
              Load
            </button>
          </div>

          {/* Forget Section */}
          <div className="flex justify-between items-center group pt-8 border-t border-transparent">
            <div>
              <h3 className="font-serif text-lg text-ink">Forget</h3>
              <p className="text-sm text-faint font-sans mt-1">
                Delete all entries immediately.<br/>
                The mirror forgets everything.
              </p>
            </div>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-4 py-2 border border-mist rounded-sm text-xs uppercase tracking-widest hover:border-red-900 hover:text-red-900 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Dev Tools */}
          <div className="mt-24 pt-12 border-t border-mist/30">
               <h3 className="text-xs font-sans font-medium text-faint uppercase tracking-widest mb-4">
                  Developer Tools
              </h3>
              <p className="text-sm text-faint font-sans mb-4">
                  Since meaningful reflections typically take 90+ days to emerge, use this to populate the journal with synthetic data to test the pattern recognition immediately.
              </p>
              <button 
                  onClick={() => setIsGenerateModalOpen(true)}
                  className="text-xs font-mono text-mist hover:text-ink underline"
              >
                  Generate 50 Entries (Simulate 3 months)
              </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Forget everything?"
        description="This will permanently delete all your entries and reflections. This action cannot be undone."
        confirmLabel="Forget"
        isDestructive={true}
      />
      
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onConfirm={handleGenerateData}
        title="Simulate Time?"
        description="This will add 50 synthetic entries to your journal to demonstrate how patterns emerge over time. Your existing entries will be kept."
        confirmLabel="Generate"
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </>
  );
};

export default Settings;