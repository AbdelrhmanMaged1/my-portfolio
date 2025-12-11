import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  Github, Linkedin, Mail, ExternalLink, Code2, Terminal, Cpu, Globe, 
  Menu, X, ChevronDown, ChevronLeft, Database, Sparkles, Plus, Search, Trash2, // <--- ADDED ChevronLeft HERE
  Bot, FileText, Tag, Settings, Check, Cloud, CloudOff, ArrowLeft, 
  LogOut, User, Lock, Loader, KeyRound
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword, // <--- Added for Email Login
  createUserWithEmailAndPassword, // <--- Added for Sign Up
  signInWithCustomToken,
  onAuthStateChanged,
  signOut,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  serverTimestamp 
} from 'firebase/firestore';

// ==========================================
// FIREBASE CONFIGURATION
// ==========================================
const localFirebaseConfig = {
  apiKey: "AIzaSyBvjPLVDEcTfFPf7sprjQQmJ2OasG69fIE",
  authDomain: "mindflow-portfolio.firebaseapp.com",
  projectId: "mindflow-portfolio",
  storageBucket: "mindflow-portfolio.firebasestorage.app",
  messagingSenderId: "948437959652",
  appId: "1:948437959652:web:52927a9a89671c16abbdf1"
};

const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : localFirebaseConfig;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'mindflow-v1';

// ==========================================
// CUSTOM HOOKS
// ==========================================

// Auth Hook: Handles all login methods
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        try { await signInWithCustomToken(auth, __initial_auth_token); } catch (err) { console.error(err); }
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginGoogle = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Login failed:", error);
      setAuthError(error.message);
      setLoading(false);
    }
  };

  const loginEmail = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError("Invalid email or password.");
      setLoading(false);
    }
  };

  const signupEmail = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message.includes('email-already-in-use') ? "Email already exists." : "Signup failed.");
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, loading, authError, loginGoogle, loginEmail, signupEmail, logout };
};

