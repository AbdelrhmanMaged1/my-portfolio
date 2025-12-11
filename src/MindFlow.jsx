import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Trash2, Bot, FileText, Tag, ChevronLeft, Settings, Sparkles, Check, X, Cloud, CloudOff, ArrowLeft
} from 'lucide-react';

// --- CONFIGURATION ---
const API_URL = 'http://localhost:5000/api/notes';
const DEMO_MODE = true; // Set to FALSE when you have the backend running

// --- MOCK DATA ---
const INITIAL_NOTES = [
  { id: 1, title: 'Project Ideas 2024', content: '1. AI Note App\n2. E-commerce Dashboard\n3. Crypto Tracker', tags: ['Ideas', 'Dev'], date: '2023-10-24' },
  { id: 2, title: 'Meeting Notes', content: 'Discussed campaign launch.\n- Budget increase by 20%', tags: ['Work'], date: '2023-10-23' }
];

export default function MindFlow() {
  const [notes, setNotes] = useState(DEMO_MODE ? INITIAL_NOTES : []);
  const [activeNoteId, setActiveNoteId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');

  const activeNote = notes.find(n => n.id === activeNoteId);
  const filteredNotes = notes.filter(note => 
    (note.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (note.content?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!DEMO_MODE) {
      fetch(API_URL).then(res => res.json()).then(data => {
        setNotes(data);
        if (data.length > 0) setActiveNoteId(data[0].id);
      }).catch(err => showNotification("Error connecting to server", "error"));
    }
  }, []);

  const saveToBackend = useCallback(async (note) => {
    if (DEMO_MODE) return;
    setSaveStatus('saving');
    try {
      await fetch(`${API_URL}/${note.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(note) });
      setSaveStatus('saved');
    } catch (error) { setSaveStatus('error'); }
  }, []);

  const handleAddNote = async () => {
    const newNote = { id: Date.now(), title: 'Untitled Note', content: '', tags: [], date: new Date().toISOString().split('T')[0] };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    if (!DEMO_MODE) {
      try { await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newNote) }); } catch (e) { showNotification("Failed to create on server", "error"); }
    }
    showNotification('New note created');
  };

  const handleDeleteNote = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this note?")) return;
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    if (activeNoteId === id && newNotes.length > 0) setActiveNoteId(newNotes[0].id);
    else if (newNotes.length === 0) setActiveNoteId(null);
    if (!DEMO_MODE) await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    showNotification('Note deleted');
  };

  const handleUpdateNote = (key, value) => {
    const updatedNotes = notes.map(note => {
      if (note.id === activeNoteId) {
        const updated = { ...note, [key]: value };
        if (!DEMO_MODE) saveToBackend(updated); 
        return updated;
      }
      return note;
    });
    setNotes(updatedNotes);
  };

  const handleAIEnhance = () => {
    if (!activeNote?.content) return;
    setIsAiLoading(true);
    setTimeout(() => {
      const aiSummary = `\n\n✨ AI Summary:\nThis note discusses ${activeNote.title}.`;
      handleUpdateNote('content', activeNote.content + aiSummary);
      if (!activeNote.tags.includes('AI Enhanced')) handleUpdateNote('tags', [...activeNote.tags, 'AI Enhanced']);
      setIsAiLoading(false);
      showNotification('AI Analysis Complete');
    }, 1500);
  };

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden animate-fadeIn">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col relative`}>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            MindFlow
          </div>
        </div>
        <div className="px-4 pt-4">
           {/* Back to Home Link */}
           <Link to="/" className="text-xs flex items-center gap-1 text-slate-500 hover:text-cyan-400 transition-colors">
              <ArrowLeft size={12} /> Back to Portfolio
           </Link>
        </div>
        <div className="p-4 space-y-4">
          <button onClick={handleAddNote} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-all shadow-lg shadow-cyan-900/20"><Plus size={20} /> New Note</button>
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-cyan-400" size={18} />
            <input type="text" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-800 text-sm rounded-lg pl-10 pr-4 py-2.5 border border-slate-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          {filteredNotes.map(note => (
            <div key={note.id} onClick={() => setActiveNoteId(note.id)} className={`p-3 rounded-lg cursor-pointer group transition-all border border-transparent ${activeNoteId === note.id ? 'bg-slate-800 border-slate-700 shadow-md' : 'hover:bg-slate-800/50'}`}>
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-semibold truncate ${activeNoteId === note.id ? 'text-cyan-400' : 'text-slate-200'}`}>{note.title || 'Untitled'}</h3>
                <button onClick={(e) => handleDeleteNote(e, note.id)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"><Trash2 size={14} /></button>
              </div>
              <p className="text-xs text-slate-500 truncate">{note.content || 'No content'}</p>
              <div className="flex gap-2 mt-2">
                {note.tags.map((tag, i) => <span key={i} className="text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">#{tag}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col h-full bg-slate-950 relative">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`absolute top-4 left-4 z-10 p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white border border-slate-700`}>
          {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>

        {activeNote ? (
          <>
            <div className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-sm pl-16">
              <div className="flex items-center gap-4">
                 <span className="text-xs text-slate-500 flex items-center gap-2"><FileText size={12} /> {activeNote.date}</span>
                 <span className="text-xs flex items-center gap-1">
                  {saveStatus === 'saving' ? <><Cloud className="animate-pulse text-yellow-500" size={12}/> Saving...</> : saveStatus === 'error' ? <><CloudOff className="text-red-500" size={12}/> Offline</> : <><Check className="text-green-500" size={12}/> Saved</>}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleAIEnhance} disabled={isAiLoading} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  {isAiLoading ? "Analyzing..." : <><Bot size={16} /> AI Enhance</>}
                </button>
                <div className="h-8 w-px bg-slate-800 mx-1"></div>
                <button onClick={() => setShowSettings(true)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"><Settings size={20} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
              <input type="text" value={activeNote.title} onChange={(e) => handleUpdateNote('title', e.target.value)} placeholder="Note Title" className="w-full bg-transparent text-4xl font-bold text-white placeholder-slate-600 border-none focus:outline-none mb-6" />
              <div className="flex flex-wrap gap-2 mb-8">
                {activeNote.tags.map((tag, i) => <span key={i} className="flex items-center gap-1 px-3 py-1 bg-cyan-900/20 text-cyan-400 rounded-full text-xs font-medium border border-cyan-900/50"><Tag size={12} /> {tag}</span>)}
                <button onClick={() => { const t = prompt("Tag:"); if(t) handleUpdateNote('tags', [...activeNote.tags, t]) }} className="text-xs text-slate-500 hover:text-cyan-400 flex items-center gap-1 px-2 py-1 border border-slate-800 rounded-full"><Plus size={12} /> Add Tag</button>
              </div>
              <textarea value={activeNote.content} onChange={(e) => handleUpdateNote('content', e.target.value)} placeholder="Start typing..." className="w-full h-[calc(100vh-300px)] bg-transparent text-lg text-slate-300 placeholder-slate-700 border-none focus:outline-none resize-none leading-relaxed" />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-600"><FileText size={64} className="mb-4 opacity-20" /><p>Select a note or create new</p></div>
        )}
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Settings</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-800 rounded-lg"><span>Database</span><span className={`text-xs px-2 py-1 rounded ${DEMO_MODE ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>{DEMO_MODE ? 'Demo Mode' : 'Connected'}</span></div>
            </div>
            <button onClick={() => setShowSettings(false)} className="w-full mt-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg">Close</button>
          </div>
        </div>
      )}

      {notification && (
        <div className="absolute bottom-8 right-8 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeInUp z-50">
          <div className={`${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'} rounded-full p-1`}>{notification.type === 'error' ? <X size={12} className="text-white" /> : <Check size={12} className="text-white" />}</div>
          {notification.msg}
        </div>
      )}
    </div>
  );
}

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);