// Data Hook: Real-time Notes Sync
const useNotes = (user) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const notesCollection = collection(db, 'artifacts', appId, 'users', user.uid, 'notes');
    const q = query(notesCollection);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetchedNotes.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
      setNotes(fetchedNotes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addNote = async (noteData) => {
    if (!user) return;
    const col = collection(db, 'artifacts', appId, 'users', user.uid, 'notes');
    return await addDoc(col, { ...noteData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  };

  const updateNote = async (id, data) => {
    if (!user) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'notes', id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  };

  const deleteNote = async (id) => {
    if (!user) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'notes', id);
    await deleteDoc(docRef);
  };

  return { notes, loading, addNote, updateNote, deleteNote };
};

// ==========================================
// COMPONENT: LOGIN SCREEN (Dual Mode)
// ==========================================

const LoginScreen = ({ loginGoogle, loginEmail, signupEmail, authError, loading }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      signupEmail(email, password);
    } else {
      loginEmail(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MindFlow</h1>
          <p className="text-slate-400">Professional AI Note-Taking</p>
        </div>

        {/* --- Email/Pass Form --- */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {authError && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
              {authError}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-slate-500" size={18} />
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 ml-1">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 text-slate-500" size={18} />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50"
          >
            {loading ? <Loader className="animate-spin mx-auto" size={20} /> : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">Or continue with</span></div>
        </div>

        {/* --- Google Button --- */}
        <button 
          onClick={loginGoogle}
          disabled={loading}
          className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Google
        </button>

        <div className="mt-6 text-center text-sm text-slate-400">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-cyan-400 hover:underline font-medium">
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <Link to="/" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT: MINDFLOW APP (PROTECTED)
// ==========================================

const MindFlow = () => {
  const { user, loading: authLoading, loginGoogle, loginEmail, signupEmail, authError, logout } = useAuth();
  const { notes, loading: notesLoading, addNote, updateNote, deleteNote } = useNotes(user);
  
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [localTitle, setLocalTitle] = useState('');
  const [localContent, setLocalContent] = useState('');

  useEffect(() => {
    if (!activeNoteId && notes.length > 0) {
      setActiveNoteId(notes[0].id);
    } else if (activeNoteId && !notes.find(n => n.id === activeNoteId)) {
      setActiveNoteId(notes.length > 0 ? notes[0].id : null);
    }
  }, [notes, activeNoteId]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  useEffect(() => {
    if (activeNote) {
      setLocalTitle(activeNote.title || '');
      setLocalContent(activeNote.content || '');
    }
  }, [activeNoteId]); 

  const filteredNotes = notes.filter(note => 
    (note.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (note.content?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddNote = async () => {
    const newNote = { title: 'Untitled Note', content: '', tags: [] };
    try {
      const docRef = await addNote(newNote);
      setActiveNoteId(docRef.id);
      showNotification('New note created');
    } catch (e) { showNotification('Error creating note', 'error'); }
  };

  const onTitleChange = (e) => {
    const val = e.target.value;
    setLocalTitle(val);
    setSaveStatus('saving');
    if (window.titleTimeout) clearTimeout(window.titleTimeout);
    window.titleTimeout = setTimeout(() => {
      updateNote(activeNoteId, { title: val }).then(() => setSaveStatus('saved'));
    }, 1000);
  };

  const onContentChange = (e) => {
    const val = e.target.value;
    setLocalContent(val);
    setSaveStatus('saving');
    if (window.contentTimeout) clearTimeout(window.contentTimeout);
    window.contentTimeout = setTimeout(() => {
      updateNote(activeNoteId, { content: val }).then(() => setSaveStatus('saved'));
    }, 1000);
  };

  const handleAIEnhance = () => {
    if (!localContent) return;
    setIsAiLoading(true);
    setTimeout(() => {
      const aiSummary = `\n\n✨ AI Analysis:\nThis note covers key concepts regarding ${localTitle}. Suggested action items included.`;
      const newContent = localContent + aiSummary;
      setLocalContent(newContent);
      updateNote(activeNoteId, { content: newContent });
      if (!activeNote?.tags?.includes('AI Enhanced')) {
        updateNote(activeNoteId, { tags: [...(activeNote?.tags || []), 'AI Enhanced'] });
      }
      setIsAiLoading(false);
      showNotification('AI Analysis Complete');
    }, 1500);
  };

  if (authLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><Loader className="animate-spin" /></div>;
  if (!user) return <LoginScreen loginGoogle={loginGoogle} loginEmail={loginEmail} signupEmail={signupEmail} authError={authError} loading={authLoading} />;

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden animate-fadeIn">
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col relative`}>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center"><Sparkles size={18} className="text-white" /></div>
            MindFlow
          </div>
        </div>
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <div className="flex items-center gap-2 overflow-hidden">
            {user.photoURL ? <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center"><User size={14} className="text-slate-300" /></div>}
            <div className="text-xs truncate"><p className="text-white font-medium truncate w-32">{user.displayName || user.email}</p><p className="text-slate-500">Online</p></div>
          </div>
          <button onClick={logout} className="p-1.5 hover:bg-slate-800 rounded text-slate-500 hover:text-red-400"><LogOut size={16} /></button>
        </div>
        <div className="p-4 space-y-4">
          <button onClick={handleAddNote} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-all shadow-lg shadow-cyan-900/20"><Plus size={20} /> New Note</button>
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-cyan-400" size={18} />
            <input type="text" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-800 text-sm rounded-lg pl-10 pr-4 py-2.5 border border-slate-700 focus:border-cyan-500 focus:outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          {notesLoading && <div className="text-center py-4"><Loader className="animate-spin inline text-slate-500" /></div>}
          {!notesLoading && filteredNotes.map(note => (
            <div key={note.id} onClick={() => setActiveNoteId(note.id)} className={`p-3 rounded-lg cursor-pointer group transition-all border border-transparent ${activeNoteId === note.id ? 'bg-slate-800 border-slate-700 shadow-md' : 'hover:bg-slate-800/50'}`}>
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-semibold truncate ${activeNoteId === note.id ? 'text-cyan-400' : 'text-slate-200'}`}>{note.title || 'Untitled'}</h3>
                <button onClick={(e) => { e.stopPropagation(); if(confirm('Delete?')) deleteNote(note.id); }} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"><Trash2 size={14} /></button>
              </div>
              <p className="text-xs text-slate-500 truncate">{note.content || 'No content'}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-800"><Link to="/" className="text-xs flex items-center justify-center gap-2 text-slate-500 hover:text-cyan-400 w-full py-2 hover:bg-slate-800 rounded-lg"><ArrowLeft size={12} /> Back to Portfolio</Link></div>
      </div>

      <div className="flex-1 flex flex-col h-full bg-slate-950 relative">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`absolute top-4 left-4 z-10 p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white border border-slate-700`}>{isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}</button>

        {activeNote ? (
          <>
            <div className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-sm pl-16">
              <div className="flex items-center gap-4">
                 <span className="text-xs flex items-center gap-1 transition-colors duration-300">
                  {saveStatus === 'saving' ? <><Cloud className="animate-pulse text-yellow-500" size={12}/> Saving...</> : <><Check className="text-green-500" size={12}/> Synced</>}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleAIEnhance} disabled={isAiLoading} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                  {isAiLoading ? "Analyzing..." : <><Bot size={16} /> AI Enhance</>}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
              <input type="text" value={localTitle} onChange={onTitleChange} placeholder="Note Title" className="w-full bg-transparent text-4xl font-bold text-white placeholder-slate-600 border-none focus:outline-none mb-6" />
              <div className="flex flex-wrap gap-2 mb-8">
                {activeNote.tags?.map((tag, i) => <span key={i} className="flex items-center gap-1 px-3 py-1 bg-cyan-900/20 text-cyan-400 rounded-full text-xs font-medium border border-cyan-900/50"><Tag size={12} /> {tag}</span>)}
                <button onClick={() => { const t = prompt("Tag:"); if(t) updateNote(activeNote.id, { tags: [...(activeNote.tags||[]), t] }) }} className="text-xs text-slate-500 hover:text-cyan-400 flex items-center gap-1 px-2 py-1 border border-slate-800 rounded-full"><Plus size={12} /> Add Tag</button>
              </div>
              <textarea value={localContent} onChange={onContentChange} placeholder="Start typing..." className="w-full h-[calc(100vh-300px)] bg-transparent text-lg text-slate-300 placeholder-slate-700 border-none focus:outline-none resize-none leading-relaxed" />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-600"><FileText size={64} className="mb-4 opacity-20" /><p>Select a note or create new</p></div>
        )}
      </div>
      {notification && (
        <div className="absolute bottom-8 right-8 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-2xl border border-slate-700 flex items-center gap-3 animate-fadeInUp z-50">
          <div className={`${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'} rounded-full p-1`}>{notification.type === 'error' ? <X size={12} className="text-white" /> : <Check size={12} className="text-white" />}</div>{notification.msg}
        </div>
      )}
    </div>
  );
};

// ==========================================
// COMPONENT: PORTFOLIO
// ==========================================

const Portfolio = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');
  const form = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => setFormStatus('success'), 1500); 
  };

  const navLinks = ['About', 'Skills', 'Projects', 'Contact'];
  const SKILLS = [
    { category: "Frontend", icon: <Code2 className="w-6 h-6" />, items: ["React.js", "Next.js", "Tailwind CSS", "TypeScript"] },
    { category: "Backend", icon: <Terminal className="w-6 h-6" />, items: ["Node.js", "Firebase", "Python", "Express"] },
    { category: "DevOps", icon: <Cpu className="w-6 h-6" />, items: ["Git", "GitHub", "Vercel", "Docker"] }
  ];
  const PROJECTS = [
    {
      id: 1,
      title: "MindFlow AI Notes",
      description: "A secure, cloud-synced note-taking app with AI capabilities. Features real-time syncing across devices using Firebase Firestore.",
      tags: ["React", "Firebase", "Auth", "Firestore"],
      links: { demo: "/mindflow", code: "#" }, // Internal link
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "E-Commerce Dashboard",
      description: "A comprehensive analytics dashboard for online retailers featuring real-time data visualization and inventory management.",
      tags: ["React", "Chart.js", "Node.js", "MongoDB"],
      links: { demo: "#", code: "#" },
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      title: "AI Content Generator",
      description: "SaaS application that uses OpenAI's API to help marketers generate blog posts and social media captions instantly.",
      tags: ["React", "Tailwind", "OpenAI API", "Stripe"],
      links: { demo: "#", code: "#" },
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="bg-slate-900 min-h-screen text-slate-300 font-sans">
      <nav className="fixed w-full z-50 bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-800 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 font-bold text-2xl text-cyan-400 font-mono">&lt;Abdelrhman/&gt;</div>
            <div className="hidden md:block ml-10 flex items-baseline space-x-8">
              {navLinks.map((item, i) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-all hover:-translate-y-1"><span className="text-cyan-400 mr-1">0{i+1}.</span> {item}</a>
              ))}
            </div>
            <div className="md:hidden"><button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2">{isOpen ? <X size={24} /> : <Menu size={24} />}</button></div>
          </div>
        </div>
        {isOpen && <div className="md:hidden bg-slate-900 border-b border-slate-800 px-2 pt-2 pb-3 space-y-1">{navLinks.map(item => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400">{item}</a>)}</div>}
      </nav>

      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden pt-16">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <p className="text-cyan-400 font-mono mb-4 text-lg inline-flex items-center gap-2"><Sparkles size={16} /> Hi, my name is</p>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">Abdelrhman Maged Ahmed.</h1>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-400 mb-8 min-h-[60px]">I build things for the web.</h2>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mt-12">
              <a href="#projects" className="px-8 py-4 bg-cyan-500 text-slate-900 font-bold rounded-lg hover:scale-105 transition-all">Check out my work</a>
              <a href="#contact" className="px-8 py-4 border border-cyan-500 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500/10 transition-all">Contact Me</a>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="py-32 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-16"><span className="text-cyan-400 mr-2">03.</span> Some Things I've Built</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {PROJECTS.map((proj) => (
                <div key={proj.id} className="group bg-slate-800 rounded-xl overflow-hidden hover:-translate-y-3 transition-all duration-500 shadow-xl border border-slate-700/50 flex flex-col h-full">
                  <div className="h-52 overflow-hidden relative">
                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                    <div className="absolute bottom-4 right-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        {proj.links.demo.startsWith('/') ? (
                          <Link to={proj.links.demo} className="p-2 bg-slate-900/90 text-white rounded-full hover:bg-cyan-500 transition-colors shadow-lg"><ExternalLink size={18} /></Link>
                        ) : (
                          <a href={proj.links.demo} className="p-2 bg-slate-900/90 text-white rounded-full hover:bg-cyan-500 transition-colors shadow-lg"><ExternalLink size={18} /></a>
                        )}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400">{proj.title}</h3>
                    <p className="text-slate-400 mb-6 text-sm flex-grow">{proj.description}</p>
                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-700/50">{proj.tags.map(tag => <span key={tag} className="text-xs font-mono text-cyan-400 bg-cyan-900/10 px-2 py-1 rounded">#{tag}</span>)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-slate-950 py-8 text-center text-slate-500 text-sm font-mono border-t border-slate-900">
        <p>Designed & Built by Abdelrhman Maged Ahmed</p>
      </footer>
    </div>
  );
};

// ==========================================
// MAIN APP ROUTER
// ==========================================

export default function App() {
  return (
    <>
      <style>{`
        @keyframes float { 0% { transform: translate(0px, 0px); } 50% { transform: translate(20px, 20px); } 100% { transform: translate(0px, 0px); } }
        @keyframes float-delayed { 0% { transform: translate(0px, 0px); } 50% { transform: translate(-20px, 20px); } 100% { transform: translate(0px, 0px); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        html { scroll-behavior: smooth; }
      `}</style>
      
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/mindflow" element={<MindFlow />} />
      </Routes>
    </>
  );
}